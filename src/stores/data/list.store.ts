import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';

import type {
  TraktApiIds,
  TraktCollectionGetQuery,
  TraktFavoriteGetQuery,
  TraktListItemsGetQuery,
  TraktWatchlistGetQuery,
} from '@dvcol/trakt-http-client/models';

import type { AddOrRemoveListQuery, AnyList, AnyListDateTypes, ListEntity, ListItemTypes, ListTypes } from '~/models/list.model';

import type { StorePagination } from '~/models/pagination.model';

import { ListScrollItemType } from '~/models/list-scroll.model';
import { ListType } from '~/models/list.model';
import { PageSize } from '~/models/page-size.model';
import { ErrorService } from '~/services/error.service';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { useActivityStore } from '~/stores/data/activity.store';
import { useListsStoreRefs } from '~/stores/data/lists.store';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { useI18n } from '~/utils/i18n.utils';
import { ErrorCount, type ErrorDictionary } from '~/utils/retry.utils';
import { debounceLoading, useBelowThreshold, useLoadingPlaceholder, useSearchFilter } from '~/utils/store.utils';
import { clearProxy } from '~/utils/vue.utils';

type MinimalItem = Partial<Record<ListItemTypes, { ids: Pick<TraktApiIds, 'trakt'> }>>;

type ListDictionary = Record<string, Partial<Record<ListItemTypes, Record<string, boolean>>>>;
type ListDictionaryLoading = Record<string, boolean>;

type ListErrorDictionary = Partial<Record<ListEntity['type'], ErrorDictionary>>;

type ListTypeLoading = Partial<Record<ListTypes, boolean>>;
type ListDictionaryItemLoading = Partial<Record<ListTypes, Partial<Record<ListItemTypes, Record<string, boolean>>>>>;

type ListItemQuery = TraktWatchlistGetQuery | TraktFavoriteGetQuery | TraktCollectionGetQuery | TraktListItemsGetQuery;
type ListQuery = { page?: number; limit?: number; list?: ListEntity };

const getListId = (list: Record<string, { ids: Pick<TraktApiIds, 'trakt'> }>): string | number | undefined => {
  if (!list) return;
  if ('id' in list) return list.id?.ids?.trakt;
  if ('person' in list) return list.person?.ids.trakt;
  if ('movie' in list) return list.movie?.ids.trakt;
  if ('episode' in list) return list.episode?.ids.trakt;
  if ('season' in list) return list.season?.ids.trakt;
  if ('show' in list) return list.show?.ids.trakt;
};

const ListStoreConstants = {
  Store: 'data.list',
  LocalPageSize: 'data.list.page-size',
} as const;

export const anyListDateGetter = (item: AnyList) => {
  if (!item) return;
  if ('listed_at' in item) return item.listed_at;
  if ('last_collected_at' in item) return item.last_collected_at;
  if ('collected_at' in item) return item.collected_at;
};

export const useListStore = defineStore(ListStoreConstants.Store, () => {
  const firstLoad = ref(true);
  const loading = ref(true);
  const pageSize = ref(PageSize.p100);
  const pagination = ref<StorePagination>({});

  const typeLoading = reactive<ListTypeLoading>({});
  const typeItemLoading = reactive<ListDictionaryItemLoading>({});

  const listItems = ref<AnyList[]>([]);
  const searchList = ref('');
  const threshold = ref(4);

  const listDictionary = reactive<ListDictionary>({});
  const listDictionaryLoading = reactive<ListDictionaryLoading>({});

  const listErrors = reactive<ListErrorDictionary>({});
  ErrorService.registerDictionary('list', listErrors);

  const saveState = async () => storage.local.set(ListStoreConstants.LocalPageSize, pageSize.value);
  const restoreState = async () => {
    const restored = await storage.local.get<number>(ListStoreConstants.LocalPageSize);
    if (restored === pageSize.value) return;
    if (restored !== undefined) pageSize.value = restored;
  };

  const clearState = () => {
    listItems.value = [];
    pagination.value = {};
    searchList.value = '';

    clearProxy(typeLoading);
    clearProxy(typeItemLoading);

    clearProxy(listDictionary);
    clearProxy(listDictionaryLoading);
  };

  const updateDictionary = (list: ListEntity, item: MinimalItem, remove?: boolean) => {
    if (![ListType.List, ListType.Watchlist, ListType.Favorites].map(String).includes(list.type)) return;
    const _id = list.id.toString();

    if (!listDictionary[_id]) listDictionary[_id] = {};
    if ('movie' in item && item.movie?.ids?.trakt !== undefined) {
      if (!listDictionary[_id].movie) listDictionary[_id].movie = {};
      listDictionary[_id].movie![item.movie.ids.trakt.toString()] = !remove;
    } else if ('episode' in item && item.episode?.ids?.trakt !== undefined) {
      if (!listDictionary[_id].episode) listDictionary[_id].episode = {};
      listDictionary[_id].episode![item.episode.ids.trakt.toString()] = !remove;
    } else if ('season' in item && item.season?.ids?.trakt !== undefined) {
      if (!listDictionary[_id].season) listDictionary[_id].season = {};
      listDictionary[_id].season![item.season.ids.trakt.toString()] = !remove;
    } else if ('show' in item && item.show?.ids?.trakt !== undefined) {
      if (!listDictionary[_id].show) listDictionary[_id].show = {};
      listDictionary[_id].show![item.show.ids.trakt.toString()] = !remove;
    }
  };

  const { activeList } = useListsStoreRefs();

  const belowThreshold = useBelowThreshold(threshold, pagination);
  const loadingPlaceholder = useLoadingPlaceholder<AnyList>(pageSize);
  const filteredListItems = useSearchFilter<AnyListDateTypes, AnyList>(listItems, searchList, anyListDateGetter);

  const { user, isAuthenticated } = useAuthSettingsStoreRefs();

  const fetchItems = async (list: ListEntity, query: ListItemQuery = {}, force?: boolean) => {
    let _query = { ...query };
    let response;

    try {
      if (list.type === ListType.Watchlist) {
        response = await TraktService.watchlist(_query as TraktWatchlistGetQuery, force);
        delete listErrors[list.type]?.[JSON.stringify(_query)];
      } else if (list.type === ListType.Favorites) {
        response = await TraktService.favorites(_query as TraktFavoriteGetQuery, force);
        delete listErrors[list.type]?.[JSON.stringify(_query)];
      } else if (list.type === ListType.Collection && list.scope) {
        _query.type = list.scope;
        response = await TraktService.collection(_query as TraktCollectionGetQuery, force);
        delete listErrors[list.type]?.[JSON.stringify(_query)];
      } else if (list.id !== undefined) {
        _query = { ..._query, id: user.value, list_id: list.id.toString() } as TraktListItemsGetQuery;
        response = await TraktService.list(_query as TraktListItemsGetQuery, force);
        delete listErrors[list.type]?.[JSON.stringify(_query)];
      }
    } catch (e) {
      if (!listErrors[list.type]) listErrors[list.type] = {};
      listErrors[list.type]![JSON.stringify(_query)] = ErrorCount.fromDictionary(listErrors[list.type]!, JSON.stringify(_query), e);
      throw e;
    }

    if (!response) throw new Error('Invalid list type');

    return response;
  };

  const { evicted } = useActivityStore();
  const fetchListItems = async (
    { page, limit = pageSize.value, list = activeList.value }: ListQuery = {},
    { parallel = false, updateState = true, force }: { parallel?: boolean; updateState?: boolean; force?: boolean } = {},
  ) => {
    if (!isAuthenticated.value) {
      Logger.error('Cannot fetch list, user is not authenticated');
      return;
    }
    if (!firstLoad.value && !parallel && loading.value) {
      Logger.warn('Already fetching list');
      return;
    }
    if (firstLoad.value) firstLoad.value = false;

    Logger.debug('Fetching List', { list, page, limit });

    if (!parallel) loading.value = true;
    typeLoading[list.type] = true;
    listDictionaryLoading[list.id.toString()] = true;

    let clearLoading: (() => void) | undefined;
    if (updateState) clearLoading = debounceLoading(listItems, loadingPlaceholder, { clear: !page, time: 1000 }).clearLoading;

    try {
      const response = await fetchItems(list, { pagination: { page, limit } }, force);
      const newData = response.data.map<AnyList>((item, index) => {
        updateDictionary(list, item as MinimalItem);
        if ('id' in item) return item;
        return { ...item, id: getListId(item as MinimalItem) || `${page ?? 0}-${index}` };
      });
      if (updateState) {
        pagination.value = response.pagination ?? {};
        listItems.value = page ? [...listItems.value.filter(l => l.type !== ListScrollItemType.Loading), ...newData] : newData;
      }
      evicted.watchlist = false;
    } catch (e) {
      Logger.error('Failed to fetch list');
      NotificationService.error(`Failed to fetch list '${list}'`, e);
      if (updateState) listItems.value = listItems.value.filter(l => l.type !== ListScrollItemType.Loading);
      throw e;
    } finally {
      clearLoading?.();
      if (!parallel) loading.value = false;
      typeLoading[list.type] = false;
      listDictionaryLoading[list.id.toString()] = false;
    }
  };

  const fetchAll = async (lists: ListEntity[], query?: Omit<ListQuery, 'list'>, force?: boolean) => {
    if (!lists.length) return;
    loading.value = true;
    await Promise.all(lists.map(list => fetchListItems({ list, ...query }, { parallel: true, updateState: false, force })));
    loading.value = false;
  };

  const i18n = useI18n('common', 'notification');

  const setItemListLoading = ({
    listType,
    itemType,
    itemId,
    loading: _loading,
  }: {
    listType: ListTypes;
    itemType: ListItemTypes;
    itemId: Pick<TraktApiIds, 'trakt'>;
    loading: boolean;
  }) => {
    if (!typeItemLoading[listType]) typeItemLoading[listType] = {};
    if (!typeItemLoading[listType]![itemType]) typeItemLoading[listType]![itemType] = {};
    typeItemLoading[listType][itemType][itemId.trakt.toString()] = _loading;
  };

  const addToOrRemoveFromList = async ({ list, itemType, itemIds, date, remove }: AddOrRemoveListQuery) => {
    const listId = list.id?.toString();
    const listType = list.type;
    const userId = list.owner?.username;
    const _itemIds = Array.isArray(itemIds) ? itemIds : [itemIds];

    if (!listType) throw new Error('List type is missing');
    if (listType === ListType.List || listType === ListType.Collaboration) {
      if (listId === undefined) throw new Error('List ID is missing');
      if (userId === undefined) throw new Error('User ID is missing');
    }

    if (!isAuthenticated.value) {
      Logger.error('Cannot adding item to list, user is not authenticated');
      return;
    }

    const filter = _itemIds.filter(id => {
      if (typeItemLoading[listType]?.[itemType]?.[id.trakt.toString()]) {
        Logger.warn('Already adding item to list', id);
        return false;
      }
      return true;
    });
    if (!filter.length) return;

    filter.forEach(id => setItemListLoading({ listType, itemType, itemId: id, loading: true }));
    typeLoading[listType] = true;

    try {
      if (listType === ListType.History) {
        if (remove) {
          await TraktService.remove.history({ [`${itemType}s`]: filter.map(ids => ({ ids })) });
        } else {
          const _date = date ? new Date(date).toISOString() : undefined;
          await TraktService.add.history({ [`${itemType}s`]: filter.map(ids => ({ watched_at: _date, ids })) });
        }
      } else if (listType === ListType.Watchlist) {
        await TraktService[remove ? 'remove' : 'add'].watchlist({ [`${itemType}s`]: filter.map(ids => ({ ids })) });
        filter.forEach(ids => updateDictionary(list, { [itemType]: { ids } }, remove));
      } else if (listType === ListType.Favorites) {
        await TraktService[remove ? 'remove' : 'add'].favorites({ [`${itemType}s`]: filter.map(ids => ({ ids })) });
        filter.forEach(ids => updateDictionary(list, { [itemType]: { ids } }, remove));
      } else if (listType === ListType.Collection) {
        if (remove) {
          await TraktService.remove.collection({ [`${itemType}s`]: filter.map(ids => ({ ids })) });
        } else {
          const _date = date ? new Date(date).toISOString() : undefined;
          await TraktService.add.collection({ [`${itemType}s`]: filter.map(ids => ({ collected_at: _date, ids })) });
        }
      } else if ([ListType.List, ListType.Collaboration].includes(listType)) {
        await TraktService[remove ? 'remove' : 'add'].list({ id: userId!, list_id: listId, [`${itemType}s`]: filter.map(ids => ({ ids })) });
        filter.forEach(ids => updateDictionary(list, { [itemType]: { ids } }, remove));
      } else {
        Logger.error(`Unknown list type ${listType}.`);
      }
      NotificationService.message.success(
        [
          i18n(itemType, 'common', 'media', 'type'),
          i18n(remove ? 'removed_from' : 'added_to'),
          i18n(list.type, 'common', 'list').toLowerCase(),
          list.type === ListType.List ? `'${list.name}'` : '',
        ]
          .filter(Boolean)
          .join(' '),
      );
    } catch (e) {
      Logger.error('Failed to add item to list');
      NotificationService.error(
        `Failed to add item to ${i18n(list.type, 'common', 'list').toLowerCase()}${list.type === ListType.List ? ` '${list.name}'` : ''}`,
        e,
      );
      throw e;
    } finally {
      filter.forEach(id => setItemListLoading({ listType, itemType, itemId: id, loading: false }));
      typeLoading[listType] = false;
    }
  };

  const isListLoading = (listId: ListEntity['id']) => computed(() => listDictionaryLoading[listId.toString()]);
  const isItemInList = (listId: ListEntity['id'], itemType: ListItemTypes, itemId: string | number) =>
    listDictionary[listId.toString()]?.[itemType]?.[itemId.toString()];

  const isItemListLoading = ({ listType, itemType, itemId }: { listType: ListTypes; itemType: ListItemTypes; itemId: string | number }) =>
    typeItemLoading[listType]?.[itemType]?.[itemId];

  const isListTypeLoading = (listType: ListTypes) => computed(() => typeLoading[listType]);

  const initListStore = async () => {
    await restoreState();

    watch(pageSize, async () => {
      await fetchListItems();
      searchList.value = '';
      await saveState();
    });

    watch(activeList, async () => {
      await fetchListItems();
      searchList.value = '';
    });
  };

  return {
    listLoading: loading,
    listItems,
    pagination,
    pageSize,
    searchList,
    clearState,
    belowThreshold,
    loadingPlaceholder,
    fetchListItems,
    fetchAll,
    filteredListItems,
    initListStore,
    isListLoading,
    isItemInList,
    isListTypeLoading,
    isItemListLoading,
    addToOrRemoveFromList,
    setItemListLoading,
  };
});

export const useListStoreRefs = () => storeToRefs(useListStore());

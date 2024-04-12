import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';

import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';

import type { TraktCollection } from '~/models/trakt/trakt-collection.model';
import type { TraktFavoriteItem } from '~/models/trakt/trakt-favorite.model';
import type { TraktApiIds } from '~/models/trakt/trakt-id.model';
import type { TraktListItem } from '~/models/trakt/trakt-list.model';
import type { TraktUser } from '~/models/trakt/trakt-user.model';
import type { TraktWatchlist } from '~/models/trakt/trakt-watchlist.model';

import IconCheckedList from '~/components/icons/IconCheckedList.vue';
import IconGrid from '~/components/icons/IconGrid.vue';
import IconHeart from '~/components/icons/IconHeart.vue';
import IconList from '~/components/icons/IconList.vue';
import { ListScrollItemType } from '~/models/list-scroll.model';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
import { useI18n } from '~/utils';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounceLoading, useBelowThreshold, useLoadingPlaceholder, useSearchFilter } from '~/utils/store.utils';

export type AnyList =
  | TraktListItem
  | TraktWatchlist
  | TraktFavoriteItem
  | (TraktCollection & { id: number | string; type?: typeof ListScrollItemType.loading });

export const ListType = {
  List: 'list',
  Collaboration: 'collaboration',
  Collection: 'collection',
  Watchlist: 'watchlist',
  Favorites: 'favorites',
  History: 'history',
} as const;

export type ListTypes = (typeof ListType)[keyof typeof ListType];

export const DefaultListId = {
  Watchlist: 'watchlist',
  Favorites: 'favorites',
  MovieCollection: 'movie-collection',
  ShowCollection: 'show-collection',
  History: 'history',
} as const;

export type DefaultListIds = (typeof DefaultListId)[keyof typeof DefaultListId];

export type ListEntity = {
  type: ListTypes;
  id: number | string | DefaultListIds;
  name: string;
  owner?: TraktUser;
  scope?: 'movies' | 'shows';
};

export type AnyListDateTypes = 'listed_at' | 'last_collected_at' | 'collected_at';
export const anyListDateGetter = (item: AnyList) => {
  if (!item) return;
  if ('listed_at' in item) return item.listed_at;
  if ('last_collected_at' in item) return item.last_collected_at;
  if ('collected_at' in item) return item.collected_at;
};

export const DefaultLists = {
  Watchlist: { type: ListType.Watchlist, id: DefaultListId.Watchlist, name: 'list_type__watchlist' },
  Favorites: { type: ListType.Favorites, id: DefaultListId.Favorites, name: 'list_type__favorites' },
  MovieCollection: { type: ListType.Collection, id: DefaultListId.MovieCollection, scope: 'movies', name: 'list_type__collection_movie' },
  ShowCollection: { type: ListType.Collection, id: DefaultListId.ShowCollection, scope: 'shows', name: 'list_type__collection_show' },
} as const satisfies Record<string, ListEntity>;

const DefaultList: ListEntity[] = Object.values(DefaultLists);

export const useListsStore = defineStore('data.lists', () => {
  const firstLoad = ref(true);
  const loading = ref(true);

  const lists = ref<ListEntity[]>(DefaultList);
  const activeList = ref<ListEntity>(DefaultLists.Watchlist);

  const saveState = async () =>
    storage.local.set('data.lists', {
      lists: [...lists.value],
      activeList: activeList.value,
    });

  const restoreState = async () => {
    const restored = await storage.local.get<{
      lists: ListEntity[];
      activeList: ListEntity;
    }>('data.lists');
    if (restored?.lists) lists.value = restored.lists;
    if (restored?.activeList === activeList.value) return;
    if (restored?.activeList) activeList.value = restored.activeList;
  };

  const clearState = () => {
    lists.value = DefaultList;
    activeList.value = DefaultLists.Watchlist;
  };

  const { user } = useUserSettingsStoreRefs();

  const fetchLists = async () => {
    if (!firstLoad.value && loading.value) {
      console.warn('Already fetching lists');
      return;
    }
    if (firstLoad.value) firstLoad.value = false;

    console.info('Fetching Lists');
    loading.value = true;
    try {
      const [personals, collaborations] = await Promise.all([TraktService.lists(user.value), TraktService.lists(user.value, true)]);
      lists.value = [
        ...DefaultList,
        ...personals.map(
          l =>
            ({
              type: ListType.List,
              name: l.name,
              id: l.ids.trakt,
              owner: l.user,
            }) satisfies ListEntity,
        ),
        ...collaborations.map(
          l =>
            ({
              type: ListType.Collaboration,
              name: l.name,
              id: l.ids.trakt,
              owner: l.user,
            }) satisfies ListEntity,
        ),
      ];
      if (activeList.value?.id && !lists.value.some(l => activeList.value.id === l?.id)) {
        console.warn('Active List not found, falling back to default', activeList.value);
        activeList.value = DefaultLists.Watchlist;
      }
    } catch (e) {
      console.error('Failed to fetch lists');
      NotificationService.error('Failed to fetch lists', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const getIcon = (list: ListEntity) => {
    switch (list.type) {
      case ListType.Collection:
        return IconGrid;
      case ListType.Watchlist:
        return IconCheckedList;
      case ListType.Favorites:
        return IconHeart;
      case ListType.Collaboration:
        return IconList;
      default:
        return IconList;
    }
  };

  const initListsStore = async () => {
    await restoreState();

    watch(activeList, async _value => {
      await saveState();
    });
  };

  return { listsLoading: loading, lists, activeList, fetchLists, clearState, initListsStore, getIcon };
});

export const useListsStoreRefs = () => storeToRefs(useListsStore());

type ListItemTypes = 'show' | 'season' | 'episode' | 'movie';
type MinimalItem = Partial<Record<ListItemTypes, { ids: Pick<TraktApiIds, 'trakt'> }>>;

type ListDictionary = Record<string, Partial<Record<ListItemTypes, Record<string, boolean>>>>;
type ListDictionaryLoading = Record<string, boolean>;

type ListTypeLoading = Partial<Record<ListTypes, boolean>>;
type ListDictionaryItemLoading = Partial<Record<ListTypes, Partial<Record<ListItemTypes, Record<string, boolean>>>>>;

export const useListStore = defineStore('data.list', () => {
  const firstLoad = ref(true);
  const loading = ref(true);
  const pageSize = ref(100);
  const pagination = ref<TraktClientPagination>();

  const typeLoading = reactive<ListTypeLoading>({});
  const typeItemLoading = reactive<ListDictionaryItemLoading>({});

  const listItems = ref<AnyList[]>([]);
  const searchList = ref('');
  const threshold = ref(10);

  const listDictionary = reactive<ListDictionary>({});
  const listDictionaryLoading = reactive<ListDictionaryLoading>({});

  const saveState = async () => storage.local.set('data.list.page-size', pageSize.value);
  const restoreState = async () => {
    const restored = await storage.local.get<number>('data.list.page-size');
    if (restored === pageSize.value) return;
    if (restored) pageSize.value = restored;
  };

  const clearState = () => {
    listItems.value = [];
    pagination.value = undefined;
    searchList.value = '';

    Object.assign(typeLoading, {});
    Object.assign(typeItemLoading, {});

    Object.assign(listDictionary, {});
    Object.assign(listDictionaryLoading, {});
  };

  const updateDictionary = (list: ListEntity, item: MinimalItem, remove?: boolean) => {
    if (![ListType.List, ListType.Watchlist].map(String).includes(list.type)) return;
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

  const { user } = useUserSettingsStoreRefs();

  const fetchListItems = async ({
    page,
    limit = pageSize.value,
    list = activeList.value,
  }: { page?: number; limit?: number; list?: ListEntity } = {}) => {
    if (!firstLoad.value && loading.value) {
      console.warn('Already fetching list');
      return;
    }
    if (firstLoad.value) firstLoad.value = false;

    console.info('Fetching List', { list, page, limit });

    loading.value = true;
    typeLoading[list.type] = true;
    listDictionaryLoading[list.id.toString()] = true;
    const timeout = debounceLoading(listItems, loadingPlaceholder, !page);
    try {
      const query = {
        pagination: {
          page,
          limit,
        },
      };

      let response;

      if (list.type === ListType.Watchlist) {
        response = await TraktService.watchlist(query);
      } else if (list.type === ListType.Favorites) {
        response = await TraktService.favorites(query);
      } else if (list.type === ListType.Collection && list.scope) {
        response = await TraktService.collection({
          ...query,
          type: list.scope,
        });
      } else if (list.id !== undefined) {
        response = await TraktService.list({ ...query, id: user.value, list_id: list.id.toString() });
      } else {
        throw new Error('Invalid list type');
      }
      const newData = response.data.map<AnyList>((item, index) => {
        updateDictionary(list, item as MinimalItem);
        if ('id' in item) return item;
        return { ...item, id: `${page}-${index}` };
      });
      pagination.value = response.pagination;
      listItems.value = page ? [...listItems.value.filter(l => l.type !== ListScrollItemType.loading), ...newData] : newData;
    } catch (e) {
      console.error('Failed to fetch list');
      NotificationService.error(`Failed to fetch list '${list}'`, e);
      listItems.value = listItems.value.filter(l => l.type !== ListScrollItemType.loading);
      throw e;
    } finally {
      clearTimeout(timeout);
      loading.value = false;
      typeLoading[list.type] = false;
      listDictionaryLoading[list.id.toString()] = false;
    }
  };

  const i18n = useI18n('common', 'notification');

  const addToOrRemoveFromList = async ({
    list,
    itemType,
    itemIds,
    date,
    remove,
  }: {
    list: ListEntity;
    itemType: ListItemTypes;
    itemIds: Pick<TraktApiIds, 'trakt'>;
    date?: Date | string | number;
    remove?: boolean;
  }) => {
    const listId = list.id?.toString();
    const listType = list.type;
    const userId = list.owner?.username;

    if (!listType) throw new Error('List type is missing');
    if (listType === ListType.List || listType === ListType.Collaboration) {
      if (listId === undefined) throw new Error('List ID is missing');
      if (userId === undefined) throw new Error('User ID is missing');
    }

    if (typeItemLoading[listType]?.[itemType]?.[itemIds.trakt.toString()]) {
      console.warn('Already adding item to list');
      return;
    }

    console.info(`${remove ? 'Removing' : 'Adding'} item to list`, listId, itemType, itemIds);

    if (!typeItemLoading[listType]) typeItemLoading[listType] = {};
    if (!typeItemLoading[listType]![itemType]) typeItemLoading[listType]![itemType] = {};
    typeItemLoading[listType]![itemType]![itemIds.trakt.toString()] = true;
    typeLoading[listType] = true;

    try {
      if (listType === ListType.History) {
        if (remove) {
          await TraktService.remove.history({ [`${itemType}s`]: [{ ids: itemIds }] });
        } else {
          const _date = date ? new Date(date).toISOString() : undefined;
          await TraktService.add.history({ [`${itemType}s`]: [{ watched_at: _date, ids: itemIds }] });
        }
      } else if (listType === ListType.Watchlist) {
        await TraktService[remove ? 'remove' : 'add'].watchlist({ [`${itemType}s`]: [{ ids: itemIds }] });
        updateDictionary(list, { [itemType]: { ids: itemIds } }, remove);
      } else if (listType === 'favorites') {
        await TraktService[remove ? 'remove' : 'add'].favorites({ [`${itemType}s`]: [{ ids: itemIds }] });
      } else if (listType === ListType.Collection) {
        console.info(`${remove ? 'Removing' : 'adding'} item to/form collection`, { [`${itemType}s`]: [{ ids: itemIds }] });
        if (remove) {
          await TraktService.remove.collection({ [`${itemType}s`]: [{ ids: itemIds }] });
        } else {
          const _date = date ? new Date(date).toISOString() : undefined;
          await TraktService.add.collection({ [`${itemType}s`]: [{ collected_at: _date, ids: itemIds }] });
        }
      } else if ([ListType.List, ListType.Collaboration].includes(listType)) {
        await TraktService[remove ? 'remove' : 'add'].list({ id: userId!, list_id: listId, [`${itemType}s`]: [{ ids: itemIds }] });
        updateDictionary(list, { [itemType]: { ids: itemIds } }, remove);
      } else {
        console.error(`Unknown list type ${listType}.`);
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
        {
          duration: 50000,
        },
      );
    } catch (e) {
      console.error('Failed to add item to list');
      NotificationService.error(`Failed to add item to list '${list.name}'`, e);
      throw e;
    } finally {
      typeItemLoading[listType]![itemType]![itemIds.trakt.toString()] = false;
      typeLoading[listType] = false;
    }
  };

  const isListLoading = (listId: ListEntity['id']) => computed(() => listDictionaryLoading[listId.toString()]);
  const isItemInList = (listId: ListEntity['id'], itemType: ListItemTypes, itemId: string | number) =>
    computed(() => {
      return listDictionary[listId.toString()]?.[itemType]?.[itemId.toString()];
    });
  const isItemListLoading = ({ listType, itemType, itemId }: { listType: ListTypes; itemType: ListItemTypes; itemId: string | number }) =>
    computed(() => typeItemLoading[listType]?.[itemType]?.[itemId]);

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
    filteredListItems,
    initListStore,
    isListLoading,
    isItemInList,
    isListTypeLoading,
    isItemListLoading,
    addToOrRemoveFromList,
  };
});

export const useListStoreRefs = () => storeToRefs(useListStore());

import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';

import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';

import type { TraktCollection } from '~/models/trakt/trakt-collection.model';
import type { TraktFavoriteItem } from '~/models/trakt/trakt-favorite.model';
import type { TraktListItem } from '~/models/trakt/trakt-list.model';

import type { TraktWatchlist } from '~/models/trakt/trakt-watchlist.model';

import IconCheckedList from '~/components/icons/IconCheckedList.vue';
import IconGrid from '~/components/icons/IconGrid.vue';
import IconHeart from '~/components/icons/IconHeart.vue';
import IconList from '~/components/icons/IconList.vue';
import { ListScrollItemType } from '~/models/list-scroll.model';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
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
} as const;

export type ListTypes = (typeof ListType)[keyof typeof ListType];

export type ListEntity = {
  type: ListTypes;
  name: string;
  id: number | string;
  scope?: 'movies' | 'shows';
};

export type AnyListDateTypes = 'listed_at' | 'last_collected_at' | 'collected_at';
export const anyListDateGetter = (item: AnyList) => {
  if (!item) return;
  if ('listed_at' in item) return item.listed_at;
  if ('last_collected_at' in item) return item.last_collected_at;
  if ('collected_at' in item) return item.collected_at;
};

export const DefaultListId = {
  Watchlist: 'watchlist',
  Favorites: 'favorites',
  MovieCollection: 'movie-collection',
  ShowCollection: 'show-collection',
} as const;

export const DefaultLists: Record<string, ListEntity> = {
  Watchlist: { type: ListType.Watchlist, id: DefaultListId.Watchlist, name: 'list_type__watchlist' },
  Favorites: { type: ListType.Favorites, id: DefaultListId.Favorites, name: 'list_type__favorites' },
  MovieCollection: { type: ListType.Collection, id: DefaultListId.MovieCollection, scope: 'movies', name: 'list_type__collection_movie' },
  ShowCollection: { type: ListType.Collection, id: DefaultListId.ShowCollection, scope: 'shows', name: 'list_type__collection_show' },
} as const;

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
              type: 'list',
              name: l.name,
              id: l.ids.trakt,
            }) satisfies ListEntity,
        ),
        ...collaborations.map(
          l =>
            ({
              type: 'collaboration',
              name: l.name,
              id: l.ids.trakt,
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

  return { loading, lists, activeList, fetchLists, clearState, initListsStore, getIcon };
});

export const useListsStoreRefs = () => storeToRefs(useListsStore());

type ListDictionary = Record<string, Record<string, boolean>>;
type ListDictionaryLoading = Record<string, boolean>;

export const useListStore = defineStore('data.list', () => {
  const firstLoad = ref(true);
  const loading = ref(true);
  const pageSize = ref(100);
  const pagination = ref<TraktClientPagination>();

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

    Object.assign(listDictionary, {});
    Object.assign(listDictionaryLoading, {});
  };

  const addToDictionary = (list: ListEntity, item: AnyList) => {
    if (![ListType.List, ListType.Watchlist].map(String).includes(list.type)) return;
    if (!listDictionary[list.id]) listDictionary[list.id] = {};
    if ('movie' in item && item.movie?.ids?.trakt) {
      listDictionary[list.id][item.movie.ids.trakt] = true;
    } else if ('show' in item && item.show?.ids?.trakt) {
      listDictionary[list.id][item.show.ids.trakt] = true;
    } else if ('season' in item && item.season?.ids?.trakt) {
      listDictionary[list.id][item.season.ids.trakt] = true;
    } else if ('episode' in item && item.episode?.ids?.trakt) {
      listDictionary[list.id][item.episode.ids.trakt] = true;
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

    console.info('Fetching List', list);
    loading.value = true;
    listDictionaryLoading[list.id] = true;
    const timeout = debounceLoading(listItems, loadingPlaceholder, !page);
    try {
      const query = {
        pagination: {
          page,
          limit,
        },
      };

      let response;

      if (list.type === 'watchlist') {
        response = await TraktService.watchlist(query);
      } else if (list.type === 'favorites') {
        response = await TraktService.favorites(query);
      } else if (list.type === 'collection' && list.scope) {
        response = await TraktService.collection({
          ...query,
          type: list.scope,
        });
      } else if (list.id) {
        response = await TraktService.list({ ...query, id: user.value, list_id: list.id.toString() });
      } else {
        throw new Error('Invalid list type');
      }
      const newData = response.data.map((item, index) => {
        addToDictionary(list, item as AnyList);
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
      listDictionaryLoading[list.id] = false;
    }
  };

  const isListLoading = (listId: ListEntity['id']) => computed(() => listDictionaryLoading[listId]);
  const isItemInList = (listId: ListEntity['id'], itemId: string | number) => computed(() => listDictionary[listId]?.[itemId]);

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
    loading,
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
  };
});

export const useListStoreRefs = () => storeToRefs(useListStore());

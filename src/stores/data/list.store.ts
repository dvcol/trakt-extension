import { defineStore, storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';

import type { TraktCollection } from '~/models/trakt/trakt-collection.model';
import type { TraktListItem } from '~/models/trakt/trakt-list.model';

import type { TraktWatchlist } from '~/models/trakt/trakt-watchlist.model';

import { TraktService } from '~/services/trakt.service';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
import { debounceLoading, useBelowThreshold, useLoadingPlaceholder, useSearchFilter } from '~/utils/store.utils';

export type AnyList = TraktListItem | TraktWatchlist | (TraktCollection & { id: number });
export type ListType = {
  type: 'list' | 'collaboration' | 'collection' | 'watchlist';
  name: string;
  id?: number | string;
  scope?: 'movies' | 'shows';
};

export type AnyListDateTypes = 'listed_at' | 'last_collected_at' | 'collected_at';
export const anyListDateGetter = (item: AnyList) => {
  if (!item) return;
  if ('listed_at' in item) return item.listed_at;
  if ('last_collected_at' in item) return item.last_collected_at;
  if ('collected_at' in item) return item.collected_at;
};

export const DefaultLists: Record<string, ListType> = {
  Watchlist: { type: 'watchlist', name: 'list_type__watchlist' },
  MovieCollection: { type: 'collection', scope: 'movies', name: 'list_type__collection_movie' },
  ShowCollection: { type: 'collection', scope: 'shows', name: 'list_type__collection_show' },
} as const;

const DefaultList: ListType[] = [DefaultLists.Watchlist, DefaultLists.MovieCollection, DefaultLists.ShowCollection];

export const useListsStore = defineStore('data.lists', () => {
  const loading = ref(true);

  const lists = ref<ListType[]>(DefaultList);
  const activeList = ref<ListType>(DefaultLists.Watchlist);

  const clearState = () => {
    lists.value = DefaultList;
    activeList.value = DefaultLists.Watchlist;
  };

  const { user } = useUserSettingsStoreRefs();

  const fetchLists = async () => {
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
            }) satisfies ListType,
        ),
        ...collaborations.map(
          l =>
            ({
              type: 'collaboration',
              name: l.name,
              id: l.ids.trakt,
            }) satisfies ListType,
        ),
      ];
    } catch (e) {
      console.error('Failed to fetch lists');
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return { loading, lists, activeList, fetchLists, clearState };
});

export const useListsStoreRefs = () => storeToRefs(useListsStore());

export const useListStore = defineStore('data.list', () => {
  const loading = ref(true);
  const pageSize = ref(100);
  const pagination = ref<TraktClientPagination>();

  const listItems = ref<AnyList[]>([]);
  const searchList = ref('');
  const threshold = ref(10);

  const clearState = () => {
    listItems.value = [];
    pagination.value = undefined;
    searchList.value = '';
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
  }: { page?: number; limit?: number; list?: ListType } = {}) => {
    console.info('Fetching List', list);
    loading.value = true;
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
      console.info('Fetched List', list, response);
      const newData = response.data.map((item, index) => {
        if ('id' in item) return item;
        return { ...item, id: index };
      });
      pagination.value = response.pagination;
      listItems.value = page ? [...listItems.value.filter(h => h.id >= 0), ...newData] : newData;
    } catch (e) {
      console.error('Failed to fetch list');
      listItems.value = listItems.value.filter(h => h.id >= 0);
      throw e;
    } finally {
      clearTimeout(timeout);
      loading.value = false;
    }
  };

  watch(pageSize, async () => {
    await fetchListItems();
    searchList.value = '';
  });

  watch(activeList, async () => {
    await fetchListItems();
    searchList.value = '';
  });

  return { loading, listItems, pagination, pageSize, searchList, clearState, belowThreshold, loadingPlaceholder, fetchListItems, filteredListItems };
});

export const useListStoreRefs = () => storeToRefs(useListStore());

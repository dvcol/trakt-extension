import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

import type { TraktCollection } from '~/models/trakt/trakt-collection.model';
import type { TraktListItem } from '~/models/trakt/trakt-list.model';
import type { TraktWatchlist } from '~/models/trakt/trakt-watchlist.model';

import { TraktService } from '~/services/trakt.service';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';

export type AnyList = TraktListItem | TraktWatchlist | TraktCollection;
export type ListType = {
  type: 'list' | 'collaboration' | 'collection' | 'watchlist';
  name: string;
  id?: number | string;
};

export const DefaultLists: Record<string, ListType> = {
  Watchlist: { type: 'watchlist', name: 'list_type__watchlist' },
  MovieCollection: { type: 'collection', name: 'list_type__collection_movie' },
  ShowCollection: { type: 'collection', name: 'list_type__collection_show' },
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

  const list = ref<AnyList[]>([]);
  const searchList = ref('');

  return { loading, list, pageSize, searchList };
});

export const useListStoreRefs = () => storeToRefs(useListStore());

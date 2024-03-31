import { defineStore, storeToRefs } from 'pinia';

import { ref, watch } from 'vue';

import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';
import type { TraktSearchResult, TraktSearchType } from '~/models/trakt/trakt-search.model';

import { type ListScrollItem, ListScrollItemType } from '~/models/list-scroll.model';

import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounceLoading, useLoadingPlaceholder } from '~/utils/store.utils';

export type SearchResult = Omit<TraktSearchResult, 'type'> & {
  id: ListScrollItem['id'];
  type: ListScrollItem['type'];
};

export const SupportedSearchType: TraktSearchType[] = ['episode', 'show', 'movie', 'person'];
export const DefaultSearchType: TraktSearchType[] = ['show', 'movie'];

export const useSearchStore = defineStore('data.search', () => {
  const types = ref<TraktSearchType[]>(DefaultSearchType);
  const query = ref(false);
  const search = ref('');

  const pageSize = ref(100);
  const pagination = ref<TraktClientPagination>();

  const loading = ref(false);
  const firstLoad = ref(true);

  const searchResults = ref<SearchResult[]>([]);

  const clearState = () => {
    types.value = DefaultSearchType;
    query.value = false;
    pagination.value = undefined;
    search.value = '';
  };

  const saveState = async () =>
    storage.local.set('data.search', {
      types: [...types.value],
      query: query.value,
    });

  const restoreState = async () => {
    const restored = await storage.local.get<{
      types: TraktSearchType[];
      query: boolean;
    }>('data.search');
    if (restored?.types) types.value = restored.types;
    if (restored?.query) query.value = restored.query;
  };

  const loadingPlaceholder = useLoadingPlaceholder<SearchResult>(pageSize);

  const fetchSearchResults = async ({ page, limit = pageSize.value }: { page?: number; limit?: number } = {}) => {
    if (!search.value?.trim()) {
      pagination.value = undefined;
      searchResults.value = [];
      return;
    }
    if (!firstLoad.value && loading.value) {
      console.warn('Already fetching history');
      return;
    }
    if (firstLoad.value) firstLoad.value = false;

    console.info('Fetch search results', { types: types.value, query: query.value, search: search.value });

    loading.value = true;
    const timeout = debounceLoading(searchResults, loadingPlaceholder, !page);
    try {
      const response = await TraktService.search({
        type: types.value,
        escape: !query.value,
        query: search.value,
        pagination: {
          page,
          limit,
        },
      });

      const data = response.data.map((item, index) => ({
        ...item,
        id: `${page}-${index}`,
      }));

      pagination.value = response.pagination;
      searchResults.value = page ? [...searchResults.value.filter(s => s.type !== ListScrollItemType.loading), ...data] : data;
    } catch (e) {
      console.error('Failed to fetch search query');
      NotificationService.error('Failed to fetch search query', e);
      searchResults.value = searchResults.value.filter(s => s.type !== ListScrollItemType.loading);
      throw e;
    } finally {
      clearTimeout(timeout);
      loading.value = false;
    }
  };

  const initSearchStore = async () => {
    await restoreState();

    watch(search, () => fetchSearchResults());

    watch(pageSize, async () => {
      await fetchSearchResults();
      await saveState();
    });

    watch(types, async () => {
      await fetchSearchResults();
      await saveState();
    });
  };

  return {
    types,
    query,
    search,
    clearState,
    initSearchStore,
    fetchSearchResults,
    searchResults,
    loading,
    pageSize,
    pagination,
  };
});

export const useSearchStoreRefs = () => storeToRefs(useSearchStore());

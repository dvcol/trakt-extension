import { defineStore, storeToRefs } from 'pinia';

import { ref, watch } from 'vue';

import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';
import type { TraktSearchResult, TraktSearchType } from '~/models/trakt/trakt-search.model';

import { type ListScrollItem, ListScrollItemType } from '~/models/list-scroll.model';

import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { logger } from '~/stores/settings/log.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';
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

  const history = ref<Set<string>>(new Set());

  const saveHistory = debounce(() => storage.local.set('data.search.history', [...history.value]), 1000);
  const saveSearch = debounce(() => storage.local.set('data.search.last', { value: search.value, date: Date.now() }), 1000);

  const addToHistory = (value: string = search.value) => {
    const newArray = [...history.value, value].filter(Boolean);
    // Keep only the last 100 elements
    if (newArray.length > 100) {
      history.value = new Set(newArray.slice(-100));
    } else {
      history.value = new Set(newArray);
    }
    return Promise.all([saveHistory(), saveSearch()]);
  };

  const clearState = () => {
    types.value = DefaultSearchType;
    query.value = false;
    pagination.value = undefined;
    search.value = '';
    history.value = new Set();
  };

  const saveState = async () =>
    storage.local.set('data.search', {
      types: [...types.value],
      query: query.value,
      pageSize: pageSize.value,
      search: {
        value: search.value,
        date: new Date(),
      },
    });

  const restoreState = async () => {
    const [_state, _history, _search] = await Promise.all([
      storage.local.get<{
        types: TraktSearchType[];
        query: boolean;
        pageSize: number;
      }>('data.search'),
      storage.local.get<string[]>('data.search.history'),
      storage.local.get<{
        value: string;
        date: Date;
      }>('data.search.last'),
    ]);

    if (_state?.types) types.value = _state.types;
    if (_state?.query) query.value = _state.query;
    if (_state?.pageSize) pageSize.value = _state.pageSize;
    if (_history) history.value = new Set(_history);

    if (_search?.date) {
      const day = new Date(_search.date).toLocaleDateString();
      if (day === new Date().toLocaleDateString()) search.value = _search.value;
    }
  };

  const loadingPlaceholder = useLoadingPlaceholder<SearchResult>(pageSize);

  const fetchSearchResults = async ({ page, limit = pageSize.value }: { page?: number; limit?: number } = {}) => {
    if (!search.value?.trim()) {
      pagination.value = undefined;
      searchResults.value = [];
      return;
    }
    if (!firstLoad.value && loading.value) {
      logger.warn('Already fetching history');
      return;
    }
    if (firstLoad.value) firstLoad.value = false;

    logger.debug('Fetching search results', { types: types.value, query: query.value, search: search.value });

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
      logger.error('Failed to fetch search query');
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

    watch(search, async () => {
      await fetchSearchResults();
      await addToHistory().catch(e => logger.error('Failed to save search history', e));
    });

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
    history,
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

import { defineStore, storeToRefs } from 'pinia';

import { reactive, ref, watch } from 'vue';

import type { TraktClientPagination, TraktSearch, TraktSearchResult, TraktSearchType } from '@dvcol/trakt-http-client/models';

import type { ErrorDictionary } from '~/utils/retry.utils';

import { type ListScrollItem, ListScrollItemType } from '~/models/list-scroll.model';
import { PageSize } from '~/models/page-size.model';
import { ErrorService } from '~/services/error.service';

import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';

import { TraktService } from '~/services/trakt.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';
import { ErrorCount } from '~/utils/retry.utils';
import { debounceLoading, useLoadingPlaceholder } from '~/utils/store.utils';
import { clearProxy } from '~/utils/vue.utils';

export type SearchResult = Omit<TraktSearchResult, 'type'> & {
  id: ListScrollItem['id'];
  type: ListScrollItem['type'];
};

export const SupportedSearchType: TraktSearchType[] = ['episode', 'show', 'movie', 'person'];
export const DefaultSearchType: TraktSearchType[] = ['show', 'movie'];

const SearchStoreConstants = {
  Store: 'data.search',
  LocalHistory: 'data.search.history',
  LocalLast: 'data.search.last',
} as const;

export const useSearchStore = defineStore(SearchStoreConstants.Store, () => {
  const types = ref<TraktSearchType[]>(DefaultSearchType);
  const query = ref(false);
  const search = ref('');

  const searchErrors = reactive<ErrorDictionary>({});
  ErrorService.registerDictionary('search', searchErrors);

  const pageSize = ref(PageSize.p100);
  const pagination = ref<TraktClientPagination>();

  const loading = ref(false);
  const firstLoad = ref(true);

  const searchResults = ref<SearchResult[]>([]);

  const history = ref<Set<string>>(new Set());

  const saveHistory = debounce(() => storage.local.set(SearchStoreConstants.LocalHistory, [...history.value]), 1000);
  const saveSearch = debounce(() => storage.local.set(SearchStoreConstants.LocalLast, { value: search.value, date: Date.now() }), 1000);

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
    clearProxy(searchErrors);
  };

  const saveState = async () =>
    storage.local.set(SearchStoreConstants.Store, {
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
      }>(SearchStoreConstants.Store),
      storage.local.get<string[]>(SearchStoreConstants.LocalHistory),
      storage.local.get<{
        value: string;
        date: Date;
      }>(SearchStoreConstants.LocalLast),
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
      Logger.warn('Already fetching history');
      return;
    }
    if (firstLoad.value) firstLoad.value = false;

    Logger.debug('Fetching search results', { types: types.value, query: query.value, search: search.value });

    loading.value = true;
    const timeout = debounceLoading(searchResults, loadingPlaceholder, !page);
    const request: TraktSearch = {
      type: types.value,
      escape: !query.value,
      query: search.value,
      pagination: { page, limit },
    };
    try {
      const response = await TraktService.search(request);
      delete searchErrors[JSON.stringify(request)];

      const data = response.data.map((item, index) => ({
        ...item,
        id: `${page}-${index}`,
      }));

      pagination.value = response.pagination;
      searchResults.value = page ? [...searchResults.value.filter(s => s.type !== ListScrollItemType.loading), ...data] : data;
    } catch (e) {
      Logger.error('Failed to fetch search query');
      NotificationService.error('Failed to fetch search query', e);
      searchResults.value = searchResults.value.filter(s => s.type !== ListScrollItemType.loading);
      searchErrors[JSON.stringify(request)] = ErrorCount.fromDictionary(searchErrors, JSON.stringify(request), e);
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
      await addToHistory().catch(e => Logger.error('Failed to save search history', e));
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

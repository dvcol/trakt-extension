import { TraktApiExtended } from '@dvcol/trakt-http-client/models';

import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';

import type { TraktApiIds, TraktClientPagination, TraktHistory, TraktHistoryGetQuery } from '@dvcol/trakt-http-client/models';

import type { ErrorDictionary } from '~/utils/retry.utils';

import { PageSize } from '~/models/page-size.model';
import { ErrorService } from '~/services/error.service';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounceLoading, useBelowThreshold, useLoadingPlaceholder, useSearchFilter } from '~/utils/store.utils';
import { clearProxy } from '~/utils/vue.utils';

type IdDictionary = Record<string, Partial<TraktApiIds>>;

type HistoryDictionary = {
  movie?: IdDictionary;
  episode?: IdDictionary;
};

const HistoryStoreConstants = {
  Store: 'data.history',
} as const;

type HistoryState = {
  pageSize: number;
  historyStart?: Date | number;
  historyEnd?: Date | number;
  extended?: boolean;
};

export const useHistoryStore = defineStore(HistoryStoreConstants.Store, () => {
  const firstLoad = ref(true);
  const loading = ref(true);
  const pageSize = ref(PageSize.p100);
  const history = ref<TraktHistory[]>([]);
  const historyDictionary = reactive<HistoryDictionary>({});
  const pagination = ref<TraktClientPagination>();
  const extended = ref(false);

  const searchHistory = ref('');

  const historyStart = ref<Date | undefined>(undefined);
  const historyEnd = ref<Date | undefined>(undefined);

  const threshold = ref(10);

  const historyErrors = reactive<ErrorDictionary>({});
  ErrorService.registerDictionary('history', historyErrors);

  const saveState = async () =>
    storage.local.set<HistoryState>(HistoryStoreConstants.Store, {
      pageSize: pageSize.value,
      historyStart: historyStart.value?.getTime(),
      historyEnd: historyEnd.value?.getTime(),
      extended: extended.value,
    });

  const restoreState = async () => {
    const restored = await storage.local.get<HistoryState>(HistoryStoreConstants.Store);

    if (restored?.pageSize !== undefined) pageSize.value = restored.pageSize;
    if (restored?.historyStart) historyStart.value = new Date(restored.historyStart);
    if (restored?.historyEnd) historyEnd.value = new Date(restored.historyEnd);
    if (restored?.extended) extended.value = restored.extended;
  };

  const clearState = () => {
    history.value = [];
    pagination.value = undefined;
    searchHistory.value = '';
    historyStart.value = undefined;
    historyEnd.value = undefined;
    clearProxy(historyErrors);
    clearProxy(historyDictionary);
  };

  const belowThreshold = useBelowThreshold(threshold, pagination);
  const loadingPlaceholder = useLoadingPlaceholder<TraktHistory>(pageSize);
  const filteredHistory = useSearchFilter(history, searchHistory, 'watched_at');

  const fetchHistory = async ({
    page,
    limit = pageSize.value,
    start = historyStart.value,
    end = historyEnd.value,
  }: { page?: number; limit?: number; start?: Date; end?: Date } = {}) => {
    if (!firstLoad.value && loading.value) {
      Logger.warn('Already fetching history');
      return;
    }
    if (firstLoad.value) firstLoad.value = false;

    Logger.debug('Fetching History', { page, limit, start, end });
    loading.value = true;
    const timeout = debounceLoading(history, loadingPlaceholder, !page);
    const query: TraktHistoryGetQuery = {
      pagination: { page, limit },
      start_at: start?.toISOString(),
      end_at: end?.toISOString(),
    };
    if (extended.value) query.extended = TraktApiExtended.Full;
    try {
      const response = await TraktService.history(query);
      pagination.value = response.pagination;
      history.value = page ? [...history.value.filter(h => h.id >= 0), ...response.data] : response.data;
      delete historyErrors[JSON.stringify(query)];
    } catch (e) {
      Logger.error('Failed to fetch history');
      NotificationService.error('Failed to fetch history', e);
      history.value = history.value.filter(h => h.id >= 0);
      throw e;
    } finally {
      clearTimeout(timeout);
      loading.value = false;
    }
  };

  const setHistoryRange = async ({ start, end }: { start?: Date; end?: Date } = {}) => {
    if (start === historyStart.value && end === historyEnd.value) return;
    historyStart.value = start;
    historyEnd.value = end;
    await fetchHistory({ start, end });
    await saveState();
  };

  const getHistory = (id: number, type: TraktHistory['type']) => computed(() => historyDictionary[type]?.[id]);
  const getMovieHistory = (id: number) => getHistory(id, 'movie');
  const getEpisodeHistory = (id: number) => getHistory(id, 'episode');

  const initHistoryStore = async () => {
    await restoreState();

    watch(pageSize, async () => {
      await fetchHistory();
      searchHistory.value = '';
      await saveState();
    });

    watch(history, newHistory => {
      clearProxy(historyDictionary);
      newHistory?.forEach(h => {
        if (h.type === 'movie' && 'movie' in h) {
          if (!historyDictionary.movie) historyDictionary.movie = {};
          historyDictionary.movie[h.movie.ids.trakt] = h.movie.ids;
        } else if (h.type === 'episode' && 'episode' in h) {
          if (!historyDictionary.episode) historyDictionary.episode = {};
          historyDictionary.episode[h.episode.ids.trakt] = h.episode.ids;
        }
      });
    });
  };

  return {
    history,
    loading,
    loadingPlaceholder,
    threshold,
    belowThreshold,
    pagination,
    pageSize,
    fetchHistory,
    searchHistory,
    filteredHistory,
    historyStart,
    historyEnd,
    setHistoryRange,
    getHistory,
    getMovieHistory,
    getEpisodeHistory,
    clearState,
    initHistoryStore,
    extended: computed({
      get: () => extended.value,
      set: (value: boolean) => {
        extended.value = value;
        saveState().catch(e => Logger.error('Failed to save history extended state', e));
      },
    }),
  };
});

export const useHistoryStoreRefs = () => storeToRefs(useHistoryStore());

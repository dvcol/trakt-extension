import { defineStore, storeToRefs } from 'pinia';
import { reactive, ref, watch } from 'vue';

import type { TraktClientPagination, TraktHistory, TraktHistoryGetQuery } from '@dvcol/trakt-http-client/models';

import type { ErrorDictionary } from '~/utils/retry.utils';

import { ErrorService } from '~/services/error.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { logger } from '~/stores/settings/log.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounceLoading, useBelowThreshold, useLoadingPlaceholder, useSearchFilter } from '~/utils/store.utils';
import { clearProxy } from '~/utils/vue.utils';

const HistoryStoreConstants = {
  Store: 'data.history',
} as const;

export const useHistoryStore = defineStore(HistoryStoreConstants.Store, () => {
  const firstLoad = ref(true);
  const loading = ref(true);
  const pageSize = ref(100);
  const history = ref<TraktHistory[]>([]);
  const pagination = ref<TraktClientPagination>();

  const searchHistory = ref('');

  const historyStart = ref<Date | undefined>(undefined);
  const historyEnd = ref<Date | undefined>(undefined);

  const threshold = ref(10);

  const historyErrors = reactive<ErrorDictionary>({});
  ErrorService.registerDictionary('history', historyErrors);

  const saveState = async () =>
    storage.local.set(HistoryStoreConstants.Store, {
      pageSize: pageSize.value,
      historyStart: historyStart.value?.getTime(),
      historyEnd: historyEnd.value?.getTime(),
    });

  const restoreState = async () => {
    const restored = await storage.local.get<{
      pageSize: number;
      historyStart: Date | undefined;
      historyEnd: Date | undefined;
    }>(HistoryStoreConstants.Store);

    if (restored?.pageSize) pageSize.value = restored.pageSize;
    if (restored?.historyStart) historyStart.value = new Date(restored.historyStart);
    if (restored?.historyEnd) historyEnd.value = new Date(restored.historyEnd);
  };

  const clearState = () => {
    history.value = [];
    pagination.value = undefined;
    searchHistory.value = '';
    historyStart.value = undefined;
    historyEnd.value = undefined;
    clearProxy(historyErrors);
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
      logger.warn('Already fetching history');
      return;
    }
    if (firstLoad.value) firstLoad.value = false;

    logger.debug('Fetching History', { page, limit, start, end });
    loading.value = true;
    const timeout = debounceLoading(history, loadingPlaceholder, !page);
    const query: TraktHistoryGetQuery = {
      pagination: { page, limit },
      start_at: start?.toISOString(),
      end_at: end?.toISOString(),
    };
    try {
      const response = await TraktService.history(query);
      pagination.value = response.pagination;
      history.value = page ? [...history.value.filter(h => h.id >= 0), ...response.data] : response.data;
      delete historyErrors[JSON.stringify(query)];
    } catch (e) {
      logger.error('Failed to fetch history');
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

  const initHistoryStore = async () => {
    await restoreState();

    watch(pageSize, async () => {
      await fetchHistory();
      searchHistory.value = '';
      await saveState();
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
    clearState,
    initHistoryStore,
  };
});

export const useHistoryStoreRefs = () => storeToRefs(useHistoryStore());

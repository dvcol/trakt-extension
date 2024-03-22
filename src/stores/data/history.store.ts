import { defineStore, storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';
import type { TraktHistory } from '~/models/trakt/trakt-history.model';

import { TraktService } from '~/services/trakt.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounceLoading, useBelowThreshold, useLoadingPlaceholder, useSearchFilter } from '~/utils/store.utils';

export const useHistoryStore = defineStore('data.history', () => {
  const firstLoad = ref(true);
  const loading = ref(true);
  const pageSize = ref(100);
  const history = ref<TraktHistory[]>([]);
  const pagination = ref<TraktClientPagination>();

  const searchHistory = ref('');

  const historyStart = ref<Date | undefined>(undefined);
  const historyEnd = ref<Date | undefined>(undefined);

  const threshold = ref(10);

  const saveState = async () =>
    storage.local.set('data.history', {
      pageSize: pageSize.value,
      historyStart: historyStart.value?.getTime(),
      historyEnd: historyEnd.value?.getTime(),
    });

  const restoreState = async () => {
    const restored = await storage.local.get<{
      pageSize: number;
      historyStart: Date | undefined;
      historyEnd: Date | undefined;
    }>('data.history');

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
      console.warn('Already fetching history');
      return;
    }
    if (firstLoad.value) firstLoad.value = false;

    console.info('Fetching History', { page, limit, start, end });
    loading.value = true;
    const timeout = debounceLoading(history, loadingPlaceholder, !page);
    try {
      const response = await TraktService.history({
        pagination: {
          page,
          limit,
        },
        start_at: start?.toISOString(),
        end_at: end?.toISOString(),
      });
      pagination.value = response.pagination;
      history.value = page ? [...history.value.filter(h => h.id >= 0), ...response.data] : response.data;
    } catch (e) {
      console.error('Failed to fetch history');
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

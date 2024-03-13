import { defineStore, storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';
import type { TraktHistory } from '~/models/trakt/trakt-history.model';

import { TraktService } from '~/services/trakt.service';

export const useHistoryStore = defineStore('data.history', () => {
  const loading = ref(true);
  const pageSize = ref(100);
  const history = ref<TraktHistory[]>([]);
  const pagination = ref<TraktClientPagination>();
  const threshold = ref(10);

  const belowThreshold = computed(
    () =>
      pagination.value?.page &&
      pagination.value?.pageCount &&
      pagination.value.page !== pagination.value.pageCount &&
      pagination.value.page < threshold.value,
  );
  const loadingPlaceholder = computed<TraktHistory[]>(() =>
    Array(pageSize.value)
      .fill({ id: -1 })
      .map((_, i) => ({ id: -1 * (i + 1) }) as TraktHistory),
  );

  const searchHistory = ref('');
  const filteredHistory = computed<TraktHistory[]>(() => {
    if (!searchHistory.value) return history.value;
    return history.value.filter((item: TraktHistory) => {
      if ('movie' in item && item.movie?.title?.toLowerCase().includes(searchHistory.value.toLowerCase())) return true;
      if ('show' in item && item.show.title?.toLowerCase().includes(searchHistory.value.toLowerCase())) return true;
      if ('episode' in item) {
        if (item.episode?.title?.toLowerCase().includes(searchHistory.value.toLowerCase())) return true;

        const shorthands = [
          `s${item.episode?.season?.toString().padStart(2, '0')}e${item.episode?.number?.toString().padStart(2, '0')}`,
          `${item.episode?.season}x${item.episode?.number}`,
        ];
        if (shorthands.some(shorthand => searchHistory.value.toLowerCase().includes(shorthand))) return true;
      }
      return !!(item?.watched_at && new Date(item.watched_at).toLocaleString().toLowerCase().includes(searchHistory.value.toLowerCase()));
    });
  });

  const historyStart = ref<Date | undefined>(undefined);
  const historyEnd = ref<Date | undefined>(undefined);

  const fetchHistory = async ({
    page,
    limit = pageSize.value,
    start = historyStart.value,
    end = historyEnd.value,
  }: { page?: number; limit?: number; start?: Date; end?: Date } = {}) => {
    console.info('Fetching History', { page, limit, start, end });
    loading.value = true;
    const timeout = setTimeout(() => {
      if (page) history.value = [...history.value, ...loadingPlaceholder.value];
      else history.value = [...loadingPlaceholder.value];
    }, 100);
    try {
      const response = await TraktService.traktClient.sync.history.get.cached({
        pagination: {
          page,
          limit,
        },
        start_at: start?.toISOString(),
        end_at: end?.toISOString(),
      });

      const data = await response.json();
      pagination.value = response.pagination;
      history.value = page ? [...history.value.filter(h => h.id >= 0), ...data] : data;
    } catch (e) {
      console.error('Failed to fetch history');
      history.value = history.value.filter(h => h.id >= 0);
      throw e;
    } finally {
      clearTimeout(timeout);
      loading.value = false;
    }
  };

  const setHistoryRange = ({ start, end }: { start?: Date; end?: Date } = {}) => {
    historyStart.value = start;
    historyEnd.value = end;
    return fetchHistory({ start, end });
  };

  watch(pageSize, async () => {
    await fetchHistory();
    searchHistory.value = '';
  });

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
  };
});

export const useHistoryStoreRefs = () => storeToRefs(useHistoryStore());

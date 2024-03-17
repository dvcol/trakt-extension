import { defineStore, storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';
import type { TraktHistory } from '~/models/trakt/trakt-history.model';

import { TraktService } from '~/services/trakt.service';

const codesRegex = /[sS]?\d+([eExX])\d+/g;
const getCodeRegex = (season: number, episode: number) => new RegExp(`^[sS]?0*${season}([eExX])0*${episode}$`);

export const useHistoryStore = defineStore('data.history', () => {
  const loading = ref(true);
  const pageSize = ref(100);
  const history = ref<TraktHistory[]>([]);
  const pagination = ref<TraktClientPagination>();

  const searchHistory = ref('');

  const historyStart = ref<Date | undefined>(undefined);
  const historyEnd = ref<Date | undefined>(undefined);

  const threshold = ref(10);

  const clearState = () => {
    history.value = [];
    pagination.value = undefined;
    searchHistory.value = '';
    historyStart.value = undefined;
    historyEnd.value = undefined;
  };

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

  const filteredHistory = computed<TraktHistory[]>(() => {
    if (!searchHistory.value) return history.value;
    const _searchRaw = searchHistory.value.toLowerCase().trim();
    const _searchCode = _searchRaw.match(codesRegex);
    const _search = _searchRaw.replace(codesRegex, '').trim();
    return history.value.filter((item: TraktHistory) => {
      if ('episode' in item) {
        const codeRegex = getCodeRegex(item.episode.season, item.episode.number);
        const matchCode = _searchCode?.some(_code => codeRegex.test(_code));
        if (_search && item.episode?.title?.toLowerCase().includes(_search)) return _searchCode ? matchCode : true;
        if (_search && 'show' in item && item.show.title?.toLowerCase().includes(_search)) return _searchCode ? matchCode : true;
        if (codeRegex.test(_searchRaw)) return true;
      }
      if (!_search) return false;
      if ('show' in item && item.show.title?.toLowerCase().includes(_search)) return true;
      if ('movie' in item && item.movie?.title?.toLowerCase().includes(_search)) return true;
      return !!(item?.watched_at && new Date(item.watched_at).toLocaleString().toLowerCase().includes(_search));
    });
  });

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
    clearState,
  };
});

export const useHistoryStoreRefs = () => storeToRefs(useHistoryStore());

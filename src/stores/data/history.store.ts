import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';
import type { TraktHistory } from '~/models/trakt/trakt-history.model';

import { TraktService } from '~/services/trakt.service';

export const useHistoryStore = defineStore('data.history', () => {
  const history = ref<TraktHistory[]>([]);
  const pagination = ref<TraktClientPagination>();

  const searchHistory = ref('');
  const filteredHistory = computed(() => {
    if (!searchHistory.value) return history.value;
    return history.value.filter((item: TraktHistory) => {
      if ('movie' in item) return item.movie?.title?.toLowerCase().includes(searchHistory.value.toLowerCase());
      if ('show' in item) {
        if (item.show?.title?.toLowerCase().includes(searchHistory.value.toLowerCase())) return true;
        if (item.episode?.title?.toLowerCase().includes(searchHistory.value.toLowerCase())) return true;
      }
      return false;
    });
  });

  const historyStart = ref<Date | undefined>(undefined);
  const historyEnd = ref<Date | undefined>(undefined);

  const fetchHistory = async ({ page, start = historyStart.value, end = historyEnd.value }: { page?: number; start?: Date; end?: Date } = {}) => {
    const response = await TraktService.traktClient.sync.history.get.cached({
      pagination: {
        page,
        limit: 30,
      },
      start_at: start?.toISOString(),
      end_at: end?.toISOString(),
    });

    const data = await response.json();
    pagination.value = response.pagination;
    history.value = page ? [...history.value, ...data] : data;
  };

  const setHistoryRange = ({ start, end }: { start?: Date; end?: Date } = {}) => {
    historyStart.value = start;
    historyEnd.value = end;
    return fetchHistory({ start, end });
  };

  return { history, pagination, fetchHistory, searchHistory, filteredHistory, historyStart, historyEnd, setHistoryRange };
});

export const useHistoryStoreRefs = () => storeToRefs(useHistoryStore());

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

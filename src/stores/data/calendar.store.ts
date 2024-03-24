import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import type { TraktCalendarMovie, TraktCalendarShow } from '~/models/trakt/trakt-calendar.model';

import { type ListScrollItem, type ListScrollItemTag, ListScrollItemType } from '~/models/list-scroll.model';

import { TraktService } from '~/services/trakt.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { DateUtils } from '~/utils/date.utils';
import { useSearchFilter } from '~/utils/store.utils';

export type CalendarItem = (TraktCalendarShow | TraktCalendarMovie | Record<never, never>) & {
  id: ListScrollItem['id'];
  type?: ListScrollItem['type'];
  date: Date;
  tags?: ListScrollItemTag[];
};

export const CalendarPlaceholder: Partial<CalendarItem> = {
  id: 'empty',
  type: ListScrollItemType.placeholder,
} as const;

const getPlaceholder = (date: Date) => ({ ...CalendarPlaceholder, id: `empty-${date.getTime()}`, date }) as CalendarItem;
const getLoadingPlaceholder = (date: Date) =>
  ({ ...getPlaceholder(date), id: `loading-${date.getTime()}`, type: ListScrollItemType.loading }) as CalendarItem;

export const getEmptyWeeks = (fromDate: Date, loading?: boolean) => {
  return Array(14)
    .fill(CalendarPlaceholder)
    .map((_, index) => {
      const date = DateUtils.next(index, fromDate);
      return loading ? getLoadingPlaceholder(date) : getPlaceholder(date);
    });
};

export const useCalendarStore = defineStore('data.calendar', () => {
  const firstLoad = ref(true);
  const loading = ref(true);
  const calendar = ref<CalendarItem[]>([]);

  const center = ref(new Date());
  const startCalendar = ref<Date>(DateUtils.weeks.previous(1, center.value));
  const endCalendar = ref<Date>(DateUtils.weeks.next(1, center.value));

  const weeks = ref(1);
  const days = computed(() => weeks.value * 7 * 2);

  const filter = ref('');

  const clearState = (date: Date = new Date()) => {
    calendar.value = [];
    center.value = date;
    startCalendar.value = DateUtils.weeks.previous(1, center.value);
    endCalendar.value = DateUtils.weeks.next(1, center.value);
  };

  const saveState = async () =>
    storage.local.set('data.calendar', {
      pageSize: weeks.value,
      startCalendar: startCalendar.value.getTime(),
      endCalendar: endCalendar.value.getTime(),
    });

  const restoreState = async () => {
    const restored = await storage.local.get<{
      pageSize: number;
      startCalendar: number;
      endCalendar: number;
    }>('data.calendar');

    if (restored?.pageSize) weeks.value = restored.pageSize;
    if (restored?.startCalendar) startCalendar.value = new Date(restored.startCalendar);
    if (restored?.endCalendar) endCalendar.value = new Date(restored.endCalendar);
  };

  const spaceDate = (data: CalendarItem[], startDate: Date, endDate: Date): CalendarItem[] => {
    const spacedData: CalendarItem[] = [];
    data?.forEach((item, index) => {
      if (index === 0) {
        // if the first item isn't the start date, add placeholders
        if (item.date.getTime() > startDate.getTime() && item.date.toLocaleDateString() !== startDate.toLocaleDateString()) {
          let previousDate: Date = item.date;
          while (previousDate.toLocaleDateString() !== startDate.toLocaleDateString()) {
            previousDate = DateUtils.previous(1, previousDate);
            spacedData.push(getPlaceholder(previousDate));
          }
        }
        return spacedData.push(item);
      }

      if (index === data.length - 1) {
        spacedData.push(item);

        // if the last item isn't one day before the end date, add placeholders
        const dayBeforeEnd = DateUtils.previous(1, endDate);
        if (item.date.getTime() < dayBeforeEnd.getTime() && item.date.toLocaleDateString() !== dayBeforeEnd.toLocaleDateString()) {
          let nextDate: Date = item.date;
          while (nextDate.toLocaleDateString() !== dayBeforeEnd.toLocaleDateString()) {
            nextDate = DateUtils.next(1, nextDate);
            spacedData.push(getPlaceholder(nextDate));
          }
        }
        return;
      }

      const previous = data[index - 1];

      if (item.date.toLocaleDateString() === previous.date.toLocaleDateString()) return spacedData.push(item);
      if (item.date.toLocaleDateString() === DateUtils.next(1, previous.date).toLocaleDateString()) return spacedData.push(item);

      // if the item isn't at least 1 day after the previous date, add placeholders
      let previousDate: Date = previous.date;
      while (item.date.toLocaleDateString() !== DateUtils.next(1, previousDate).toLocaleDateString()) {
        previousDate = DateUtils.next(1, previousDate);
        spacedData.push(getPlaceholder(previousDate));
      }
      spacedData.push(item);
    });
    if (!spacedData.length) spacedData.push(...getEmptyWeeks(startDate));

    // if no data in response fill with placeholders
    return spacedData;
  };

  const fetchCalendar = async (mode: 'start' | 'end' | 'reload' = 'reload') => {
    if (!firstLoad.value && loading.value) {
      console.warn('Already fetching calendar');
      return;
    }
    if (filter.value) {
      console.warn('Filtering calendar, fetch is disabled');
      return;
    }

    if (firstLoad.value) firstLoad.value = false;

    loading.value = true;

    if (mode === 'start') startCalendar.value = DateUtils.previous(days.value, startCalendar.value);

    const startDate = ['start', 'reload'].includes(mode) ? startCalendar.value : endCalendar.value;
    const endDate = DateUtils.next(days.value - 1, startDate);
    const start_date = startDate.toISOString().split('T')[0];

    if (mode === 'end') endCalendar.value = DateUtils.next(days.value, endCalendar.value);

    console.info('Fetching calendar', { mode, start_date, endDate: endDate.toISOString().split('T')[0], days: days.value });

    const timeout = setTimeout(() => {
      if (mode === 'reload') calendar.value = getEmptyWeeks(startDate, true);
      else if (mode === 'start') calendar.value = [getLoadingPlaceholder(DateUtils.previous(1, endDate)), ...calendar.value];
      else if (mode === 'end') calendar.value = [...calendar.value, ...getEmptyWeeks(startDate, true)];
    }, 100);
    try {
      const [shows, movies] = await Promise.all([
        TraktService.calendar({ start_date, days: days.value }, 'shows'),
        TraktService.calendar({ start_date, days: days.value }, 'movies'),
      ]);
      const newData: CalendarItem[] = [
        ...(shows as TraktCalendarShow[]).map(show => ({
          ...show,
          id: show.episode.ids.trakt ?? show.show.ids.trakt,
          date: new Date(show.first_aired),
        })),
        ...(movies as TraktCalendarMovie[]).map(movie => ({
          ...movie,
          id: movie.movie.ids.trakt,
          date: new Date(movie.released),
        })),
      ].sort((a, b) => a.date.getTime() - b.date.getTime());

      const spacedData = spaceDate(newData, startDate, endDate);

      if (mode === 'reload') {
        calendar.value = [...spacedData];
      } else if (mode === 'start') {
        calendar.value = [...spacedData, ...calendar.value.filter(c => c.type !== ListScrollItemType.loading)];
      } else if (mode === 'end') {
        calendar.value = [...calendar.value.filter(c => c.type !== ListScrollItemType.loading), ...spacedData];
      }
    } catch (e) {
      console.error('Failed to fetch history');
      calendar.value = calendar.value.filter(c => c.type !== ListScrollItemType.loading);
      throw e;
    } finally {
      clearTimeout(timeout);
      loading.value = false;
    }
  };

  const filteredCalendar = useSearchFilter(calendar, filter, 'date');

  return {
    clearState,
    saveState,
    restoreState,
    loading,
    pageSize: weeks,
    calendar,
    startCalendar,
    endCalendar,
    fetchCalendar,
    filter,
    center,
    filteredCalendar,
  };
});

export const useCalendarStoreRefs = () => storeToRefs(useCalendarStore());

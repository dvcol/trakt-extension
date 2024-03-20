import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import type { ListScrollItem, ListScrollItemTag } from '~/components/common/list/ListScroll.model';
import type { TraktCalendarMovie, TraktCalendarShow } from '~/models/trakt/trakt-calendar.model';

import { TraktService } from '~/services/trakt.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { DateUtils } from '~/utils/date.utils';
import { debounceLoading, useLoadingPlaceholder } from '~/utils/store.utils';

export type CalendarItem = (TraktCalendarShow | TraktCalendarMovie | Record<never, never>) & {
  id: ListScrollItem['id'];
  type: ListScrollItem['type'];
  premiere?: 'season' | 'series' | 'mid_season';
  finale?: 'season' | 'series' | 'mid_season';
  day: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  date: Date;
  tags?: ListScrollItemTag[];
};

export const CalendarPlaceholder: Partial<CalendarItem> = {
  id: 'empty',
  type: 'placeholder',
} as const;

export const getEmptyWeeks = (fromDate = DateUtils.weeks.previous(1)) => {
  return Array(14)
    .fill(CalendarPlaceholder)
    .map((placeholder, index) => {
      const date = DateUtils.next(index, fromDate);
      return {
        ...placeholder,
        day: date.getDay(),
        date,
      };
    });
};

export const useCalendarStore = defineStore('data.calendar', () => {
  const loading = ref(true);
  const calendar = ref<CalendarItem[]>([]);

  const startCalendar = ref<Date>(DateUtils.weeks.previous(1));
  const endCalendar = ref<Date>(DateUtils.weeks.next(1));

  const weeks = ref(1);
  const days = computed(() => weeks.value * 7 * 2);

  const clearState = () => {
    calendar.value = [];
    startCalendar.value = DateUtils.weeks.previous(1);
    endCalendar.value = DateUtils.weeks.next(1);
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

  const loadingPlaceholder = useLoadingPlaceholder<CalendarItem>(weeks);

  const fetchCalendar = async (range: 'start' | 'end' = 'start') => {
    console.info('fetchCalendar', range);
    loading.value = true;
    const timeout = debounceLoading(calendar, loadingPlaceholder);
    try {
      const startDate = range === 'start' ? startCalendar.value : endCalendar.value;
      const start_date = startDate.toISOString().split('T')[0];
      const [shows, movies] = await Promise.all([
        TraktService.calendar({ start_date, days: days.value }, 'shows'),
        TraktService.calendar({ start_date, days: days.value }, 'movies'),
      ]);
      const newData: CalendarItem[] = [
        ...(shows as TraktCalendarShow[]).map(show => {
          const date = new Date(show.first_aired);
          let premiere: CalendarItem['premiere'] | undefined;
          if (show.episode.season === 1 && show.episode.number === 1) premiere = 'series';
          else if (show.episode.number === 1) premiere = 'season';
          return {
            ...show,
            id: show.show.ids.trakt,
            type: 'show' as const,
            date,
            day: date.getDay(),
            premiere,
            tags: premiere
              ? [
                  {
                    label: premiere,
                    i18n: ['calendar', 'tag', 'label', 'premiere'],
                    type: premiere === 'season' ? 'info' : 'primary',
                  },
                ]
              : undefined,
          } as CalendarItem;
        }),
        ...(movies as TraktCalendarMovie[]).map(movie => {
          const date = new Date(movie.released);
          return {
            ...movie,
            id: movie.movie.ids.trakt,
            type: 'movie' as const,
            date,
            day: date.getDay() as CalendarItem['day'],
          };
        }),
      ].sort((a, b) => a.date.getTime() - b.date.getTime());

      const spacedData: CalendarItem[] = [];
      newData.forEach((item, index) => {
        if (index === 0) {
          // if the item isn't at least 7 days before the start date, add placeholders
          if (item.date.toLocaleDateString() !== DateUtils.previous(7).toLocaleDateString()) {
            let previousDate: Date = item.date;
            while (previousDate.toLocaleDateString() !== DateUtils.previous(7).toLocaleDateString()) {
              previousDate = DateUtils.previous(1, previousDate);
              spacedData.push({ ...CalendarPlaceholder, date: previousDate, day: previousDate.getDay() } as CalendarItem);
            }
          }
          return spacedData.push(item);
        }

        if (index === newData.length - 1) {
          spacedData.push(item);

          // if the item isn't at least 7 days after the end date, add placeholders
          if (item.date.toLocaleDateString() !== DateUtils.next(7).toLocaleDateString()) {
            let nextDate: Date = item.date;
            while (nextDate.toLocaleDateString() !== DateUtils.next(7).toLocaleDateString()) {
              nextDate = DateUtils.next(1, nextDate);
              spacedData.push({ ...CalendarPlaceholder, date: nextDate, day: nextDate.getDay() } as CalendarItem);
            }
            return;
          }
        }

        const previous = newData[index - 1];

        if (item.date.toLocaleDateString() === previous.date.toLocaleDateString()) return spacedData.push(item);
        if (item.date.toLocaleDateString() === DateUtils.next(1, previous.date).toLocaleDateString()) return spacedData.push(item);

        // if the item isn't at least 1 day after the previous date, add placeholders
        let previousDate: Date = previous.date;
        while (item.date.toLocaleDateString() !== DateUtils.next(1, previousDate).toLocaleDateString()) {
          previousDate = DateUtils.next(1, previousDate);
          spacedData.push({ ...CalendarPlaceholder, date: previousDate, day: previousDate.getDay() } as CalendarItem);
        }
        spacedData.push(item);
      });

      // if no data in response fill with placeholders
      if (!spacedData.length) spacedData.push(...getEmptyWeeks(startDate));

      if (range === 'start') {
        calendar.value = [...spacedData, ...calendar.value.filter(c => c.type !== 'placeholder')];
      } else {
        calendar.value = [...calendar.value.filter(c => c.type !== 'placeholder'), ...spacedData];
      }
    } catch (e) {
      console.error('Failed to fetch history');
      calendar.value = calendar.value.filter(c => c.type !== 'placeholder');
      throw e;
    } finally {
      clearTimeout(timeout);
      loading.value = false;
    }
  };

  return { clearState, saveState, restoreState, loading, pageSize: weeks, calendar, startCalendar, endCalendar, fetchCalendar };
});

export const useCalendarStoreRefs = () => storeToRefs(useCalendarStore());

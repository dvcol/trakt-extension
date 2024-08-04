import { DateUtils } from '@dvcol/common-utils/common/date';
import { TraktApiExtended, type TraktCalendarMovie, type TraktCalendarQuery, type TraktCalendarShow } from '@dvcol/trakt-http-client/models';
import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref } from 'vue';

import { ListScrollItemType } from '~/models/list-scroll.model';

import { ErrorService } from '~/services/error.service';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { type CalendarItem, getEmptyWeeks, getLoadingPlaceholder, spaceDate } from '~/utils/calendar.utils';
import { ErrorCount, type ErrorDictionary } from '~/utils/retry.utils';
import { useSearchFilter } from '~/utils/store.utils';
import { clearProxy } from '~/utils/vue.utils';

const CalendarStoreConstants = {
  Store: 'data.calendar',
} as const;

type CalendarState = {
  center?: number;
  weeks: number;
  extended?: boolean;
};

export const useCalendarStore = defineStore(CalendarStoreConstants.Store, () => {
  const firstLoad = ref(true);
  const loading = ref(true);
  const calendar = ref<CalendarItem[]>([]);
  const extended = ref(false);

  const weeks = ref(1);
  const days = computed(() => weeks.value * 7 * 2);

  const center = ref<Date>(new Date());
  const startCalendar = ref<Date>(DateUtils.weeks.previous(weeks.value, center.value));
  const endCalendar = ref<Date>(DateUtils.weeks.next(weeks.value, center.value));

  const filter = ref('');

  const calendarErrors = reactive<ErrorDictionary>({});
  ErrorService.registerDictionary('calendar', calendarErrors);

  const saveState = async (clear = false) => {
    return storage.local.set<CalendarState>(CalendarStoreConstants.Store, {
      center: clear ? undefined : center.value.getTime(),
      weeks: weeks.value,
      extended: extended.value,
    });
  };

  const clearState = (date?: Date, save = true) => {
    calendar.value = [];
    center.value = date ?? new Date();
    startCalendar.value = DateUtils.weeks.previous(weeks.value, center.value);
    endCalendar.value = DateUtils.weeks.next(weeks.value, center.value);
    clearProxy(calendarErrors);
    if (!save) return;
    saveState(!date).catch(e => Logger.error('Failed to save calendar state', e));
  };

  const restoreState = async () => {
    const restored = await storage.local.get<CalendarState>(CalendarStoreConstants.Store);

    if (restored?.weeks) weeks.value = restored.weeks;
    if (restored?.extended) extended.value = restored.extended;
    if (restored?.center) clearState(new Date(restored.center), false);
  };

  const fetchCalendar = async (mode: 'start' | 'end' | 'reload' = 'reload') => {
    if (!firstLoad.value && loading.value) {
      Logger.warn('Already fetching calendar');
      return;
    }
    if (filter.value) {
      Logger.warn('Filtering calendar, fetch is disabled');
      return;
    }

    if (firstLoad.value) firstLoad.value = false;

    loading.value = true;

    if (mode === 'start') startCalendar.value = DateUtils.previous(days.value, startCalendar.value);

    const startDate = ['start', 'reload'].includes(mode) ? startCalendar.value : endCalendar.value;
    const endDate = DateUtils.next(days.value - 1, startDate);
    const start_date = startDate.toISOString().split('T')[0];
    const end_date = endDate.toISOString().split('T')[0];

    if (mode === 'end') endCalendar.value = DateUtils.next(days.value, endCalendar.value);

    Logger.debug('Fetching calendar', { mode, start_date, end_date, days: days.value });

    const timeout = setTimeout(() => {
      if (mode === 'reload') calendar.value = getEmptyWeeks(startDate, true);
      else if (mode === 'start') calendar.value = [getLoadingPlaceholder(DateUtils.previous(1, endDate)), ...calendar.value];
      else if (mode === 'end') calendar.value = [...calendar.value, ...getEmptyWeeks(startDate, true)];
    }, 100);

    const query: TraktCalendarQuery = { start_date, days: days.value };
    if (extended.value) query.extended = TraktApiExtended.Full;

    try {
      const [shows, movies] = await Promise.all([TraktService.calendar(query, 'shows'), TraktService.calendar(query, 'movies')]);
      delete calendarErrors[JSON.stringify(query)];
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
      Logger.error('Failed to fetch calendar');
      NotificationService.error('Failed to fetch calendar', e);
      calendar.value = calendar.value.filter(c => c.type !== ListScrollItemType.loading);
      const errorKey = JSON.stringify(query);
      calendarErrors[errorKey] = ErrorCount.fromDictionary(calendarErrors, errorKey, e);
      throw e;
    } finally {
      clearTimeout(timeout);
      loading.value = false;
    }
  };

  const filteredCalendar = useSearchFilter(calendar, filter, 'date');

  const initCalendarStore = async () => {
    await restoreState();
  };

  return {
    clearState,
    saveState,
    restoreState,
    loading,
    calendar,
    startCalendar,
    endCalendar,
    fetchCalendar,
    filter,
    center,
    filteredCalendar,
    initCalendarStore,
    extended: computed({
      get: () => extended.value,
      set: (value: boolean) => {
        extended.value = value;
        saveState().catch(e => Logger.error('Failed to save calendar extended state', e));
      },
    }),
  };
});

export const useCalendarStoreRefs = () => storeToRefs(useCalendarStore());

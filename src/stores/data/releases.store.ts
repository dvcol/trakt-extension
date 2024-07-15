import { DateUtils } from '@dvcol/common-utils/common/date';

import { TmdbMovieReleaseType } from '@dvcol/tmdb-http-client/models';
import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref } from 'vue';

import type { TmdbConfigurationCounty, TmdbMovieReleaseTypes, TmdbMovieShort } from '@dvcol/tmdb-http-client/models';

import { ListScrollItemType } from '~/models/list-scroll.model';
import { ErrorService } from '~/services/error.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { logger } from '~/stores/settings/log.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { type CalendarItem, getEmptyWeeks, getLoadingPlaceholder, spaceDate } from '~/utils/calendar.utils';
import { getIntlRegion, getNavigatorRegion } from '~/utils/intl.utils';
import { ErrorCount, type ErrorDictionary } from '~/utils/retry.utils';
import { clearProxy } from '~/utils/vue.utils';

const ReleasesStoreConstants = {
  Store: 'data.releases',
} as const;

type ReleaseState = {
  date?: number;
  weeks: number;
  region?: TmdbConfigurationCounty;
  types: TmdbMovieReleaseTypes[];
  startCalendar: number;
  endCalendar: number;
};

export const useReleasesStore = defineStore(ReleasesStoreConstants.Store, () => {
  const firstLoad = ref(true);
  const loading = ref(true);
  const releases = ref<CalendarItem[]>([]);

  const center = ref<Date>(new Date());
  const startCalendar = ref<Date>(DateUtils.weeks.previous(1, center.value));
  const endCalendar = ref<Date>(DateUtils.weeks.next(1, center.value));

  const weeks = ref(1);
  const days = computed(() => weeks.value * 7 * 2);

  const regionLoading = ref(true);
  const regions = ref<TmdbConfigurationCounty[]>([]);
  const region = ref<TmdbConfigurationCounty | undefined>();
  const types = ref<TmdbMovieReleaseTypes[]>([TmdbMovieReleaseType.Theatrical, TmdbMovieReleaseType.TheatricalLimited]);

  const releasesErrors = reactive<ErrorDictionary>({});
  ErrorService.registerDictionary('releases', releasesErrors);

  const saveState = async (clear = false) =>
    storage.local.set<ReleaseState>(ReleasesStoreConstants.Store, {
      date: clear ? undefined : center.value.getTime(),
      weeks: weeks.value,
      region: region.value,
      types: types.value,
      startCalendar: startCalendar.value.getTime(),
      endCalendar: endCalendar.value.getTime(),
    });

  const clearState = (date?: Date) => {
    releases.value = [];
    center.value = date ?? new Date();
    startCalendar.value = DateUtils.weeks.previous(1, center.value);
    endCalendar.value = DateUtils.weeks.next(1, center.value);
    clearProxy(releasesErrors);
    saveState(!date).catch(e => logger.error('Failed to save calendar state', e));
  };

  const restoreState = async () => {
    const restored = await storage.local.get<ReleaseState>(ReleasesStoreConstants.Store);

    if (restored?.date) center.value = new Date(restored.date);
    if (restored?.weeks) weeks.value = restored.weeks;
    if (restored?.region) region.value = restored.region;
    if (restored?.types) types.value = Object.values(restored.types);
    if (restored?.startCalendar) startCalendar.value = new Date(restored.startCalendar);
    if (restored?.endCalendar) endCalendar.value = new Date(restored.endCalendar);
  };

  const fetchRegions = async () => {
    regionLoading.value = true;
    try {
      regions.value = await TraktService.providers.regions();
      if (!region.value) {
        const locale = getIntlRegion() || getNavigatorRegion();
        if (locale) region.value = regions.value.find(r => r.iso_3166_1 === locale);
      }
    } catch (e) {
      logger.error('Failed to fetch regions');
      NotificationService.error('Failed to fetch regions', e);
    } finally {
      regionLoading.value = false;
    }
  };

  const fetchReleases = async (mode: 'start' | 'end' | 'reload' = 'reload') => {
    if (!firstLoad.value && loading.value) {
      logger.warn('Already fetching releases');
      return;
    }

    if (firstLoad.value) firstLoad.value = false;

    loading.value = true;

    if (mode === 'start') startCalendar.value = DateUtils.previous(days.value, startCalendar.value);

    const startDate = ['start', 'reload'].includes(mode) ? startCalendar.value : endCalendar.value;
    const endDate = DateUtils.next(days.value - 1, startDate);

    if (mode === 'end') endCalendar.value = DateUtils.next(days.value, endCalendar.value);

    logger.debug('Fetching releases', {
      mode,
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString(),
      days: days.value,
      region: region.value,
      types: types.value,
    });

    const timeout = setTimeout(() => {
      if (mode === 'reload') releases.value = getEmptyWeeks(startDate, true);
      else if (mode === 'start') releases.value = [getLoadingPlaceholder(DateUtils.previous(1, endDate)), ...releases.value];
      else if (mode === 'end') releases.value = [...releases.value, ...getEmptyWeeks(startDate, true)];
    }, 100);

    const query = { from: startDate, to: endDate, region: region.value?.iso_3166_1, release: types.value };

    try {
      const movies = await TraktService.releases.movie(query);
      delete releasesErrors[JSON.stringify(query)];

      const newData: CalendarItem[] = movies.data
        .map((movie: TmdbMovieShort) => ({
          ...movie,
          date: new Date(movie.release_date),
        }))
        .sort((a: CalendarItem, b: CalendarItem) => a.date.getTime() - b.date.getTime());

      const spacedData = spaceDate(newData, startDate, endDate);

      if (mode === 'reload') {
        releases.value = [...spacedData];
      } else if (mode === 'start') {
        releases.value = [...spacedData, ...releases.value.filter(c => c.type !== ListScrollItemType.loading)];
      } else if (mode === 'end') {
        releases.value = [...releases.value.filter(c => c.type !== ListScrollItemType.loading), ...spacedData];
      }
    } catch (e) {
      logger.error('Failed to fetch releases');
      NotificationService.error('Failed to fetch releases', e);
      releases.value = releases.value.filter(c => c.type !== ListScrollItemType.loading);
      const errorKey = JSON.stringify(query);
      releasesErrors[errorKey] = ErrorCount.fromDictionary(releasesErrors, errorKey, e);
      throw e;
    } finally {
      clearTimeout(timeout);
      loading.value = false;
    }
  };

  const initReleasesStore = async () => {
    await restoreState();
  };

  return {
    clearState,
    saveState,
    restoreState,
    loading,
    releases,
    startCalendar,
    endCalendar,
    fetchReleases,
    fetchRegions,
    center,
    regionLoading,
    regions,
    region: computed<string | undefined>({
      get: () => region.value?.iso_3166_1,
      set: (value?: string) => {
        region.value = !value ? undefined : regions.value.find(r => r.iso_3166_1 === value);
        saveState().catch(error => logger.error('Failed to save region state', error));
      },
    }),
    types: computed({
      get: () => types.value,
      set: (value: TmdbMovieReleaseTypes[]) => {
        types.value = value;
        saveState().catch(error => logger.error('Failed to save release types state', error));
      },
    }),
    initReleasesStore,
  };
});

export const useReleasesStoreRefs = () => storeToRefs(useReleasesStore());

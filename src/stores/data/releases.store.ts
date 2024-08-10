import { DateUtils } from '@dvcol/common-utils/common/date';

import { getIntlRegion, getNavigatorRegion } from '@dvcol/common-utils/common/intl';
import {
  type TmdbConfigurationCounty,
  TmdbMovieReleaseType,
  type TmdbMovieReleaseTypes,
  type TmdbMovieShort,
  type TmdbPaginatedData,
} from '@dvcol/tmdb-http-client/models';
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
import { clearProxy } from '~/utils/vue.utils';

const ReleasesStoreConstants = {
  Store: 'data.releases',
} as const;

type ReleaseState = {
  date?: number;
  weeks: number;
  center?: number;
  region?: TmdbConfigurationCounty;
  releaseType: TmdbMovieReleaseTypes;
};

const parseData = ({
  payload,
  startDate,
  endDate,
}: {
  payload: TmdbPaginatedData<TmdbMovieShort>;
  startDate: Date;
  endDate: Date;
}): CalendarItem[] => {
  return payload?.data.map((movie: TmdbMovieShort) => {
    // To make sure that re-released are not out of range
    let _date = new Date(movie.release_date);
    if (_date < startDate) _date = startDate;
    if (_date > endDate) _date = endDate;
    return {
      ...movie,
      date: _date,
      type: ListScrollItemType.movie,
      title: movie.title,
      content: movie.overview,
      getPosterQuery: () => ({
        type: ListScrollItemType.movie,
        id: movie.id,
      }),
      tags: [],
    };
  });
};

export const useReleasesStore = defineStore(ReleasesStoreConstants.Store, () => {
  const firstLoad = ref(true);
  const loading = ref(true);
  const releases = ref<CalendarItem[]>([]);

  const weeks = ref(1);
  const days = computed(() => weeks.value * 7 * 2);

  const center = ref<Date>(new Date());
  const startCalendar = ref<Date>(DateUtils.weeks.previous(weeks.value, center.value));
  const endCalendar = ref<Date>(DateUtils.weeks.next(weeks.value, center.value));

  const regionLoading = ref(true);
  const regions = ref<TmdbConfigurationCounty[]>([]);
  const region = ref<TmdbConfigurationCounty | undefined>();
  const releaseType = ref<TmdbMovieReleaseTypes>(TmdbMovieReleaseType.Theatrical);

  const releasesErrors = reactive<ErrorDictionary>({});
  ErrorService.registerDictionary('releases', releasesErrors);

  const saveState = async (clear = false) =>
    storage.local.set<ReleaseState>(ReleasesStoreConstants.Store, {
      center: clear ? undefined : center.value.getTime(),
      weeks: weeks.value,
      region: region.value,
      releaseType: releaseType.value,
    });

  const clearState = (date?: Date) => {
    releases.value = [];
    center.value = date ?? new Date();
    startCalendar.value = DateUtils.weeks.previous(weeks.value, center.value);
    endCalendar.value = DateUtils.weeks.next(weeks.value, center.value);
    clearProxy(releasesErrors);
    saveState(!date).catch(e => Logger.error('Failed to save calendar state', e));
  };

  const restoreState = async () => {
    const restored = await storage.local.get<ReleaseState>(ReleasesStoreConstants.Store);

    if (restored?.weeks) weeks.value = restored.weeks;
    if (restored?.region) region.value = restored.region;
    if (restored?.releaseType) releaseType.value = restored.releaseType;
    if (restored?.center) clearState(new Date(restored.center));
  };

  const getLocaleRegion = () => {
    const locale = getIntlRegion() || getNavigatorRegion();
    if (!regions.value?.length) return;
    if (locale) return regions.value.find(r => r.iso_3166_1 === locale) ?? regions.value[0];
    return regions.value[0];
  };

  const fetchRegions = async () => {
    regionLoading.value = true;
    try {
      regions.value = await TraktService.providers.regions();
      if (!region.value) region.value = getLocaleRegion();
    } catch (e) {
      Logger.error('Failed to fetch regions');
      NotificationService.error('Failed to fetch regions', e);
    } finally {
      regionLoading.value = false;
    }
  };

  const fetchReleases = async (mode: 'start' | 'end' | 'reload' = 'reload') => {
    if (!firstLoad.value && loading.value) {
      Logger.warn('Already fetching releases');
      return;
    }

    if (!region.value) {
      Logger.warn('Region not selected');
      return;
    }

    loading.value = true;

    if (mode === 'start') startCalendar.value = DateUtils.previous(days.value, startCalendar.value);

    const startDate = ['start', 'reload'].includes(mode) ? startCalendar.value : endCalendar.value;
    const endDate = DateUtils.next(days.value - 1, startDate);

    if (mode === 'end') endCalendar.value = DateUtils.next(days.value, endCalendar.value);

    Logger.debug('Fetching releases', {
      mode,
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString(),
      days: days.value,
      region: region.value,
      releaseType: releaseType.value,
    });

    const timeout = setTimeout(() => {
      if (mode === 'reload') releases.value = getEmptyWeeks({ startDate, loading: true, days: days.value });
      else if (mode === 'start') releases.value = [getLoadingPlaceholder(DateUtils.previous(1, endDate)), ...releases.value];
      else if (mode === 'end') releases.value = [...releases.value, ...getEmptyWeeks({ startDate, loading: true, days: days.value })];
    }, 100);

    const query = {
      from: startDate,
      to: endDate,
      region: region.value?.iso_3166_1,
      release: [releaseType.value],
    };

    const newData: CalendarItem[] = [];

    try {
      let movies = await TraktService.releases.movie(query, { page: 1 });

      newData.push(...parseData({ payload: movies, startDate, endDate }));
      if (movies?.pagination?.page && movies.pagination.total_pages && movies.pagination.page < movies.pagination.total_pages) {
        while (movies?.pagination?.page && movies.pagination.total_pages && movies.pagination.page < movies.pagination.total_pages) {
          // eslint-disable-next-line no-await-in-loop
          movies = await TraktService.releases.movie(query, { page: movies.pagination.page + 1 });
          newData.push(...parseData({ payload: movies, startDate, endDate }));
        }
      }

      delete releasesErrors[JSON.stringify(query)];

      newData.sort((a: CalendarItem, b: CalendarItem) => a.date.getTime() - b.date.getTime());

      const spacedData = spaceDate(newData, startDate, endDate);

      if (mode === 'reload') {
        releases.value = [...spacedData];
      } else if (mode === 'start') {
        releases.value = [...spacedData, ...releases.value.filter(c => c.type !== ListScrollItemType.loading)];
      } else if (mode === 'end') {
        releases.value = [...releases.value.filter(c => c.type !== ListScrollItemType.loading), ...spacedData];
      }
    } catch (e) {
      Logger.error('Failed to fetch releases');
      NotificationService.error('Failed to fetch releases', e);
      releases.value = releases.value.filter(c => c.type !== ListScrollItemType.loading);
      const errorKey = JSON.stringify(query);
      releasesErrors[errorKey] = ErrorCount.fromDictionary(releasesErrors, errorKey, e);
      throw e;
    } finally {
      clearTimeout(timeout);
      loading.value = false;
      if (firstLoad.value) firstLoad.value = false;
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
        region.value = regions.value?.find(r => r.iso_3166_1 === value) ?? getLocaleRegion();
        saveState().catch(error => Logger.error('Failed to save region state', error));
        return clearState();
      },
    }),
    releaseType: computed({
      get: () => releaseType.value,
      set: (value: TmdbMovieReleaseTypes) => {
        releaseType.value = value;
        saveState().catch(error => Logger.error('Failed to save release type state', error));
        return clearState();
      },
    }),
    initReleasesStore,
  };
});

export const useReleasesStoreRefs = () => storeToRefs(useReleasesStore());

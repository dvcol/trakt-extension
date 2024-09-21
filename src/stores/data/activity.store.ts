import { compareDateObject, toDateObject } from '@dvcol/common-utils/common/date';
import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, ref, watch } from 'vue';

import type { RecursiveType } from '@dvcol/common-utils/common';
import type { TraktSyncActivities } from '@dvcol/trakt-http-client/models';

import { PollingIntervals } from '~/models/polling.model';
import { Route } from '~/models/router.model';

import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { useUserSettingsStore } from '~/stores/settings/user.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';
import { useDocumentVisible } from '~/utils/store.utils';

type Evicted = Record<Route, boolean>;
const defaultEvicted: Evicted = Object.fromEntries(Object.values(Route).map(route => [route, false])) as Evicted;
type Changed = RecursiveType<RecursiveType<TraktSyncActivities, Date>, boolean>;

type ActivityStoreState = {
  activity: Record<string, TraktSyncActivities>;
  polling?: number;
};

const ActivityStoreConstants = {
  Store: 'data.activity',
  /** 30 seconds */
  DefaultPolling: PollingIntervals.OneMinute,
} as const;

export const useActivityStore = defineStore(ActivityStoreConstants.Store, () => {
  const activity = ref<ActivityStoreState['activity']>({});
  const loading = ref(false);
  const polling = ref(ActivityStoreConstants.DefaultPolling);

  const clearState = () => {
    activity.value = {};
  };

  const saveState = debounce(() =>
    storage.local.set<ActivityStoreState>(ActivityStoreConstants.Store, {
      activity: activity.value,
      polling: polling.value,
    }),
  );

  const restoreState = async () => {
    const state = await storage.local.get<ActivityStoreState>(ActivityStoreConstants.Store);
    if (state?.activity) activity.value = state.activity;
    if (state?.polling !== undefined) polling.value = state.polling;
  };

  const setActivity = (user: string, data: TraktSyncActivities) => {
    if (!user) throw new Error('User is required');
    activity.value = { ...activity.value, [user]: data };
    return saveState();
  };

  const { user, isAuthenticated } = useAuthSettingsStoreRefs();
  const fetchActivity = async () => {
    if (!isAuthenticated.value) {
      Logger.error('Cannot fetch activity, user is not authenticated');
      return;
    }
    if (loading.value) {
      Logger.warn('Already fetching activity');
      return;
    }
    Logger.debug('Fetching activity');
    loading.value = true;

    try {
      const _activity = await TraktService.activity();
      return setActivity(user.value, _activity);
    } catch (error) {
      Logger.error('Failed to fetch activity', error);
      NotificationService.error('Failed to fetch activity', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const { fetchUserSettings } = useUserSettingsStore();
  const interval = ref<ReturnType<typeof setInterval>>();

  const evicted = reactive<Evicted>({ ...defaultEvicted });
  const getEvicted = (route: Route) => computed(() => evicted[route]);
  const evictChanges = (_changed?: Changed): Evicted => {
    const _evicted: Evicted = { ...defaultEvicted };
    if (!_changed?.all) return _evicted;
    const promises: Promise<unknown>[] = [];
    if (_changed?.episodes?.watched_at || _changed?.shows?.hidden_at || _changed?.seasons?.hidden_at) {
      promises.push(TraktService.evict.progress.show());
      _evicted.progress = true;
      promises.push(TraktService.evict.calendar());
      _evicted.calendar = true;
      promises.push(TraktService.evict.history());
      _evicted.history = true;
      promises.push(TraktService.evict.stats());
      _evicted.settings = true;
      Logger.info('Evicted show progress, history and calendar');
    }

    if (_changed?.movies?.watched_at || _changed?.movies?.hidden_at) {
      promises.push(TraktService.evict.progress.movie());
      _evicted.progress = true;
      promises.push(TraktService.evict.history());
      _evicted.history = true;
      promises.push(TraktService.evict.calendar());
      _evicted.calendar = true;
      promises.push(TraktService.evict.stats());
      _evicted.settings = true;
      Logger.info('Evicted movie progress, history and calendar');
    }

    if (
      _changed?.watchlist?.updated_at ||
      _changed?.episodes?.watchlisted_at ||
      _changed?.seasons?.watchlisted_at ||
      _changed?.shows?.watchlisted_at ||
      _changed?.movies?.watchlisted_at
    ) {
      promises.push(TraktService.evict.watchlist());
      _evicted.watchlist = true;
      promises.push(TraktService.evict.calendar());
      _evicted.calendar = true;
      Logger.info('Evicted watchlist');
    }
    if (_changed?.collaborations?.updated_at || _changed?.lists?.updated_at) {
      promises.push(TraktService.evict.lists());
      _evicted.watchlist = true;
      Logger.info('Evicted lists');
    }
    if (_changed?.episodes?.collected_at) {
      promises.push(TraktService.evict.collection.show());
      _evicted.watchlist = true;
      promises.push(TraktService.evict.calendar());
      _evicted.calendar = true;
      promises.push(TraktService.evict.stats());
      _evicted.settings = true;
      Logger.info('Evicted show collection');
    }
    if (_changed?.movies?.collected_at) {
      promises.push(TraktService.evict.collection.movie());
      _evicted.watchlist = true;
      promises.push(TraktService.evict.calendar());
      _evicted.calendar = true;
      promises.push(TraktService.evict.stats());
      _evicted.settings = true;
      Logger.info('Evicted movie collection');
    }
    if (_changed?.favorites?.updated_at) {
      promises.push(TraktService.evict.favorites());
      _evicted.watchlist = true;
      Logger.info('Evicted favorites');
    }
    if (_changed?.account?.settings_at) {
      promises.push(TraktService.evict.settings());
      promises.push(fetchUserSettings());
      _evicted.settings = true;
      Logger.info('Evicted account');
    }
    if (_changed.movies.rated_at || _changed.shows.rated_at || _changed.seasons.rated_at || _changed.episodes.rated_at) {
      promises.push(TraktService.evict.ratings());
      promises.push(TraktService.evict.stats());
      _evicted.settings = true;
      Logger.info('Evicted ratings');
    }
    Promise.all(promises).catch(e => Logger.error('Failed to evict changes', e));
    return _evicted;
  };

  const initActivityStore = async () => {
    await restoreState();

    watch(activity, (next, prev) => {
      const _prev = prev?.[user.value];
      const _next = next?.[user.value];
      if (!_prev || !_next) return;
      const _changed = compareDateObject(toDateObject(_prev), toDateObject(_next));
      Object.assign(evicted, evictChanges(_changed));
    });

    watch(
      polling,
      async () => {
        if (interval.value) clearInterval(interval.value);
        if (!polling.value) return;
        if (document.hidden) return;
        if (isAuthenticated.value) await fetchActivity();
        interval.value = setInterval(() => {
          if (!isAuthenticated.value) return;
          return fetchActivity();
        }, polling.value);
        Logger.debug('Activity polling interval set to', polling.value);
      },
      {
        immediate: true,
      },
    );

    watch(user, async () => {
      if (!isAuthenticated.value) return;
      await fetchActivity();
    });

    useDocumentVisible({ onVisible: fetchActivity });

    if (polling.value || !isAuthenticated.value) return;
    return fetchActivity();
  };

  return {
    activity,
    evicted,
    getEvicted,
    polling: computed({
      get: () => polling.value,
      set: (value: number = ActivityStoreConstants.DefaultPolling) => {
        polling.value = value;
        saveState().catch(e => Logger.error('Failed to save watching state', e));
      },
    }),
    loading,
    fetchActivity,
    clearState,
    saveState,
    restoreState,
    initActivityStore,
  };
});

export const useActivityStoreRefs = () => storeToRefs(useActivityStore());

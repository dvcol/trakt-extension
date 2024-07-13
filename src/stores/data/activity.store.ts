import { compareDateObject, toDateObject } from '@dvcol/common-utils/common/date';
import { defineStore, storeToRefs } from 'pinia';

import { ref, watch } from 'vue';

import type { RecursiveType } from '@dvcol/common-utils/common';
import type { TraktSyncActivities } from '@dvcol/trakt-http-client/models';

import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { logger } from '~/stores/settings/log.store';
import { useUserSettingsStore } from '~/stores/settings/user.store';
import { storage } from '~/utils/browser/browser-storage.utils';

const ActivityStoreConstants = {
  Store: 'data.activity',
} as const;

export const useActivityStore = defineStore(ActivityStoreConstants.Store, () => {
  const activity = ref<TraktSyncActivities>();
  const loading = ref(false);

  const clearState = () => {
    activity.value = undefined;
  };

  const saveState = async () => storage.local.set(ActivityStoreConstants.Store, activity.value);
  const restoreState = async () => {
    const state = await storage.local.get<TraktSyncActivities>(ActivityStoreConstants.Store);
    if (state) activity.value = state;
  };

  const fetchActivity = async () => {
    logger.debug('Fetching activity');
    loading.value = true;

    try {
      activity.value = await TraktService.activity();
      await saveState();
    } catch (error) {
      logger.error('Failed to fetch activity', error);
      NotificationService.error('Failed to fetch activity', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const { refreshUserSettings } = useUserSettingsStore();

  const initActivityStore = async (fetch?: boolean) => {
    await restoreState();

    watch(activity, (next, prev) => {
      if (!prev) return;
      const changed: RecursiveType<RecursiveType<TraktSyncActivities, Date>, boolean> = compareDateObject(toDateObject(prev), toDateObject(next));

      if (changed?.episodes?.watched_at || changed?.shows?.hidden_at || changed?.seasons?.hidden_at) {
        TraktService.evict.progress.show();
        TraktService.evict.history();
        TraktService.evict.calendar();
        logger.info('Evicted show progress, history and calendar');
      }

      if (changed?.movies?.watched_at || changed?.movies?.hidden_at) {
        TraktService.evict.progress.movie();
        TraktService.evict.history();
        TraktService.evict.calendar();
        logger.info('Evicted movie progress, history and calendar');
      }

      if (
        changed?.watchlist?.updated_at ||
        changed?.episodes?.watchlisted_at ||
        changed?.seasons?.watchlisted_at ||
        changed?.shows?.watchlisted_at ||
        changed?.movies?.watchlisted_at
      ) {
        TraktService.evict.watchlist();
        TraktService.evict.calendar();
        logger.info('Evicted watchlist');
      }
      if (changed?.collaborations?.updated_at || changed?.lists?.updated_at) {
        TraktService.evict.lists();
        logger.info('Evicted lists');
      }
      if (changed?.episodes?.collected_at) {
        TraktService.evict.collection.show();
        TraktService.evict.calendar();
        logger.info('Evicted show collection');
      }
      if (changed?.movies?.collected_at) {
        TraktService.evict.collection.movie();
        TraktService.evict.calendar();
        logger.info('Evicted movie collection');
      }
      if (changed?.favorites?.updated_at) {
        TraktService.evict.favorites();
        logger.info('Evicted favorites');
      }
      if (changed?.account?.settings_at) {
        refreshUserSettings();
        logger.info('Evicted account');
      }
    });

    if (fetch) await fetchActivity();
  };

  return { activity, loading, fetchActivity, clearState, saveState, restoreState, initActivityStore };
});

export const useActivityStoreRefs = () => storeToRefs(useActivityStore());

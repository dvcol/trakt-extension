import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, ref, watch } from 'vue';

import type { TraktCheckinRequest, TraktWatching } from '@dvcol/trakt-http-client/models';

import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { logger } from '~/stores/settings/log.store';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { useI18n } from '~/utils/i18n.utils';
import { wait } from '~/utils/promise.utils';

const WatchingStoreConstants = {
  Store: 'data.watching',
} as const;

type WatchingState = {
  polling?: number;
  override?: boolean;
};

type override = {
  watching?: boolean;
  checkin?: boolean;
  cancel?: boolean;
};

export const PollingIntervals = {
  Disabled: 0,
  Second: 1000,
  FiveSeconds: 5 * 1000,
  TenSeconds: 10 * 1000,
  ThirtySeconds: 30 * 1000,
  OneMinute: 60 * 1000,
  FiveMinutes: 5 * 60 * 1000,
  TenMinutes: 10 * 60 * 1000,
  ThirtyMinutes: 30 * 60 * 1000,
} as const;

/** 30 seconds */
const defaultPolling = PollingIntervals.TenSeconds;

export const useWatchingStore = defineStore(WatchingStoreConstants.Store, () => {
  const loading = reactive<override>({});
  const watching = ref<TraktWatching>();

  const polling = ref(defaultPolling);
  const override = ref(true);

  const i18n = useI18n('watching');

  const { user } = useUserSettingsStoreRefs();

  const saveState = () =>
    storage.local.set<WatchingState>(WatchingStoreConstants.Store, {
      polling: polling.value,
      override: override.value,
    });

  const restoreState = async () => {
    const restored = await storage.local.get<WatchingState>(WatchingStoreConstants.Store);

    if (restored?.polling) polling.value = restored.polling;
    if (restored?.override) override.value = restored.override;
  };

  const fetchWatching = async () => {
    if (loading.watching) {
      logger.warn('Already fetching watching state');
      return;
    }
    if (!user.value) {
      logger.warn('User not set, skipping watch polling');
      return;
    }
    if (polling.value <= 0) {
      logger.debug('Polling interval is 0, skipping watch polling');
      return;
    }

    loading.watching = true;

    try {
      watching.value = await TraktService.checkin.watching(user.value);
    } catch (e) {
      logger.error('Failed to fetch watching state');
      NotificationService.error('Failed to fetch watching state', e);
      throw e;
    } finally {
      loading.watching = false;
    }
  };

  const cancel = async (action: TraktWatching['action'] = watching.value?.action ?? 'checkin') => {
    if (loading.cancel) {
      logger.warn('Already cancelling');
    }

    loading.cancel = true;

    logger.debug('Cancelling');

    try {
      await TraktService.checkin.cancel();
      NotificationService.message.success(i18n(`cancel_${action}_success`));
    } catch (e) {
      logger.error('Failed to cancel');
      NotificationService.error(i18n(`cancel_${action}_failed`), e);
      throw e;
    } finally {
      loading.cancel = false;
      await fetchWatching();
    }
  };

  const checkin = async (query: TraktCheckinRequest, _override = override.value) => {
    if (loading.checkin) {
      logger.warn('Already checking in');
    }

    loading.checkin = true;

    logger.debug('Checking in', query);

    try {
      await TraktService.checkin.checkin(query);
      NotificationService.message.success(i18n('checkin_success'));
    } catch (e) {
      logger.error('Failed to check in');
      if (e instanceof Response && e?.status === 409) {
        logger.warn('Checkin already in progress');
        if (_override) {
          await wait(1000);
          await cancel();
          await wait(1000);
          await checkin(query, false);
        } else {
          NotificationService.error(i18n('checkin_in_progress'), e);
        }
      } else {
        NotificationService.error(i18n('checkin_failed'), e);
        throw e;
      }
    } finally {
      loading.checkin = false;
      await fetchWatching();
    }
  };

  const interval = ref<ReturnType<typeof setInterval>>();
  const initWatchingStore = async () => {
    await restoreState();
    await fetchWatching();
    watch(
      polling,
      () => {
        if (interval.value) clearInterval(interval.value);
        if (!polling.value) return;
        interval.value = setInterval(() => fetchWatching(), polling.value);
        logger.debug('Polling interval set to', polling.value);
      },
      {
        immediate: true,
      },
    );
  };

  return {
    watching,
    polling: computed({
      get: () => polling.value,
      set: (value: number = defaultPolling) => {
        polling.value = value;
        saveState().catch(e => logger.error('Failed to save watching state', e));
      },
    }),
    override: computed({
      get: () => override.value,
      set: (value: boolean) => {
        override.value = value;
        saveState().catch(e => logger.error('Failed to save watching state', e));
      },
    }),
    isWatching: computed(() => !!watching.value),
    cancelling: computed(() => loading.cancel),
    checkingIn: computed(() => loading.checkin),
    loading: computed(() => loading.cancel || loading.checkin),
    initWatchingStore,
    checkin,
    cancel,
  };
});

export const useWatchingStoreRefs = () => storeToRefs(useWatchingStore());

import { wait } from '@dvcol/common-utils/common/promise';
import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, ref, watch } from 'vue';

import type { TraktCheckinRequest, TraktWatching } from '@dvcol/trakt-http-client/models';

import { PollingIntervals } from '~/models/polling.model';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { useI18n } from '~/utils/i18n.utils';

const WatchingStoreConstants = {
  Store: 'data.watching',
  /** 10 seconds */
  DefaultPolling: PollingIntervals.TenSeconds,
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

export const useWatchingStore = defineStore(WatchingStoreConstants.Store, () => {
  const loading = reactive<override>({});
  const watching = ref<TraktWatching>();

  const polling = ref(WatchingStoreConstants.DefaultPolling);
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

    if (restored?.polling !== undefined) polling.value = restored.polling;
    if (restored?.override) override.value = restored.override;
  };

  const fetchWatching = async () => {
    if (loading.watching) {
      Logger.warn('Already fetching watching state');
      return;
    }
    if (!user.value) {
      Logger.warn('User not set, skipping watch polling');
      return;
    }

    loading.watching = true;

    try {
      watching.value = await TraktService.checkin.watching(user.value);
    } catch (e) {
      Logger.error('Failed to fetch watching state');
      NotificationService.error('Failed to fetch watching state', e);
      throw e;
    } finally {
      loading.watching = false;
    }
  };

  const cancel = async (action: TraktWatching['action'] = watching.value?.action ?? 'checkin') => {
    if (loading.cancel) {
      Logger.warn('Already cancelling');
    }

    loading.cancel = true;

    Logger.debug('Cancelling');

    try {
      await TraktService.checkin.cancel();
      NotificationService.message.success(i18n(`cancel_${action}_success`));
    } catch (e) {
      Logger.error('Failed to cancel');
      NotificationService.error(i18n(`cancel_${action}_failed`), e);
      throw e;
    } finally {
      loading.cancel = false;
      await fetchWatching();
    }
  };

  const checkin = async (query: TraktCheckinRequest, _override = override.value) => {
    if (loading.checkin) {
      Logger.warn('Already checking in');
    }

    loading.checkin = true;

    Logger.debug('Checking in', query);

    try {
      await TraktService.checkin.checkin(query);
      NotificationService.message.success(i18n('checkin_success'));
    } catch (e) {
      Logger.error('Failed to check in');
      if (e instanceof Response && e?.status === 409) {
        Logger.warn('Checkin already in progress');
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

  const { isAuthenticated } = useAuthSettingsStoreRefs();
  const interval = ref<ReturnType<typeof setInterval>>();
  const initWatchingStore = async () => {
    await restoreState();
    watch(
      polling,
      async () => {
        if (interval.value) clearInterval(interval.value);
        if (!polling.value) return;
        if (isAuthenticated.value) await fetchWatching();
        interval.value = setInterval(() => {
          if (!isAuthenticated.value) return;
          return fetchWatching();
        }, polling.value);
        Logger.debug('Watching polling interval set to', polling.value);
      },
      {
        immediate: true,
      },
    );

    watch(user, async () => {
      if (!isAuthenticated.value) return;
      await fetchWatching();
    });
  };

  return {
    watching,
    polling: computed({
      get: () => polling.value,
      set: (value: number = WatchingStoreConstants.DefaultPolling) => {
        polling.value = value;
        saveState().catch(e => Logger.error('Failed to save watching state', e));
      },
    }),
    override: computed({
      get: () => override.value,
      set: (value: boolean) => {
        override.value = value;
        saveState().catch(e => Logger.error('Failed to save watching state', e));
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

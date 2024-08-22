import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref } from 'vue';

import type { SimklUserSettings } from '@dvcol/simkl-http-client/models';

import { Logger } from '~/services/logger.service';
import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';

const SimklStoreConstants = {
  Store: 'data.simkl',
} as const;

type SimklStoreState = {
  simklEnabled: boolean;
};

type UserSettings = Record<string, SimklUserSettings>;
type LoadingDictionary = Record<string, boolean>;

export const useSimklStore = defineStore(SimklStoreConstants.Store, () => {
  const { user, isSimklAuthenticated } = useAuthSettingsStoreRefs();
  const simklEnabled = ref(false);
  const userSettings = reactive<UserSettings>({});

  const loading = reactive<LoadingDictionary>({});

  const userSetting = computed(() => userSettings[user.value]);
  const userSettingLoading = computed(() => loading?.[user.value]);

  const saveState = debounce(() =>
    storage.local.set<SimklStoreState>(SimklStoreConstants.Store, {
      simklEnabled: simklEnabled.value,
    }),
  );

  const restoreState = async () => {
    const state = await storage.local.get<SimklStoreState>(SimklStoreConstants.Store);
    if (state?.simklEnabled !== undefined) simklEnabled.value = state.simklEnabled;
  };

  /**
   * Change the current user settings for a specific account
   * @param _settings
   * @param account
   */
  const setUserSetting = async (_settings?: SimklUserSettings, account = _settings?.user?.name) => {
    if (!account) throw new Error('Account is not set');
    if (!_settings) {
      delete userSettings[account];
      return _settings;
    }

    if (!userSettings[account]) userSettings[account] = _settings;
    else Object.assign(userSettings[account], _settings);

    return userSetting.value;
  };

  const fetchUserSettings = async (account = user.value) => {
    if (!isSimklAuthenticated.value) {
      Logger.error('Cannot fetch user settings, user is not authenticated');
      return;
    }
    if (loading?.[account]) {
      Logger.warn('User settings are already loading', { user: account });
      return;
    }

    Logger.debug('Refreshing user settings', { user: account });

    loading[account] = true;
    try {
      await setUserSetting(await TraktService.simkl.settings());
    } catch (err) {
      Logger.error('Failed to refresh user settings', { user: account, err });
    } finally {
      loading[account] = false;
    }
  };

  const initSimklStore = async () => {
    await restoreState();
  };

  return {
    user,
    userSetting,
    userSettingLoading,
    fetchUserSettings,
    setUserSetting,
    simklEnabled: computed({
      get: () => simklEnabled.value || user.value === 'dvcol',
      set: (value: boolean) => {
        simklEnabled.value = value;
        saveState().catch(err => Logger.error('Failed to save simkl state', { value, err }));
      },
    }),
    initSimklStore,
  };
});

export const useSimklStoreRefs = () => storeToRefs(useSimklStore());

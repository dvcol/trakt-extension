import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, watch } from 'vue';

import type { TraktStats } from '@dvcol/trakt-http-client/models';

import type { UserSetting } from '~/models/trakt-service.model';

import { Logger } from '~/services/logger.service';
import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';

type UserSettings = Record<string, UserSetting>;
type UserStats = Record<string, TraktStats>;

type LoadingDictionary = Record<string, boolean>;
type LoadingDictionaries = {
  settings?: boolean;
  stats?: LoadingDictionary;
};

export const defaultUser = 'default';

const UserStoreConstants = {
  Store: 'settings.user',
};

export const useUserSettingsStore = defineStore(UserStoreConstants.Store, () => {
  const userSettings = reactive<UserSettings>({});
  const userStats = reactive<UserStats>({});

  const loading = reactive<LoadingDictionaries>({});

  const { user, isAuthenticated } = useAuthSettingsStoreRefs();
  const userSetting = computed(() => userSettings[user.value]);
  const userStat = computed(() => userStats[user.value]);

  const userStatLoading = computed(() => loading.stats?.[user.value]);
  const userSettingLoading = computed(() => loading.settings);

  /**
   * Save a specific userSettings to chrome storage
   * @param setting
   */
  const syncSetUserSettings = debounce((setting: UserSetting) => {
    if (!setting?.user?.name) return;
    return storage.sync.set(`${UserStoreConstants.Store}.${encodeURIComponent(setting.user.name)}`, setting);
  });

  /**
   * Clear a specific user from chrome storage
   * @param account
   */
  const syncClearUserSettings = debounce((account?: string) => {
    return storage.sync.remove(`${UserStoreConstants.Store}${account ? `.${encodeURIComponent(account)}` : ''}`);
  });

  /**
   * Change the current user settings for a specific account
   * @param _settings
   * @param account
   */
  const setUserSetting = async (_settings: UserSetting = {}, account: string = _settings?.user?.username) => {
    if (!account) throw new Error('Account is not set');
    if (Object.keys(_settings).length < 1) {
      delete userSettings[account];
      syncClearUserSettings(account).catch(err => Logger.error('Failed to clear user settings', { account, err }));
      return _settings;
    }

    if (!userSettings[account]) userSettings[account] = {};
    Object.assign(userSettings[account], _settings);
    syncSetUserSettings(userSettings[account]).catch(err => Logger.error('Failed to set user settings', { account, err }));
    return _settings;
  };

  const fetchUserSettings = async (isStaging: boolean = TraktService.isStaging) => {
    if (loading.settings) {
      Logger.warn('User settings are already loading', { user: user.value });
    }

    Logger.debug('Fetching user settings', { user: user.value });

    loading.settings = true;
    try {
      const _settings = await TraktService.getUserSettings();
      return await setUserSetting({ ..._settings, isStaging });
    } catch (err) {
      Logger.error('Failed to refresh user settings', { user: user.value, err });
    } finally {
      loading.settings = false;
    }
  };

  const fetchUserStats = async (_user = user.value) => {
    if (!isAuthenticated.value) {
      Logger.error('Cannot fetch user stats, user is not authenticated');
      return;
    }
    if (!_user) throw new Error('User is not set');
    if (loading.stats?.[_user]) {
      Logger.warn('User stats are already loading', { user: _user });
      return;
    }

    Logger.debug('Fetching user stats', { user: _user });

    if (!loading.stats) loading.stats = {};
    loading.stats[_user] = true;

    try {
      userStats[_user] = await TraktService.stats.user(_user);
    } catch (err) {
      Logger.error('Failed to fetch user stats', { user: _user, err });
    } finally {
      loading.stats[_user] = false;
    }
  };

  /**
   * Restore all users from chrome storage
   */
  const syncRestoreAllUsers = async () => {
    const restored = await storage.sync.getAll<UserSettings>(`${UserStoreConstants.Store}.`);

    Object.entries(restored).forEach(([account, settings]) => {
      const _account = decodeURIComponent(account.replace(`${UserStoreConstants.Store}.`, ''));
      if (!settings) return;
      if (userSettings[_account]) return;
      if (_account === defaultUser) return;
      userSettings[_account] = {};
      Object.assign(userSettings[_account], settings);
    });
  };

  const initUserStore = async () => {
    await syncRestoreAllUsers();

    // Propagate user change to http service
    watch([user, isAuthenticated], async ([_user, _isAuthenticated]) => {
      if (_user === defaultUser || !_isAuthenticated) return;
      await fetchUserSettings();
    });
  };

  return {
    userStats,
    userStat,
    userStatLoading,
    userSettings,
    userSetting,
    userSettingLoading,
    setUserSetting,
    fetchUserSettings,
    fetchUserStats,
    initUserStore,
  };
});

export const useUserSettingsStoreRefs = () => storeToRefs(useUserSettingsStore());

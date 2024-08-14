import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, ref, watch } from 'vue';

import type { TraktStats } from '@dvcol/trakt-http-client/models';

import type { UserSetting } from '~/models/trakt-service.model';

import { Logger } from '~/services/logger.service';
import { TraktService } from '~/services/trakt.service';
import { storage } from '~/utils/browser/browser-storage.utils';

type UserSettings = Record<string, UserSetting>;
type UserStats = Record<string, TraktStats>;

type LoadingDictionary = Record<string, boolean>;
type LoadingDictionaries = {
  settings?: LoadingDictionary;
  stats?: LoadingDictionary;
};

export const defaultUser = 'default';

const UserStoreConstants = {
  Store: 'settings.user',
  SyncLastUser: 'settings.last-user',
};

export const useUserSettingsStore = defineStore(UserStoreConstants.Store, () => {
  const userSettings = reactive<UserSettings>({});
  const userStats = reactive<UserStats>({});
  const user = ref<string>(defaultUser);

  const loading = reactive<LoadingDictionaries>({});

  const userSetting = computed(() => userSettings[user.value]);
  const userStat = computed(() => userStats[user.value]);

  const userSettingLoading = computed(() => loading.settings?.[user.value]);
  const userStatLoading = computed(() => loading.stats?.[user.value]);

  /**
   * Save the current user settings to chrome storage
   * @param _settings
   * @param account
   */
  const syncSetUser = (_settings: UserSetting = userSetting.value, account: string = _settings?.user?.username ?? user.value) => {
    const _lastUser = storage.sync.set(UserStoreConstants.SyncLastUser, account);
    const _setting = storage.sync.set(`${UserStoreConstants.Store}.${encodeURIComponent(account)}`, _settings);
    return Promise.all([_lastUser, _setting]);
  };

  /**
   * Clear the last user from chrome storage
   */
  const syncClearLastUser = () => storage.sync.remove(UserStoreConstants.SyncLastUser);

  /**
   * Clear a specific user from chrome storage
   * @param account
   */
  const syncClearUser = (account?: string) => {
    return storage.sync.remove(`${UserStoreConstants.Store}${account ? `.${encodeURIComponent(account)}` : ''}`);
  };

  /**
   * Restore a specific user from chrome storage
   * @param account
   */
  const syncRestoreUser = async (account: string = user.value) => {
    if (account === defaultUser) account = await storage.sync.get<string>(UserStoreConstants.SyncLastUser);
    if (!account) account = Object.keys(userSettings).find(_account => _account !== defaultUser) ?? defaultUser;
    user.value = account;
    const _setting = await storage.sync.get<UserSetting>(`${UserStoreConstants.Store}.${encodeURIComponent(account)}`);
    if (!userSettings[account]) userSettings[account] = {};
    if (_setting) Object.assign(userSettings[account], _setting);
    return _setting;
  };

  /**
   * Change the current user settings for a specific account
   * @param _settings
   * @param account
   */
  const setUserSetting = async (_settings: UserSetting = {}, account: string = _settings?.user?.username ?? user.value) => {
    if (Object.keys(_settings).length < 1) {
      delete userSettings[account];
      user.value = defaultUser;
      return Promise.all([syncClearLastUser(), syncClearUser(account)]);
    }

    if (!userSettings[account]) userSettings[account] = {};
    Object.assign(userSettings[account], _settings);
    user.value = account;
    return syncSetUser(userSettings[account], account);
  };

  /**
   * Restore all users from chrome storage
   */
  const syncRestoreAllUsers = async () => {
    const restored = await storage.sync.getAll<UserSettings>(`${UserStoreConstants.Store}.`);

    Object.entries(restored).forEach(([account, settings]) => {
      const _account = decodeURIComponent(account.replace(`${UserStoreConstants.Store}.`, ''));
      if (_account === defaultUser) return;
      if (userSettings[_account]) return;
      if (!settings) return;
      userSettings[_account] = {};
      Object.assign(userSettings[_account], settings);
    });
  };

  /**
   * Change the current user
   * @param account
   */
  const setCurrentUser = (account?: string) => {
    if (!account) account = Object.keys(userSettings).find(_account => _account !== defaultUser);
    if (!account) return;

    if (!userSettings[account]) throw new Error(`User ${account} does not exist`);
    return setUserSetting(userSettings[account], account);
  };

  const refreshUserSettings = async () => {
    if (loading.settings?.[user.value]) {
      Logger.warn('User settings are already loading', { user: user.value });
      return;
    }

    Logger.debug('Refreshing user settings', { user: user.value });

    if (!loading.settings) loading.settings = {};
    loading.settings[user.value] = true;
    try {
      await setUserSetting(await TraktService.getUserSettings());
    } catch (err) {
      Logger.error('Failed to refresh user settings', { user: user.value, err });
    } finally {
      loading.settings[user.value] = false;
    }
  };

  const fetchUserStats = async (_user = user.value) => {
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

  // Propagate user change to http service
  watch(user, _user => {
    Logger.info('User changed', { user: _user });
    TraktService.changeUser(_user);
  });

  return {
    user,
    userStats,
    userStat,
    userStatLoading,
    userSettings,
    userSetting,
    userSettingLoading,
    setUserSetting,
    syncSetUser,
    syncRestoreUser,
    syncRestoreAllUsers,
    setCurrentUser,
    refreshUserSettings,
    fetchUserStats,
  };
});

export const useUserSettingsStoreRefs = () => storeToRefs(useUserSettingsStore());

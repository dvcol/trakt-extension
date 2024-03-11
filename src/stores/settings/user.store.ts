import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, ref, watch } from 'vue';

import type { UserSetting } from '~/models/trakt-service.model';

import { TraktService } from '~/services/trakt.service';
import { storage } from '~/utils/browser/browser-storage.utils';

type UserSettings = Record<string, UserSetting>;

export const defaultUser = 'default';

export const useUserSettingsStore = defineStore('settings.user', () => {
  const userSettings = reactive<UserSettings>({});
  const user = ref<string>(defaultUser);

  const userSetting = computed(() => userSettings[user.value]);

  /**
   * Save the current user settings to chrome storage
   * @param _settings
   * @param account
   */
  const syncSetUser = (_settings: UserSetting = userSetting.value, account: string = _settings?.user?.username ?? user.value) => {
    const _lastUser = storage.sync.set(`settings.last-user`, account);
    const _setting = storage.sync.set(`settings.user.${encodeURIComponent(account)}`, _settings);
    console.info('user-store', 'Saving user', account, JSON.parse(JSON.stringify(_settings)));
    return Promise.all([_lastUser, _setting]);
  };

  /**
   * Clear the last user from chrome storage
   */
  const syncClearLastUser = () => storage.sync.remove(`settings.last-user`);

  /**
   * Clear a specific user from chrome storage
   * @param account
   */
  const syncClearUser = (account?: string) => {
    console.info('user-store', 'Clearing user', account);
    return storage.sync.remove(`settings.user${account ? `.${encodeURIComponent(account)}` : ''}`);
  };

  /**
   * Restore a specific user from chrome storage
   * @param account
   */
  const syncRestoreUser = async (account: string = user.value) => {
    if (account === defaultUser) account = await storage.sync.get<string>(`settings.last-user`);
    if (!account) account = Object.keys(userSettings).find(_account => _account !== defaultUser) ?? defaultUser;
    user.value = account;
    console.info('user-store', 'Restoring user', account);
    const _setting = await storage.sync.get<UserSetting>(`settings.user.${encodeURIComponent(account)}`);
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
    console.info('user-store', 'User changed', account, JSON.parse(JSON.stringify(userSettings[account])));
    user.value = account;
    return syncSetUser(userSettings[account], account);
  };

  /**
   * Restore all users from chrome storage
   */
  const syncRestoreAllUsers = async () => {
    const restored = await storage.sync.getAll<UserSettings>('settings.user.');

    Object.entries(restored).forEach(([account, settings]) => {
      const _account = decodeURIComponent(account.replace('settings.user.', ''));
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
    console.info('user-store', 'Setting current user', JSON.parse(JSON.stringify(userSettings)));

    if (!account) account = Object.keys(userSettings).find(_account => _account !== defaultUser);
    if (!account) return;

    if (!userSettings[account]) throw new Error(`User ${account} does not exist`);
    return setUserSetting(userSettings[account], account);
  };

  // Propagate user change to http service
  watch(user, _user => {
    console.info('user changed', _user);
    TraktService.changeUser(_user);
  });

  return { user, userSettings, userSetting, setUserSetting, syncSetUser, syncRestoreUser, syncRestoreAllUsers, setCurrentUser };
});

export const useUserSettingsStoreRefs = () => storeToRefs(useUserSettingsStore());

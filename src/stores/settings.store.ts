import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref } from 'vue';

import type { TmdbClientAuthentication } from '~/models/tmdb/tmdb-client.model';
import type { TraktClientAuthentication } from '~/models/trakt/trakt-authentication.model';

import type { TraktUserSettings } from '~/models/trakt/trakt-user.model';
import type { TvdbClientAuthentication } from '~/models/tvdb/tvdb-client.model';

import { storage } from '~/utils/browser/browser-storage.utils';

type UserSetting = TraktUserSettings | Record<string, never>;
type UserSettings = Record<string, UserSetting>;

export const useUserSettingsStore = defineStore('settings.user', () => {
  const userSettings = reactive<UserSettings>({});
  const user = ref<string>('default');
  const userSetting = computed(() => userSettings[user.value]);

  const syncSetUser = (_settings: UserSetting = userSetting.value, account: string = _settings?.user?.username ?? user.value) => {
    const _lastUser = storage.sync.set(`settings.last-user`, account);
    const _setting = storage.sync.set(`settings.user.${encodeURIComponent(account)}`, _settings);
    console.info('settings-store', 'Saving user', account, _settings);
    return Promise.all([_lastUser, _setting]);
  };
  const syncClearUser = (account?: string) => {
    console.info('settings-store', 'Clearing user', account);
    return storage.sync.remove(`settings.user${account ? `.${encodeURIComponent(account)}` : ''}`);
  };
  const syncRestoreUser = async (account: string = user.value) => {
    if (account === 'default') account = (await storage.sync.get<string>(`settings.last-user`)) || account;
    user.value = account;
    console.info('settings-store', 'Restoring user', account);
    const _setting = await storage.sync.get<UserSetting>(`settings.user.${encodeURIComponent(account)}`);
    if (!userSettings[account]) userSettings[account] = {};
    if (_setting) Object.assign(userSettings[account], _setting);
    return _setting;
  };

  const setUserSetting = (_settings: UserSetting = {}, account: string = _settings?.user?.username ?? user.value) => {
    if (!userSettings[account]) userSettings[account] = {};
    Object.assign(userSettings[account], _settings);
    console.info('settings-store', 'User changed', account, { ..._settings });
    if (_settings) {
      user.value = account;
      return syncSetUser(_settings, account);
    }
    user.value = 'default';
    return syncClearUser(account);
  };

  return { user, userSetting, setUserSetting, syncSetUser, syncClearUser, syncRestoreUser };
});

export const useUserSettingsStoreRefs = () => storeToRefs(useUserSettingsStore());

type SettingsAuth = {
  trakt?: TraktClientAuthentication;
  tvdb?: TvdbClientAuthentication;
  tmdb?: TmdbClientAuthentication;
};

type SettingsAuthenticated = {
  trakt?: boolean;
  tvdb?: boolean;
  tmdb?: boolean;
};

type SettingsAuths = Record<string, SettingsAuth>;

export const useAuthSettingsStore = defineStore('settings.auth', () => {
  const { user } = useUserSettingsStoreRefs();

  const auths = reactive<SettingsAuths>({});
  const auth = computed(() => auths[user.value]);

  const authenticated = reactive<SettingsAuthenticated>({});
  const isAuthenticated = computed(() => {
    const values = Object.values(authenticated);
    return values.length > 0 ? values.every(Boolean) : false;
  });

  const setAuthenticated = ({ trakt, tvdb, tmdb }: SettingsAuth = {}) => {
    if (trakt) authenticated.trakt = !!trakt.access_token;
    if (tvdb) authenticated.tvdb = !!tvdb.accessToken;
    if (tmdb) authenticated.tmdb = !!tmdb.accessToken;
    return authenticated;
  };

  const syncSetAuth = (_auth: SettingsAuth = auth.value, account: string = user.value) => {
    console.info('settings-store', 'Saving auth', account, _auth);
    return storage.sync.set(`settings.auth.${encodeURIComponent(account)}`, _auth);
  };
  const syncClearAuth = (account?: string) => {
    console.info('settings-store', 'Clearing auth', account);
    return storage.sync.remove(`settings.auth${account ? `.${encodeURIComponent(account)}` : ''}`);
  };
  const syncRestoreAuth = async (account: string = user.value) => {
    console.info('settings-store', 'Restoring auth', account);
    const _auth = await storage.sync.get<SettingsAuth>(`settings.auth.${encodeURIComponent(account)}`);
    if (!auths[account]) auths[account] = {};
    if (_auth) Object.assign(auths[account], _auth);
    setAuthenticated(_auth);
    return auths[account];
  };

  const setAuth = async (_auth: SettingsAuth = {}, account: string = user.value) => {
    if (!auths[account]) auths[account] = {};
    if (_auth.trakt) auths[account].trakt = _auth.trakt;
    if (_auth.tvdb) auths[account].tvdb = _auth.tvdb;
    if (_auth.tmdb) auths[account].tmdb = _auth.tmdb;
    console.info('settings-store', 'Auth changed', account, { ...auths });
    setAuthenticated(_auth);
    if (Object.keys(_auth).length > 0) return syncSetAuth(_auth, account);
    return syncClearAuth(account);
  };

  return { auth, setAuth, authenticated, isAuthenticated, syncRestoreAuth, syncSetAuth };
});

export const useAuthSettingsStoreRefs = () => storeToRefs(useAuthSettingsStore());

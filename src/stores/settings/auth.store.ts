import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive } from 'vue';

import type { SettingsAuth } from '~/models/trakt-service.model';

import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
import { storage } from '~/utils/browser/browser-storage.utils';

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

  const setAuthenticated = ({ trakt, tvdb, tmdb }: SettingsAuth = auth.value) => {
    if (trakt) authenticated.trakt = !!trakt.access_token;
    if (tvdb) authenticated.tvdb = !!tvdb.accessToken;
    if (tmdb) authenticated.tmdb = !!tmdb.accessToken;

    if (!trakt && !tvdb && !tmdb) {
      delete authenticated.trakt;
      delete authenticated.tvdb;
      delete authenticated.tmdb;
    }
    console.info('auth-store', 'authentication changed', authenticated);
    return authenticated;
  };

  const syncSetAuth = (_auth: SettingsAuth = auth.value, account: string = user.value) => {
    console.info('auth-store', 'Saving auth', account, JSON.parse(JSON.stringify(_auth)));
    return storage.sync.set(`settings.auth.${encodeURIComponent(account)}`, _auth);
  };

  const syncClearAuth = (account?: string) => {
    console.info('auth-store', 'Clearing auth', account);
    return storage.sync.remove(`settings.auth${account ? `.${encodeURIComponent(account)}` : ''}`);
  };

  const syncRestoreAuth = async (account: string = user.value) => {
    console.info('auth-store', 'Restoring auth', account);
    const _auth = await storage.sync.get<SettingsAuth>(`settings.auth.${encodeURIComponent(account)}`);
    if (!auths[account]) auths[account] = {};
    if (_auth) Object.assign(auths[account], _auth);
    setAuthenticated();
    return auths[account];
  };

  const setAuth = async (_auth: SettingsAuth = {}, account: string = user.value) => {
    if (Object.keys(_auth).length < 1) {
      delete auths[account];
      setAuthenticated(_auth);
      return syncClearAuth(account);
    }

    if (!auths[account]) auths[account] = {};
    if (_auth.trakt) auths[account].trakt = _auth.trakt;
    if (_auth.tvdb) auths[account].tvdb = _auth.tvdb;
    if (_auth.tmdb) auths[account].tmdb = _auth.tmdb;

    console.info('auth-store', 'Auth changed', account, JSON.parse(JSON.stringify(auths[account])));

    setAuthenticated();
    return syncSetAuth(auths[account], account);
  };

  return { auth, setAuth, authenticated, isAuthenticated, syncRestoreAuth, syncSetAuth };
});

export const useAuthSettingsStoreRefs = () => storeToRefs(useAuthSettingsStore());

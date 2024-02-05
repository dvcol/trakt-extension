import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive } from 'vue';

import type { TmdbClientAuthentication } from '~/models/tmdb/tmdb-client.model';
import type { TraktClientAuthentication } from '~/models/trakt/trakt-authentication.model';

import type { TvdbClientAuthentication } from '~/models/tvdb/tvdb-client.model';

import { storage } from '~/utils/browser/browser-storage.utils';

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

export const useSettingsStore = defineStore('settings', () => {
  const auth = reactive<SettingsAuth>({});
  const authenticated = reactive<SettingsAuthenticated>({});
  const isAuthenticated = computed(() => Object.values(authenticated).every(Boolean));

  const setAuthenticated = ({ trakt, tvdb, tmdb }: SettingsAuth = {}) => {
    if (trakt) authenticated.trakt = !!trakt.access_token;
    if (tvdb) authenticated.tvdb = !!tvdb.accessToken;
    if (tmdb) authenticated.tmdb = !!tmdb.accessToken;
  };

  const syncSetAuth = (_auth: SettingsAuth) => storage.sync.set('settings.auth', _auth);
  const syncClearAuth = () => storage.sync.remove('settings.auth');
  const syncRestoreAuth = () =>
    storage.sync.get<SettingsAuth>('settings.auth').then(_auth => {
      Object.assign(auth, _auth);
      setAuthenticated(_auth);
      return _auth;
    });

  const setAuth = (_auth: SettingsAuth = {}) => {
    if (_auth.trakt) auth.trakt = _auth.trakt;
    if (_auth.tvdb) auth.tvdb = _auth.tvdb;
    if (_auth.tmdb) auth.tmdb = _auth.tmdb;
    console.info('settings-store', 'Auth changed', { ...auth });
    setAuthenticated(_auth);
    if (Object.keys(_auth).length > 0) {
      syncSetAuth(auth).then(() => console.info('settings-store', 'Auth saved', { ...auth }));
    } else {
      syncClearAuth().then(() => console.info('settings-store', 'Auth cleared'));
    }
  };

  return { auth, setAuth, authenticated, isAuthenticated, syncRestoreAuth };
});

export const useSettingsStoreRefs = () => storeToRefs(useSettingsStore());

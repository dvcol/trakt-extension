import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

import type { TraktClientAuthentication } from '~/models/trakt/trakt-authentication.model';

import { storage } from '~/utils/browser/browser-storage.utils';

export const useSettingsStore = defineStore('settings', () => {
  const auth = ref<TraktClientAuthentication>();
  const isAuthenticated = ref(false);

  const setAuthenticated = (authenticated: boolean = false) => {
    isAuthenticated.value = authenticated;
  };

  const syncSetAuth = (_auth: TraktClientAuthentication) => storage.sync.set('settings.auth', _auth);
  const syncClearAuth = () => storage.sync.remove('settings.auth');
  const syncRestoreAuth = () =>
    storage.sync.get<TraktClientAuthentication>('settings.auth').then(_auth => {
      auth.value = _auth;
      setAuthenticated(!!_auth?.access_token);
      return _auth;
    });

  const setAuth = (_auth?: TraktClientAuthentication) => {
    auth.value = _auth;
    setAuthenticated(!!_auth?.access_token);
    console.info('settings-store', 'Auth changed', _auth);
    if (_auth?.access_token) {
      syncSetAuth(_auth).then(() => console.info('settings-store', 'Auth saved', _auth));
    } else {
      syncClearAuth().then(() => console.info('settings-store', 'Auth cleared'));
    }
  };

  return { auth, setAuth, isAuthenticated, setAuthenticated, syncRestoreAuth };
});

export const useSettingsStoreRefs = () => storeToRefs(useSettingsStore());

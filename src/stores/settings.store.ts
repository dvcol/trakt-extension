import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { TraktClientAuthentication } from '~/models/trakt-authentication.model';

export const useSettingsStore = defineStore('settings', () => {
  const auth = ref<TraktClientAuthentication>();
  const setAuth = (_auth?: TraktClientAuthentication) => {
    auth.value = _auth;
  };

  const isAuthenticated = ref(false);
  const setAuthenticated = (authenticated: boolean = false) => {
    isAuthenticated.value = authenticated;
  };

  return { auth, setAuth, isAuthenticated, setAuthenticated };
});

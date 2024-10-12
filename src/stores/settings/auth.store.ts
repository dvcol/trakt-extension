import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, ref } from 'vue';

import type { RecursiveRecord } from '@dvcol/common-utils/common';
import type { SettingsAuth } from '~/models/trakt-service.model';

import { isLoginAuthResponseSuccess } from '~/models/login/login-auth-response';
import { Logger } from '~/services/logger.service';
import { TraktService } from '~/services/trakt.service';
import { useRouterStore, useRouterStoreRefs } from '~/stores/router.store';
import { defaultUser } from '~/stores/settings/user.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';
import { useWaitReady } from '~/utils/store.utils';

type SettingsAuthenticated = {
  trakt?: boolean;
  simkl?: boolean;
  tmdb?: boolean;
};

type SettingsAuths = Record<string, SettingsAuth>;

const AuthStoreConstants = {
  Store: 'settings.auth',
  SyncLastUser: 'settings.last-user',
} as const;

export const useAuthSettingsStore = defineStore(AuthStoreConstants.Store, () => {
  const user = ref<string>(defaultUser);
  const loading = ref<boolean>(false);

  const auths = reactive<SettingsAuths>({});
  const auth = computed(() => auths[user.value]);

  const authenticated = computed<SettingsAuthenticated>(() => ({
    trakt: !!auths[user.value]?.trakt?.access_token,
    simkl: !!auths[user.value]?.simkl?.access_token,
    tmdb: !!auths[user.value]?.tmdb?.accessToken,
  }));
  const isAuthenticated = computed(() => !!authenticated.value.trakt);
  const isSimklAuthenticated = computed(() => !!authenticated.value.simkl);

  /**
   * Save the current user settings to chrome storage
   * @param account
   */
  const syncSetLastUser = debounce((account: string = user.value) => {
    return storage.sync.set(AuthStoreConstants.SyncLastUser, account);
  });

  /**
   * Clear the last user from chrome storage
   */
  const syncClearLastUser = debounce(() => {
    return storage.sync.remove(AuthStoreConstants.SyncLastUser);
  });

  const importAuth = async (_auth = auth.value) => {
    if (loading.value) Logger.warn('Auth is already loading', _auth);

    loading.value = true;
    try {
      await TraktService.importAuthentication(auth.value);
    } catch (error) {
      Logger.error('Failed to import authentication', error);
      await TraktService.logout();
    } finally {
      loading.value = false;
    }
  };

  /**
   * Change the current user
   * @param account
   * @param _import
   */
  const setCurrentUser = (account?: string, _import: boolean = true) => {
    if (!account) account = Object.keys(auths).find(_account => _account !== defaultUser);

    user.value = account ?? defaultUser;
    TraktService.changeUser(user.value);
    if (defaultUser === user.value) syncClearLastUser().catch(err => Logger.error('Failed to clear last user', err));
    else syncSetLastUser().catch(err => Logger.error('Failed to set last user', err));
    if (!_import) return;
    return importAuth(auths[user.value]);
  };

  /**
   * Restore a specific user from chrome storage
   */
  const syncRestoreUser = async () => {
    const account = await storage.sync.get<string>(AuthStoreConstants.SyncLastUser);
    return setCurrentUser(account);
  };

  const syncSetAuth = (_auth: SettingsAuth = auth.value, account: string = user.value) => {
    return storage.sync.set(`${AuthStoreConstants.Store}.${encodeURIComponent(account)}`, _auth);
  };

  const syncClearAuth = (account?: string) => {
    return storage.sync.remove(`${AuthStoreConstants.Store}${account ? `.${encodeURIComponent(account)}` : ''}`);
  };

  /**
   * Set the current authentication for a specific account
   *
   * Note only set non undefined values.
   * To clear a value, set it to null.
   * To clear all values, set _auth to an empty object.
   *
   * @param _auth
   * @param account
   */
  const setAuth = async (_auth: SettingsAuth = {}, account: string = user.value) => {
    if (Object.keys(_auth).length < 1) {
      delete auths[account];
      return syncClearAuth(account);
    }

    if (!auths[account]) auths[account] = {};
    if (_auth.trakt !== undefined) auths[account].trakt = _auth.trakt;
    if (_auth.tmdb !== undefined) auths[account].tmdb = _auth.tmdb;
    if (_auth.simkl !== undefined) auths[account].simkl = _auth.simkl;

    if (_auth.trakt === null) delete auths[account].trakt;
    if (_auth.tmdb === null) delete auths[account].tmdb;
    if (_auth.simkl === null) delete auths[account].simkl;

    return syncSetAuth(auths[account], account);
  };

  const { waitReady, setReady, resetReady } = useWaitReady();

  const { setRouteParam } = useRouterStore();
  const { routeParam } = useRouterStoreRefs();

  const syncRestoreAuths = async () => {
    const _auths = await storage.sync.getAll<SettingsAuths>(`${AuthStoreConstants.Store}.`);

    if (!_auths) return auths;

    Object.entries(_auths).forEach(([key, value]) => {
      if (!value || Object.keys(value).length < 1) return;
      const _account = decodeURIComponent(key.replace(`${AuthStoreConstants.Store}.`, ''));
      if (!_account?.length) return;
      if (!auths[_account]) auths[_account] = {};
      Object.assign(auths[_account], value);
    });

    return auths;
  };

  const loginNewUser = async (query: { code: string; simkl?: boolean }) => {
    try {
      loading.value = true;
      if (query.simkl) {
        Logger.debug('Logging in with Simkl');
        await syncRestoreUser();
        if (user.value === defaultUser) {
          Logger.error('Cannot login with Simkl, user is not set');
          return;
        }
        await TraktService.simkl.login(query.code);
      } else {
        Logger.debug('Logging in with Trakt.tv');
        await TraktService.login(query.code);
      }
    } catch (error) {
      Logger.error(`Failed to login with ${query.simkl ? 'Simkl' : 'Trakt.tv'}`);
      Logger.error(error);
    } finally {
      loading.value = false;
    }
  };

  let unsub: (() => void) | undefined;
  const initAuthStore = async () => {
    await syncRestoreAuths();

    const query: RecursiveRecord = { ...routeParam.value };
    // if the route has a query param, clear them for next time
    if (routeParam.value) setRouteParam(undefined);

    if (isLoginAuthResponseSuccess(query)) {
      await loginNewUser(query);
    } else {
      await syncRestoreUser();
    }

    unsub = TraktService.listen();

    setReady();
  };

  const destroyAuthStore = () => {
    resetReady();
    unsub?.();
  };

  return {
    user,
    auth,
    auths,
    setAuth,
    authenticated,
    isAuthenticated,
    isSimklAuthenticated,
    initAuthStore,
    destroyAuthStore,
    waitAuthReady: waitReady,
    loading,
    importAuth,
    setCurrentUser,
  };
});

export const useAuthSettingsStoreRefs = () => storeToRefs(useAuthSettingsStore());

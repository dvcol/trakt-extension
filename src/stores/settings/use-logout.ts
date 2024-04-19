import { useRouter } from 'vue-router';

import { Route } from '~/models/router.model';
import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStore } from '~/stores/settings/auth.store';
import { defaultUser, useUserSettingsStore, useUserSettingsStoreRefs } from '~/stores/settings/user.store';

export const useLogout = () => {
  const router = useRouter();
  const { user } = useUserSettingsStoreRefs();
  const { setCurrentUser } = useUserSettingsStore();
  const { syncRestoreAuth } = useAuthSettingsStore();

  const loadUser = async (account: string) => {
    const auth = await syncRestoreAuth(account);
    return TraktService.importAuthentication(auth);
  };

  const logout = async () => {
    await TraktService.logout();
    await setCurrentUser();
    if (user.value !== defaultUser) return loadUser(user.value);
    return router.push(Route.Login);
  };

  return { logout, loadUser };
};

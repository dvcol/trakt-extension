import { useRouter } from 'vue-router';

import { Route } from '~/models/router.model';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStore, useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';

export const useLogout = () => {
  const router = useRouter();
  const { loading, user } = useAuthSettingsStoreRefs();
  const { setCurrentUser } = useAuthSettingsStore();

  const loadUser = async (account: string) => {
    if (loading.value) {
      NotificationService.message.warning('User is still loading, please wait.');
      return;
    }
    return setCurrentUser(account);
  };

  const logout = async (account: string = user.value) => {
    await TraktService.logout(account);
    await TraktService.simkl.logout(account);
    await setCurrentUser();
    return router.push(Route.Login);
  };

  return { logout, loadUser };
};

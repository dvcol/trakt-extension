import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStore } from '~/stores/settings/auth.store';
import { useUserSettingsStore } from '~/stores/settings/user.store';

export const initServices = async () => {
  const { syncRestoreAuth } = useAuthSettingsStore();
  const { syncRestoreUser, syncRestoreAllUsers } = useUserSettingsStore();

  console.info('init-services', window.location.href);

  const restoredSettings = await syncRestoreUser();
  const restoredAuth = await syncRestoreAuth(restoredSettings?.user?.username);

  await TraktService.importAuthentication(restoredAuth);

  TraktService.listen();

  await syncRestoreAllUsers();
};

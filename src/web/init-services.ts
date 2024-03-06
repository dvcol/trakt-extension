import { TraktService } from '~/services/trakt.service';
import { useAppStateStore } from '~/stores/app-state.store';
import { useAuthSettingsStore } from '~/stores/settings/auth.store';
import { useUserSettingsStore } from '~/stores/settings/user.store';
import { initLocalI18n } from '~/utils';

export const initServices = async () => {
  const { setAppReady } = useAppStateStore();
  const { syncRestoreAuth } = useAuthSettingsStore();
  const { syncRestoreUser, syncRestoreAllUsers } = useUserSettingsStore();

  const restoredSettings = await syncRestoreUser();
  const restoredAuth = await syncRestoreAuth(restoredSettings?.user?.username);

  await TraktService.importAuthentication(restoredAuth);

  TraktService.listen();

  await initLocalI18n().promise;

  setAppReady(true);

  await syncRestoreAllUsers();
};

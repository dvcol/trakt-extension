import { TraktService } from '~/services/trakt.service';
import { useAppStateStore } from '~/stores/app-state.store';
import { useActivityStore } from '~/stores/data/activity.store';
import { useHistoryStore } from '~/stores/data/history.store';
import { useImageStore } from '~/stores/data/image.store';
import { useListsStore, useListStore } from '~/stores/data/list.store';
import { useSearchStore } from '~/stores/data/search.store';
import { useShowStore } from '~/stores/data/show.store';
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

  await Promise.all([
    initLocalI18n().promise,
    syncRestoreAllUsers(),
    useImageStore().initImageStore(),
    useListsStore().initListsStore(),
    useListStore().initListStore(),
    useHistoryStore().initHistoryStore(),
    useSearchStore().initSearchStore(),
    useShowStore().initShowStore(),
  ]);

  await useActivityStore().initActivityStore();

  setAppReady(true);
};

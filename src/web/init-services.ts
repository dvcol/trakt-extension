import { LoggerColor } from '@dvcol/common-utils/common/logger';

import { Logger } from '~/services/logger.service';
import { TraktService } from '~/services/trakt.service';
import { useAppStateStore } from '~/stores/app-state.store';
import { useActivityStore } from '~/stores/data/activity.store';
import { useCalendarStore } from '~/stores/data/calendar.store';
import { useHistoryStore } from '~/stores/data/history.store';
import { useImageStore } from '~/stores/data/image.store';
import { useListsStore, useListStore } from '~/stores/data/list.store';
import { useMovieStore } from '~/stores/data/movie.store';
import { useReleasesStore } from '~/stores/data/releases.store';
import { useSearchStore } from '~/stores/data/search.store';
import { useShowStore } from '~/stores/data/show.store';
import { useWatchingStore } from '~/stores/data/watching.store';
import { useAuthSettingsStore } from '~/stores/settings/auth.store';
import { useContextMenuStore } from '~/stores/settings/context-menu.store';
import { useExtensionSettingsStore } from '~/stores/settings/extension.store';
import { useLinksStore } from '~/stores/settings/links.store';
import { useLogStore } from '~/stores/settings/log.store';
import { useUserSettingsStore } from '~/stores/settings/user.store';
import { initLocalI18n } from '~/utils/i18n.utils';

export const initServices = async () => {
  await useLogStore().initLogStore();

  const { setAppReady } = useAppStateStore();
  const { syncRestoreAuth } = useAuthSettingsStore();
  const { syncRestoreUser, syncRestoreAllUsers } = useUserSettingsStore();

  const restoredSettings = await syncRestoreUser();
  const restoredAuth = await syncRestoreAuth(restoredSettings?.user?.username);

  await TraktService.importAuthentication(restoredAuth);

  TraktService.listen();

  await Promise.all([
    // init custom links
    useLinksStore().initLinksStore(),
    // init extension settings
    useExtensionSettingsStore().initExtensionSettingsStore(),
  ]);

  const { isAuthenticated } = useAuthSettingsStore();
  await useActivityStore().initActivityStore(isAuthenticated);

  await Promise.all([
    initLocalI18n().promise,
    syncRestoreAllUsers(),
    useImageStore().initImageStore(),
    useListsStore().initListsStore(),
    useListStore().initListStore(),
    useCalendarStore().initCalendarStore(),
    useReleasesStore().initReleasesStore(),
    useHistoryStore().initHistoryStore(),
    useSearchStore().initSearchStore(),
    useShowStore().initShowStore(),
    useMovieStore().initMovieStore(),
    useContextMenuStore().initContextMenuStore(),
    useWatchingStore().initWatchingStore(),
  ]);

  setAppReady(true);

  Logger.info(...Logger.colorize(LoggerColor.Success, Logger.timestamp, 'All services initialized!'));
};

import { LoggerColor } from '@dvcol/common-utils/common/logger';

import type { MessagePayload } from '~/models/message/message-type.model';

import { MessageType } from '~/models/message/message-type.model';

import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
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
import { useBadgeStore } from '~/stores/settings/badge.store';
import { useContextMenuStore } from '~/stores/settings/context-menu.store';
import { useExtensionSettingsStore } from '~/stores/settings/extension.store';
import { useLinksStore } from '~/stores/settings/links.store';
import { useLogStore } from '~/stores/settings/log.store';
import { useUserSettingsStore } from '~/stores/settings/user.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { initLocalI18n } from '~/utils/i18n.utils';

const onVersionUpdate = async () => {
  const versionUpdate = await storage.local.get<MessagePayload<typeof MessageType.VersionUpdate>>(MessageType.VersionUpdate);
  if (!versionUpdate) return;

  NotificationService.release(versionUpdate);
  await storage.local.remove(MessageType.VersionUpdate);
};

export const initServices = async () => {
  await useLogStore().initLogStore();

  const { setAppReady } = useAppStateStore();
  const { syncRestoreAuth } = useAuthSettingsStore();
  const { syncRestoreUser, syncRestoreAllUsers } = useUserSettingsStore();

  const restoredSettings = await syncRestoreUser();
  const restoredAuth = await syncRestoreAuth(restoredSettings?.user?.username);

  try {
    await TraktService.importAuthentication(restoredAuth);
  } catch (error) {
    Logger.error('Failed to import authentication', error);
    await TraktService.logout();
  }

  TraktService.listen();

  await Promise.all([
    // init custom links
    useLinksStore().initLinksStore(),
    // init extension settings
    useExtensionSettingsStore().initExtensionSettingsStore(),
  ]);

  await useActivityStore().initActivityStore();

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

  // requires calendarStore to be init
  await useBadgeStore().initBadgeStore();

  setAppReady(true).catch(Logger.error);

  Logger.info(...Logger.colorize(LoggerColor.Success, Logger.timestamp, 'All services initialized!'));

  onVersionUpdate().catch(Logger.error);
};

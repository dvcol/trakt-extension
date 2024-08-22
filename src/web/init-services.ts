import { LoggerColor } from '@dvcol/common-utils/common/logger';

import type { MessagePayload } from '~/models/message/message-type.model';

import { MessageType } from '~/models/message/message-type.model';

import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
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
import { useSimklStore } from '~/stores/data/simkl.store';
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

export const initServices = async (options: { option?: boolean; popup?: boolean; web?: boolean } = {}) => {
  await useLogStore().initLogStore();

  const { setAppReady } = useAppStateStore();

  await useAuthSettingsStore().initAuthStore();
  await useUserSettingsStore().initUserStore();

  await Promise.all([
    // init custom links
    useLinksStore().initLinksStore(),
    // init extension settings
    useExtensionSettingsStore().initExtensionSettingsStore(),
  ]);

  await initLocalI18n().promise;

  await useActivityStore().initActivityStore();

  await Promise.all([
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
    useSimklStore().initSimklStore(),
  ]);

  // requires calendarStore to be init
  await useBadgeStore().initBadgeStore();

  setAppReady(true, options).catch(Logger.error);

  Logger.info(...Logger.colorize(LoggerColor.Success, Logger.timestamp, 'All services initialized!'));

  onVersionUpdate().catch(Logger.error);
};

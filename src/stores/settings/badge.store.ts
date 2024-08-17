import { DateUtils, dayOfTheWeek, getTodayISOLocal } from '@dvcol/common-utils/common/date';
import { defineStore, storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

import type { CalendarItem } from '~/utils/calendar.utils';

import { ListScrollItemType } from '~/models/list-scroll.model';
import { MessageType } from '~/models/message/message-type.model';

import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { fetchCalendarData } from '~/stores/data/calendar.store';
import { fetchProgressData } from '~/stores/data/progress.store';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
import { Colors } from '~/styles/colors.style';
import { sendMessage } from '~/utils/browser/browser-message.utils';
import { storage } from '~/utils/browser/browser-storage.utils';
import { spaceDate } from '~/utils/calendar.utils';
import { debounce } from '~/utils/debounce.utils';

const cleanCalendarBadge = () => sendMessage({ type: MessageType.BadgeUpdate, payload: { text: '', title: '' } });

const getBadgeText = (items: unknown[]) => {
  if (!items?.length) return '';
  if (items.length > 99) return '99+';
  return items.length.toString();
};

const getSeasonEpisode = (item?: { season?: number; number?: number }) => {
  if (!item?.season || !item?.number) return;
  const season = item.season.toString().padStart(2, '0');
  const episode = item.number.toString().padStart(2, '0');
  return `s${season}e${episode}`;
};

const getEpisodeLine = (item: { show?: { title: string }; episode?: { season?: number; number?: number; title: string } }) => {
  if (!item.show?.title) return;
  const seasonEpisode = getSeasonEpisode(item.episode);
  let text = `show  |  ${item.show.title}`;
  if (seasonEpisode) text += ` - ${seasonEpisode}`;
  if (item.episode?.title) text += ` - ${item.episode.title}`;
  return text;
};

const sendCalendarBadge = async (start_date = DateUtils.previous(1), days = 8) => {
  const items: CalendarItem[] = await fetchCalendarData({ start_date, days });

  if (!items?.length) return cleanCalendarBadge();
  const spaced = spaceDate(items, { startDate: start_date, endDate: DateUtils.next(days - 1, start_date), days });

  // reduce to week record indexed by day of the week
  const week = spaced.reduce(
    (acc, item) => {
      const day = item.date.toISOString().split('T')[0];
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    },
    {} as Record<string, CalendarItem[]>,
  );

  const today = getTodayISOLocal().split('T')[0];
  const text = getBadgeText(week[today]);
  const title = [
    'Calendar',
    ...Object.entries(week).map(([_day, _items]) =>
      [
        `${_day} - ${today === _day ? 'Today' : dayOfTheWeek(_day)}\n`,
        ..._items
          .map(item => {
            if (item.type === ListScrollItemType.placeholder) return '—';
            if ('show' in item) return getEpisodeLine(item);
            if ('movie' in item) return `movie |  ${item.movie.title}`;
            return undefined;
          })
          .filter(Boolean),
      ].join('\n'),
    ),
  ];
  return sendMessage({
    type: MessageType.BadgeUpdate,
    payload: { text, title: title.join('\n\n'), color: Colors.white, backgroundColor: Colors.traktRedDark },
  });
};

const sendProgressBadge = async () => {
  const items = await fetchProgressData();
  if (!items?.length) return cleanCalendarBadge();
  const text = getBadgeText(items);
  const title = [
    'Progress',
    items
      .map(item => {
        if (item.type === ListScrollItemType.placeholder) return '—';
        if (item.type === 'episode' && item.meta) return getEpisodeLine({ ...item.meta, episode: { ...item?.meta?.episode, title: '' } });
        if (item.type === 'show') return `show  |  ${item.title}`;
        if (item.type === 'movie') return `movie |  ${item.title}`;
        return undefined;
      })
      .filter(Boolean)
      .join('\n'),
  ];

  return sendMessage({
    type: MessageType.BadgeUpdate,
    payload: { text, title: title.join('\n\n'), color: Colors.white, backgroundColor: Colors.traktRedDark },
  });
};

export const BadgeMode = {
  Calendar: 'calendar',
  Progress: 'progress',
} as const;

type BadgeStoreState = {
  enableBadge: boolean;
  badgeMode: BadgeModes;
};
export type BadgeModes = (typeof BadgeMode)[keyof typeof BadgeMode];

const BadgeStoreConstants = {
  Store: 'settings.badge',
} as const;

export const useBadgeStore = defineStore(BadgeStoreConstants.Store, () => {
  const enableBadge = ref(false);
  const badgeMode = ref<BadgeModes>(BadgeMode.Calendar);

  const loading = ref(false);

  const saveState = debounce(
    () =>
      storage.sync.set<BadgeStoreState>(BadgeStoreConstants.Store, {
        enableBadge: enableBadge.value,
        badgeMode: badgeMode.value,
      }),
    500,
  );

  const restoreState = async () => {
    const restored = await storage.sync.get<BadgeStoreState>(BadgeStoreConstants.Store);

    if (restored?.enableBadge !== undefined) enableBadge.value = restored.enableBadge;
    if (restored?.badgeMode !== undefined) badgeMode.value = restored.badgeMode;
  };

  const { isAuthenticated } = useAuthSettingsStoreRefs();
  const sendBadgeUpdate = async () => {
    if (!enableBadge.value) return cleanCalendarBadge();
    if (!isAuthenticated.value) return cleanCalendarBadge();
    if (loading.value) {
      Logger.warn('Already loading badge data');
      return;
    }

    loading.value = true;

    Logger.debug('Getting badge data');

    try {
      if (badgeMode.value === BadgeMode.Progress) {
        await sendProgressBadge();
      } else {
        await sendCalendarBadge();
      }
    } catch (e) {
      Logger.error('Failed to get badge data', e);
      NotificationService.error('Failed to get badge data', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const { isProgressEnabled } = useExtensionSettingsStoreRefs();
  const { user } = useUserSettingsStoreRefs();
  const initBadgeStore = async () => {
    await restoreState();

    watch(
      enableBadge,
      async () => {
        await sendBadgeUpdate();
      },
      {
        immediate: true,
      },
    );

    watch(badgeMode, async () => {
      await sendBadgeUpdate();
    });

    watch(user, async () => {
      await sendBadgeUpdate();
    });

    watch(isProgressEnabled, async _enabled => {
      if (_enabled) return;
      badgeMode.value = BadgeMode.Calendar;
      await saveState().catch(err => Logger.error('Failed to save badge mode extension settings', { value: badgeMode.value, err }));
    });
  };

  return {
    saveState,
    restoreState,
    initBadgeStore,
    enableBadge: computed({
      get: () => enableBadge.value,
      set: (value: boolean) => {
        enableBadge.value = value;
        saveState().catch(err => Logger.error('Failed to save enable badge extension settings', { value, err }));
      },
    }),
    badgeMode: computed({
      get: () => badgeMode.value,
      set: (value: BadgeModes) => {
        badgeMode.value = value;
        saveState().catch(err => Logger.error('Failed to save badge mode extension settings', { value, err }));
      },
    }),
  };
});

export const useBadgeStoreRefs = () => storeToRefs(useBadgeStore());

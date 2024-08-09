import { DateUtils, dayOfTheWeek } from '@dvcol/common-utils/common/date';
import { defineStore, storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

import type { CalendarItem } from '~/utils/calendar.utils';

import { MessageType } from '~/models/message/message-type.model';
import { Logger } from '~/services/logger.service';
import { fetchCalendarData } from '~/stores/data/calendar.store';
import { Colors } from '~/styles/colors.style';
import { sendMessage } from '~/utils/browser/browser-message.utils';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';

const sendCalendarBadge = async () => {
  const items: CalendarItem[] = await fetchCalendarData({ start_date: DateUtils.previous(1), days: 7 });
  // reduce to week record indexed by day of the week
  const week = items.reduce(
    (acc, item) => {
      const day = item.date.toISOString().split('T')[0];
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    },
    {} as Record<string, CalendarItem[]>,
  );

  const today = new Date().toISOString().split('T')[0];
  const text = week[today]?.length.toString();
  if (!text?.length) return;
  const title = Object.entries(week)
    .map(([_day, _items]) =>
      [
        `${_day} - ${today === _day ? 'Today' : dayOfTheWeek(_day)}\n`,
        ..._items
          .map(item => {
            if ('show' in item)
              return `show  |  ${item.show.title} - s${item.episode.season?.toString()?.padStart(2, '0')}e${item.episode.number
                ?.toString()
                ?.padStart(2, '0')} - ${item.episode.title}`;
            if ('movie' in item) return `movie |  ${item.movie.title}`;
            return undefined;
          })
          .filter(Boolean),
      ].join('\n'),
    )
    .join('\n\n');
  return sendMessage({
    type: MessageType.BadgeUpdate,
    payload: { text, title, color: Colors.white, backgroundColor: Colors.traktRedDark },
  });
};

const calendarBadge = () => sendMessage({ type: MessageType.BadgeUpdate, payload: { text: '', title: '' } });

type BadgeStoreState = {
  enableBadge: boolean;
};

const BadgeStoreConstants = {
  Store: 'settings.badge',
} as const;

export const useBadgeStore = defineStore(BadgeStoreConstants.Store, () => {
  const enableBadge = ref(false);

  const saveState = debounce(
    () =>
      storage.sync.set<BadgeStoreState>(BadgeStoreConstants.Store, {
        enableBadge: enableBadge.value,
      }),
    500,
  );

  const restoreState = async () => {
    const restored = await storage.sync.get<BadgeStoreState>(BadgeStoreConstants.Store);

    if (restored?.enableBadge !== undefined) enableBadge.value = restored.enableBadge;
  };

  const initBadgeStore = async () => {
    await restoreState();

    watch(
      enableBadge,
      async () => {
        if (!enableBadge.value) return calendarBadge();
        await sendCalendarBadge();
      },
      {
        immediate: true,
      },
    );
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
  };
});

export const useBadgeStoreRefs = () => storeToRefs(useBadgeStore());

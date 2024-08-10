import { DateUtils } from '@dvcol/common-utils/common/date';
import { computed, ref, type Ref, watch } from 'vue';

import type { TraktCalendarMovie, TraktCalendarShow } from '@dvcol/trakt-http-client/models';

import IconChevronDown from '~/components/icons/IconChevronDown.vue';
import IconChevronUp from '~/components/icons/IconChevronUp.vue';
import {
  type ListScrollItem,
  type ListScrollItemTag,
  ListScrollItemType,
  type VirtualListRef,
  type VirtualListScrollToOptions,
} from '~/models/list-scroll.model';

export type CalendarItem = (TraktCalendarShow | TraktCalendarMovie | Record<never, never>) & {
  id: ListScrollItem['id'];
  type?: ListScrollItem['type'];
  date: Date;
  tags?: ListScrollItemTag[];
};

export const CalendarPlaceholder: Partial<CalendarItem> = {
  id: 'empty',
  type: ListScrollItemType.placeholder,
} as const;

export const getPlaceholder = (date: Date) => ({ ...CalendarPlaceholder, id: `empty-${date.getTime()}`, date }) as CalendarItem;
export const getLoadingPlaceholder = (date: Date) =>
  ({ ...getPlaceholder(date), id: `loading-${date.getTime()}`, type: ListScrollItemType.loading }) as CalendarItem;

export const getEmptyWeeks = ({ startDate, loading = false, days = 14 }: { startDate: Date; loading?: boolean; days?: number }) => {
  return Array(days)
    .fill(CalendarPlaceholder)
    .map((_, index) => {
      const date = DateUtils.next(index, startDate);
      return loading ? getLoadingPlaceholder(date) : getPlaceholder(date);
    });
};

const padStartInterval = (spacedData: CalendarItem[], { item, startDate, added = 0 }: { item: CalendarItem; startDate: Date; added?: number }) => {
  let _added = added;
  // if the first item isn't the start date, add placeholders
  if (item.date.getTime() > startDate.getTime() && item.date.toLocaleDateString() !== startDate.toLocaleDateString()) {
    let currentDate: Date = startDate;
    while (item.date.toLocaleDateString() !== currentDate.toLocaleDateString()) {
      _added += spacedData.push(getPlaceholder(currentDate));
      currentDate = DateUtils.next(1, currentDate);
    }
  }
  return _added;
};

const padEndInterval = (spacedData: CalendarItem[], { item, endDate, added = 0 }: { item: CalendarItem; endDate: Date; added?: number }) => {
  let _added = added;
  // if the last item isn't one day before the end date, add placeholders
  if (item.date.getTime() < endDate.getTime() && item.date.toLocaleDateString() !== endDate.toLocaleDateString()) {
    let currentDate: Date = DateUtils.next(1, item.date);
    while (currentDate.toLocaleDateString() !== endDate.toLocaleDateString()) {
      _added += spacedData.push(getPlaceholder(currentDate));
      currentDate = DateUtils.next(1, currentDate);
    }
  }
  return _added;
};

const padBetweenInterval = (spacedData: CalendarItem[], { item, previous }: { previous: CalendarItem; item: CalendarItem }) => {
  // if the item us the same date as the previous one, no need to pad
  if (item.date.toLocaleDateString() === previous.date.toLocaleDateString()) return 0;

  // if the item is the same as the day after the previous one, no need to pad
  let nextDate: Date = DateUtils.next(1, previous.date);
  if (item.date.toLocaleDateString() === nextDate.toLocaleDateString()) return 0;

  let added = 0;
  // if the item isn't at least 1 day after the previous date, add placeholders
  while (item.date.toLocaleDateString() !== nextDate.toLocaleDateString()) {
    added += spacedData.push(getPlaceholder(nextDate));
    nextDate = DateUtils.next(1, nextDate);
  }
  return added;
};

export const spaceDate = (data: CalendarItem[], { startDate, endDate, days }: { startDate: Date; endDate: Date; days?: number }): CalendarItem[] => {
  const spacedData: CalendarItem[] = [];
  data?.forEach((item, index, array) => {
    // if we are on the first item
    if (index === 0) {
      padStartInterval(spacedData, { item, startDate });
      // If we have more than 1 item, we can return (end padding in the next iteration)
      if (array.length > 1) return spacedData.push(item);
    }

    // if we have are at least on the 2 item
    if (index && array.length > 1) padBetweenInterval(spacedData, { item, previous: array[index - 1] });

    // if we are on the last item
    if (index === array.length - 1) {
      spacedData.push(item);
      return padEndInterval(spacedData, { item, endDate });
    }
    spacedData.push(item);
  });

  // if no data in response fill with placeholders
  if (!spacedData.length) spacedData.push(...getEmptyWeeks({ startDate, days }));

  return spacedData;
};

export const useCenterButton = ({ center, list }: { center: Ref<Date>; list: Ref<ListScrollItem[]> }) => {
  const centerItem = computed(() => {
    return list.value.find(item => item.date?.current.toLocaleDateString() === center.value.toLocaleDateString());
  });

  const centerIsToday = computed(() => {
    return centerItem.value?.date?.current.toLocaleDateString() === new Date().toLocaleDateString();
  });

  const scrolledOut = ref(false);
  const scrolledDown = ref(true);
  const onScrollIntoOutOfView = (_scrolled: boolean, _itemRef?: HTMLDivElement) => {
    scrolledOut.value = _scrolled;
    if (!_scrolled || !_itemRef) return;
    scrolledDown.value = _itemRef.getBoundingClientRect().top > 0;
  };
  const recenterIcon = computed(() => (scrolledDown.value ? IconChevronDown : IconChevronUp));

  return { centerItem, centerIsToday, scrolledOut, onScrollIntoOutOfView, recenterIcon };
};

export const useCalendar = ({
  list,
  centerItem,
  fetchData,
}: {
  list: Ref<ListScrollItem[]>;
  centerItem: Ref<ListScrollItem | undefined>;
  fetchData: (mode?: 'start' | 'end' | 'reload') => Promise<unknown>;
}) => {
  const listRef = ref<{ list: VirtualListRef }>();
  const scrollTo = (options?: VirtualListScrollToOptions, index = centerItem.value?.index) => {
    if (index === undefined) return;
    if (!listRef.value?.list) return;

    listRef.value?.list.scrollTo({
      top: index * 145,
      ...options,
    });
  };

  const reload = async () => {
    const promise = fetchData();
    // watch for loading changes and recenter
    const unsub = watch(list, async () => scrollTo());
    await promise;
    scrollTo();
    unsub();
  };

  const onClick = () => scrollTo({ behavior: 'smooth' });

  const onScrollTop = async () => {
    const first = list.value[0];
    await fetchData('start');

    listRef.value?.list.scrollTo({
      top: (list.value.findIndex(item => item.id === first.id) - 1) * 145,
    });
  };

  const onScrollBottom = async () => {
    await fetchData('end');
  };
  return { listRef, onClick, onScrollTop, onScrollBottom, reload };
};

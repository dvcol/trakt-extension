import { DateUtils } from '@dvcol/common-utils/common/date';

import type { TraktCalendarMovie, TraktCalendarShow } from '@dvcol/trakt-http-client/models';

import { type ListScrollItem, type ListScrollItemTag, ListScrollItemType } from '~/models/list-scroll.model';

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

export const getEmptyWeeks = (fromDate: Date, loading?: boolean) => {
  return Array(14)
    .fill(CalendarPlaceholder)
    .map((_, index) => {
      const date = DateUtils.next(index, fromDate);
      return loading ? getLoadingPlaceholder(date) : getPlaceholder(date);
    });
};

export const spaceDate = (data: CalendarItem[], startDate: Date, endDate: Date): CalendarItem[] => {
  const spacedData: CalendarItem[] = [];
  data?.forEach((item, index) => {
    if (index === 0) {
      // if the first item isn't the start date, add placeholders
      if (item.date.getTime() > startDate.getTime() && item.date.toLocaleDateString() !== startDate.toLocaleDateString()) {
        let previousDate: Date = item.date;
        while (previousDate.toLocaleDateString() !== startDate.toLocaleDateString()) {
          previousDate = DateUtils.previous(1, previousDate);
          spacedData.push(getPlaceholder(previousDate));
        }
      }
      return spacedData.push(item);
    }

    if (index === data.length - 1) {
      spacedData.push(item);

      // if the last item isn't one day before the end date, add placeholders
      const dayBeforeEnd = DateUtils.previous(1, endDate);
      if (item.date.getTime() < dayBeforeEnd.getTime() && item.date.toLocaleDateString() !== dayBeforeEnd.toLocaleDateString()) {
        let nextDate: Date = item.date;
        while (nextDate.toLocaleDateString() !== dayBeforeEnd.toLocaleDateString()) {
          nextDate = DateUtils.next(1, nextDate);
          spacedData.push(getPlaceholder(nextDate));
        }
      }
      return;
    }

    const previous = data[index - 1];

    if (item.date.toLocaleDateString() === previous.date.toLocaleDateString()) return spacedData.push(item);
    if (item.date.toLocaleDateString() === DateUtils.next(1, previous.date).toLocaleDateString()) return spacedData.push(item);

    // if the item isn't at least 1 day after the previous date, add placeholders
    let previousDate: Date = previous.date;
    while (item.date.toLocaleDateString() !== DateUtils.next(1, previousDate).toLocaleDateString()) {
      previousDate = DateUtils.next(1, previousDate);
      spacedData.push(getPlaceholder(previousDate));
    }
    spacedData.push(item);
  });
  if (!spacedData.length) spacedData.push(...getEmptyWeeks(startDate));

  // if no data in response fill with placeholders
  return spacedData;
};

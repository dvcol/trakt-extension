import { computed } from 'vue';

import type { Ref } from 'vue';

import type { ListScrollItem, ListScrollSourceItem } from '~/components/common/list/ListScroll.model';
import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';

export type ListScrollSourceItemWithDate<T extends string> = ListScrollSourceItem & Record<T, string | number | Date>;

export const useListScroll = <T extends string>(items: Ref<ListScrollSourceItemWithDate<T>[]>, dateProp?: T) =>
  computed<ListScrollItem[]>(() => {
    const array = items.value;
    if (!array.length) return [];
    return array.map((item, index) => {
      const _item: ListScrollItem = { ...item, index, loading: typeof item.id === 'number' && item.id < 0 };

      if ('movie' in _item) _item.type = 'movie';
      else if ('episode' in _item) _item.type = 'episode';
      else if ('season' in _item) _item.type = 'season';
      else if ('show' in _item) _item.type = 'show';

      if (!dateProp || !item?.[dateProp]) return _item;

      const date: ListScrollItem['date'] = { current: new Date(item[dateProp]) };
      if (index > 1 && array[index - 1]?.[dateProp]) {
        date.previous = new Date(array[index - 1]?.[dateProp]);
      }
      if (array[index + 1]?.[dateProp]) {
        date.next = new Date(array[index + 1]?.[dateProp]);
      }
      date.sameDayAsPrevious = date.previous?.toLocaleDateString() === date.current?.toLocaleDateString();
      date.sameDayAsNext = date.next?.toLocaleDateString() === date.current?.toLocaleDateString();

      return { ..._item, date };
    });
  });

export const addLoadMore = (
  items: Ref<ListScrollItem[]>,
  pagination: Ref<TraktClientPagination | undefined>,
  search: Ref<string>,
): Ref<ListScrollItem[]> => {
  return computed(() => {
    const array = items.value;
    if (!array.length) return array;
    if (!search.value) return array;
    if (!pagination.value?.page) return array;
    if (!pagination.value?.pageCount) return array;
    if (pagination.value.page === pagination.value.pageCount) return array;
    if (array.length && array[array.length - 1].id === 'load-more') return array;
    const loadMore: ListScrollItem = { id: 'load-more', index: items.value.length };
    return [...array, loadMore];
  });
};

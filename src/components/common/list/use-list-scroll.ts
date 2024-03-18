import { computed } from 'vue';

import type { Ref } from 'vue';

import type { ListScrollItem, ListScrollSourceItem, OnScroll, OnUpdated } from '~/components/common/list/ListScroll.model';
import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';

export type ListScrollSourceItemWithDate<T extends string> = ListScrollSourceItem & Partial<Record<T, string | number | Date>>;

export const useListScroll = <D extends string, T extends ListScrollSourceItemWithDate<D>>(
  items: Ref<T[]>,
  dateFn?: D | ((item: T) => ListScrollSourceItemWithDate<D>[D]),
) =>
  computed<ListScrollItem[]>(() => {
    const array = items.value;
    if (!array.length) return [];
    return array.map((item, index) => {
      const _item: ListScrollItem = { ...item, index, loading: typeof item.id === 'number' && item.id < 0 };

      if ('movie' in _item) _item.type = 'movie';
      else if ('episode' in _item) _item.type = 'episode';
      else if ('season' in _item) _item.type = 'season';
      else if ('show' in _item) _item.type = 'show';

      if (!_item || !dateFn) return _item;
      const _date = typeof dateFn === 'function' ? dateFn(item) : item[dateFn];
      if (!_date) return _item;

      const date: ListScrollItem['date'] = { current: new Date(_date!) };
      const previous = typeof dateFn === 'function' ? dateFn(array[index - 1]) : array[index - 1]?.[dateFn];
      if (index > 0 && previous) date.previous = new Date(previous);
      const next = typeof dateFn === 'function' ? dateFn(array[index + 1]) : array[index + 1]?.[dateFn];
      if (next) date.next = new Date(next);
      date.sameDayAsPrevious = date.previous?.toLocaleDateString() === date.current?.toLocaleDateString();
      date.sameDayAsNext = date.next?.toLocaleDateString() === date.current?.toLocaleDateString();

      return { ..._item, date };
    });
  });

export const useListScrollEvents = (
  callback: (query: { page: number }) => Promise<unknown>,
  {
    data,
    pagination,
    loading,
    belowThreshold,
  }: { data: Ref<ListScrollItem[]>; pagination: Ref<TraktClientPagination | undefined>; loading: Ref<boolean>; belowThreshold: Ref<boolean> },
) => {
  const onScroll: OnScroll = async listRef => {
    const key = data.value[data.value.length - 1].id;
    await callback({
      page: pagination.value?.page ? pagination.value.page + 1 : 0,
    });
    listRef.value?.scrollTo({ key, debounce: true });
  };

  const onLoadMore = async () =>
    callback({
      page: pagination.value?.page ? pagination.value.page + 1 : 0,
    });

  /**
   * This is a workaround for the onUpdated lifecycle hook not triggering when wrapped in transition.
   */
  const onUpdated: OnUpdated = listRef => {
    const { scrollHeight, clientHeight } = listRef.value?.$el?.firstElementChild ?? {};
    if (scrollHeight !== clientHeight || !belowThreshold.value || loading.value) return;

    return onLoadMore();
  };

  return { onScroll, onUpdated, onLoadMore };
};

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

import { computed } from 'vue';

import type { Ref } from 'vue';

import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';

import type { ImageQuery } from '~/stores/data/image.store';

import {
  type ListScrollItem,
  ListScrollItemType,
  type ListScrollSourceItem,
  type OnScroll,
  type OnUpdated,
} from '~/components/common/list/ListScroll.model';

export type ListScrollSourceItemWithDate<T extends string> = ListScrollSourceItem & Partial<Record<T, string | number | Date>>;

export const getTitle = (media: ListScrollSourceItem): ListScrollItem['title'] => {
  if (!media) return;
  if (media.person) return media.person.name;
  if (media.movie) return media.movie.title;
  if (!media.episode) return media.show?.title;
  const number = media.episode.number?.toString().padStart(2, '0');
  return `${media.episode.season}x${number} - ${media.episode.title}`;
};

export const getContent = (media: ListScrollSourceItem): ListScrollItem['content'] => {
  if (!media) return;
  if (media.movie) return media.movie.year?.toString();
  if (!media.episode) return media.show?.year?.toString();
  return media.show?.title;
};

export const getType = (media: ListScrollSourceItem): ListScrollItem['type'] => {
  if (!media) return;
  if ('movie' in media) return ListScrollItemType.movie;
  if ('episode' in media) return ListScrollItemType.episode;
  if ('season' in media) return ListScrollItemType.season;
  if ('show' in media) return ListScrollItemType.show;
  if ('person' in media) return ListScrollItemType.person;
};

export const getDate = <D extends string, T extends ListScrollSourceItemWithDate<D>>(
  media: T,
  array: T[],
  index: number,
  dateFn?: D | ((item: T) => ListScrollSourceItemWithDate<D>[D]),
): ListScrollItem['date'] => {
  if (!media || !dateFn) return;
  const _date = typeof dateFn === 'function' ? dateFn(media) : media[dateFn];
  if (!_date) return;
  const date: ListScrollItem['date'] = { current: new Date(_date) };
  const previous = typeof dateFn === 'function' ? dateFn(array[index - 1]) : array[index - 1]?.[dateFn];
  if (index > 0 && previous) date.previous = new Date(previous);
  const next = typeof dateFn === 'function' ? dateFn(array[index + 1]) : array[index + 1]?.[dateFn];
  if (next) date.next = new Date(next);
  date.sameDayAsPrevious = date.previous?.toLocaleDateString() === date.current?.toLocaleDateString();
  date.sameDayAsNext = date.next?.toLocaleDateString() === date.current?.toLocaleDateString();
  return date;
};

const isMediaType = (type: ListScrollItem['type']): type is 'movie' | 'show' | 'season' | 'episode' | 'person' =>
  type === ListScrollItemType.movie ||
  type === ListScrollItemType.show ||
  type === ListScrollItemType.season ||
  type === ListScrollItemType.episode ||
  type === ListScrollItemType.person;

export const getPosterQuery =
  (item: ListScrollSourceItem, type: ListScrollItem['type']): ListScrollItem['getPosterQuery'] =>
  () => {
    if (!item || !type) return;
    if (type === ListScrollItemType.placeholder) return;
    if (!isMediaType(type)) return;
    const _type = ['show', 'episode', 'season'].includes(type) ? 'show' : type;
    const media = item[_type];
    if (!media?.ids.tmdb) return;
    return {
      type,
      id: media.ids.tmdb,
      season: item?.episode?.season ?? item.season?.number,
      episode: item?.episode?.number,
    } satisfies ImageQuery;
  };

export const useListScroll = <D extends string, T extends ListScrollSourceItemWithDate<D>>(
  items: Ref<T[]>,
  dateFn?: D | ((item: T) => ListScrollSourceItemWithDate<D>[D]),
) => {
  return computed<ListScrollItem[]>(() => {
    const array = items.value;
    if (!array.length) return [];
    return array.map((item, index) => {
      const _item: ListScrollItem = { ...item, index, loading: typeof item.id === 'number' && item.id < 0 };

      if (!_item.type) _item.type = getType(item);
      if (!_item.title) _item.title = getTitle(item);
      if (!_item.content) _item.content = getContent(item);
      if (!_item.poster && !_item.getPosterQuery) _item.getPosterQuery = getPosterQuery(item, _item.type);
      _item.date = getDate(item, array, index, dateFn);

      return _item;
    });
  });
};

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
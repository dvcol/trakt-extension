import { TraktEpisodeType, type TraktEpisodeTypes } from '@dvcol/trakt-http-client/models';

import { computed, isRef, ref, watch } from 'vue';

import type { Ref } from 'vue';

import type { ListScrollItem, ListScrollItemTag, ListScrollSourceItem, OnScroll, OnUpdated } from '~/models/list-scroll.model';

import type { StorePagination } from '~/models/pagination.model';

import { usePanelItem } from '~/components/views/panel/use-panel-item';
import { CustomLinkView, isAliasScope, isCustomLinkScope } from '~/models/link.model';
import { ListScrollItemType } from '~/models/list-scroll.model';

import { RouterService } from '~/services/router.service';
import { ResolveExternalLinks } from '~/settings/external.links';
import { type ImageQuery } from '~/stores/data/image.store';
import { resolveLinkUrl, useLinksStore } from '~/stores/settings/links.store';
import { useI18n } from '~/utils/i18n.utils';

export type ListScrollSourceItemWithDate<T extends string> = ListScrollSourceItem & Partial<Record<T, string | number | Date>>;

export const getTitle = (media: Pick<ListScrollSourceItem, 'person' | 'movie' | 'episode' | 'show'>): ListScrollItem['title'] => {
  if (!media) return;
  if (media.person) return media.person.name;
  if (media.movie) return media.movie.title;
  if (!media.episode) return media.show?.title;
  return media.episode.title;
};

export const getContent = (media: Pick<ListScrollSourceItem, 'movie' | 'episode' | 'show'>): ListScrollItem['content'] => {
  if (!media) return;
  if (media.movie) return media.movie.year?.toString();
  if (!media.episode) return media.show?.year?.toString();
  return media.show?.title;
};

export const getType = (media: ListScrollSourceItem): ListScrollItem['type'] => {
  if (!media) return;
  if ('movie' in media) return ListScrollItemType.Movie;
  if ('episode' in media) return ListScrollItemType.Episode;
  if ('season' in media) return ListScrollItemType.Season;
  if ('show' in media) return ListScrollItemType.Show;
  if ('person' in media) return ListScrollItemType.Person;
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
  if (date.current.toString() === 'Invalid Date') return;
  const previous = typeof dateFn === 'function' ? dateFn(array[index - 1]) : array[index - 1]?.[dateFn];
  if (index > 0 && previous) date.previous = new Date(previous);
  const next = typeof dateFn === 'function' ? dateFn(array[index + 1]) : array[index + 1]?.[dateFn];
  if (next) date.next = new Date(next);
  date.sameDayAsPrevious = date.previous?.toLocaleDateString() === date.current?.toLocaleDateString();
  date.sameDayAsNext = date.next?.toLocaleDateString() === date.current?.toLocaleDateString();
  return date;
};

const isMediaType = (type: ListScrollItem['type']): type is 'movie' | 'show' | 'season' | 'episode' | 'person' =>
  type === ListScrollItemType.Movie ||
  type === ListScrollItemType.Show ||
  type === ListScrollItemType.Season ||
  type === ListScrollItemType.Episode ||
  type === ListScrollItemType.Person;

export const getPosterQuery = (item: ListScrollSourceItem, type: ListScrollItem['type']): ListScrollItem['getPosterQuery'] => {
  if (!item || !type) return () => undefined;
  if (type === ListScrollItemType.Placeholder) return () => undefined;
  if (!isMediaType(type)) return () => undefined;
  const _type = ['show', 'episode', 'season'].includes(type) ? 'show' : type;
  const media = item[_type];
  if (!media?.ids.tmdb) return () => undefined;
  const query: ImageQuery = {
    type,
    id: media.ids.tmdb,
    season: item?.episode?.season ?? item.season?.number,
    episode: item?.episode?.number,
  };
  return () => query;
};

export const getProgressQuery = (item: ListScrollSourceItem): ListScrollItem['getProgressQuery'] => {
  const showId = item.show?.ids.trakt;
  if (!showId) return;
  return () => ({
    id: showId,
    noFetch: true,
  });
};

let i18n: ReturnType<typeof useI18n>;

const getI18n = () => {
  if (!i18n) i18n = useI18n('common');
  return i18n;
};

const i18nEpisode = () => getI18n()('episode', 'common', 'tag');
const i18nSeason = () => getI18n()('season', 'common', 'tag');
const openInEpisode = () => getI18n()('open_episode_in_trakt', 'common', 'tooltip');
const openInSeason = () => getI18n()('open_season_in_trakt', 'common', 'tooltip');

const getEpisodeTypeTag = (episode: ListScrollSourceItem['episode']): ListScrollItemTag | undefined => {
  if (!episode) return;
  const type = 'episode_type' in episode ? episode.episode_type : undefined;
  let premiere: TraktEpisodeTypes | null = null;
  let color: ListScrollItemTag['type'] = 'primary';
  // let finale: TraktEpisodeTypes;
  if (type === TraktEpisodeType.SeriesPremiere || (episode.season === 1 && episode.number === 1)) {
    premiere = TraktEpisodeType.SeriesPremiere;
  } else if (type === TraktEpisodeType.MidSeasonPremiere) {
    premiere = TraktEpisodeType.MidSeasonPremiere;
    color = 'info';
  } else if (type === TraktEpisodeType.SeasonPremiere || episode.number === 1) {
    premiere = TraktEpisodeType.SeasonPremiere;
  }

  if (premiere) {
    return {
      label: premiere,
      i18n: ['common', 'tag'],
      type: color,
      bordered: false,
    };
  }
  if (!type) return;

  let finale: TraktEpisodeTypes | null = null;
  if (type === TraktEpisodeType.SeriesFinale) {
    finale = TraktEpisodeType.SeriesFinale;
    color = 'error';
  } else if (type === TraktEpisodeType.MidSeasonFinale) {
    finale = TraktEpisodeType.MidSeasonFinale;
    color = 'info';
  } else if (type === TraktEpisodeType.SeasonFinale) {
    finale = TraktEpisodeType.SeasonFinale;
    color = 'error';
  }

  if (!finale) return;
  return {
    label: finale,
    i18n: ['common', 'tag'],
    type: color,
    bordered: false,
  };
};

export const getTags = (
  source: Pick<ListScrollSourceItem, 'episode' | 'season' | 'show' | 'movie'>,
  { id, type, title, meta }: Partial<ListScrollItem>,
): ListScrollItem['tags'] => {
  const tags: ListScrollItem['tags'] = [];
  if (type === 'episode' && source.episode) {
    tags.push({
      label: `${i18nSeason()} ${source.episode.season.toString().padStart(2, '0')} ${i18nEpisode()} ${source.episode.number
        .toString()
        .padStart(2, '0')}`,
      title: openInEpisode(),
      type: 'warning',
      bordered: true,
      url: ResolveExternalLinks.search({
        type: 'episode',
        source: 'trakt',
        id: source.episode.ids.trakt,
      }),
    });

    const typeTag = getEpisodeTypeTag(source.episode);
    if (typeTag) tags.push(typeTag);
  } else if (type === 'season' && source.season) {
    tags.push({
      label: `${i18nSeason()} ${source.season.number.toString().padStart(2, '0')}`,
      title: openInSeason(),
      type: 'warning',
      bordered: true,
      url: ResolveExternalLinks.search({
        type: 'season',
        source: 'trakt',
        id: source.season.ids.trakt,
      }),
    });
  }

  if (type && isCustomLinkScope(type)) {
    const { getAlias, getLinks } = useLinksStore();

    let alias: string | undefined;
    if (id && isAliasScope(type)) alias = getAlias(type, String(id));
    alias ??= source.show?.title ?? source.movie?.title;

    getLinks({ scope: type, view: CustomLinkView.List, genres: meta?.genres })?.forEach(link =>
      tags.push({
        ...link,
        url: resolveLinkUrl(link.url, {
          ...meta?.ids,
          alias,
          season: meta?.number?.season,
          episode: meta?.number?.episode,
          title,
        }),
        iconImgProps: { disabled: true },
      }),
    );
  }

  return tags;
};

const getContentLink = (item: ListScrollSourceItem): ListScrollItem['contentLink'] => {
  if (!item?.type || !item.show?.ids?.trakt) return;
  if (![ListScrollItemType.Show, ListScrollItemType.Episode].map(String).includes(item.type)) return;
  return {
    onClick: event => {
      event.preventDefault();
      event.stopPropagation();
      usePanelItem(RouterService.router).onItemClick({ type: 'show', id: item.show!.ids.trakt });
    },
  };
};

export const computeNewArray = <T extends ListScrollSourceItemWithDate<D>, D extends string | never = never>(
  array: T[],
  dateFn?: D | ((item: T) => T[D]),
): ListScrollItem[] =>
  array.map((item, index) => {
    const _item: ListScrollItem = {
      ...item,
      index,
      key: `${index}-${item.id}`,
      loading: (typeof item.id === 'number' && item.id < 0) || item.type === ListScrollItemType.Loading,
    };

    if (!_item.type) _item.type = getType(item);
    if (!_item.title) _item.title = getTitle(item);
    if (!_item.content) _item.content = getContent(item);
    if (!_item.contentLink) _item.contentLink = getContentLink(_item);
    if (!_item.posterRef) _item.posterRef = ref<string>();
    if (!_item.getPosterQuery) _item.getPosterQuery = getPosterQuery(item, _item.type);
    if (!_item.getProgressQuery) _item.getProgressQuery = getProgressQuery(item);

    _item.key = `${_item.type}-${_item.id}`;
    _item.date = getDate(item, array, index, dateFn);
    _item.meta = {
      source: item,
      ids: {
        movie: item.movie?.ids,
        show: item.show?.ids,
        season: item.season?.ids,
        episode: item.episode?.ids,
        person: item.person?.ids,
      },
      genres: item.show?.genres ?? item.movie?.genres,
    };

    if (_item.type === 'episode' || _item.type === 'season') {
      _item.meta!.number = {
        season: item.episode?.season ?? item.season?.number,
        episode: item.episode?.number,
      };
    }

    if (!_item.tags) _item.tags = getTags(item, _item);

    return _item;
  });

export const useListScroll = <T extends ListScrollSourceItemWithDate<D>, D extends string | never = never>(
  items: Ref<T[]>,
  dateFn?: D | ((item: T) => T[D]),
): Ref<ListScrollItem[]> => {
  return computed<ListScrollItem[]>(() => {
    const array = items.value;
    if (!array.length) return [];
    return computeNewArray(array, dateFn);
  });
};

export const useBufferedListScroll = <T extends ListScrollSourceItemWithDate<D>, D extends string | never = never>(
  items: Ref<T[]>,
  dateFn?: D | ((item: T) => T[D]),
  paused: Ref<boolean> = ref(false),
): {
  paused: Ref<boolean>;
  list: Ref<ListScrollItem[]>;
} => {
  const list: Ref<ListScrollItem[]> = useListScroll(items, dateFn);
  let previous: ListScrollItem[] = [];
  watch([list, paused], () => {
    if (paused.value) return;
    previous = list.value;
  });

  return {
    paused,
    list: computed<ListScrollItem[]>(() => {
      if (paused.value) return previous;
      return list.value;
    }),
  };
};

export const useListScrollEvents = (
  callback: (query: { page: number }) => Promise<unknown>,
  {
    data,
    pagination,
    loading,
    belowThreshold,
    active,
  }: {
    data: Ref<ListScrollItem[]>;
    pagination: Ref<StorePagination>;
    loading: Ref<boolean>;
    belowThreshold?: Ref<boolean>;
    active?: Ref<boolean>;
  },
) => {
  const onScroll: OnScroll = async listRef => {
    const _listRef = isRef(listRef) ? listRef.value : listRef;
    const { key } = data.value[data.value.length - 1];
    await callback({
      page: pagination.value?.page ? pagination.value.page + 1 : 0,
    });
    _listRef?.scrollTo({ key, debounce: true });
  };

  const onLoadMore = async () =>
    callback({
      page: pagination.value?.page ? pagination.value.page + 1 : 0,
    });

  /**
   * This is a workaround for the onUpdated lifecycle hook not triggering when wrapped in transition.
   * It fires when the list is updated and checks if the list is scrolled to the bottom to trigger the next page load.
   */
  const onUpdated: OnUpdated = listRef => {
    const _listRef = isRef(listRef) ? listRef.value : listRef;
    const { scrollHeight, clientHeight } = _listRef?.$el?.firstElementChild ?? {};
    // If  already loading we don't trigger
    if (loading.value) return;
    // If the list is not scrolled to the bottom we don't trigger
    if (scrollHeight !== clientHeight) return;
    // If the list is not below the threshold we don't trigger
    if (belowThreshold?.value === false) return;
    // If the view is not currently active we don't trigger
    if (active?.value === false) return;

    return onLoadMore();
  };

  return { onScroll, onUpdated, onLoadMore };
};

export const addAllLoaded = (items: Ref<ListScrollItem[]>, pagination: Ref<StorePagination>) => {
  return computed(() => {
    const array = items.value;
    if (!array.length) return array;
    const { page, pageCount } = pagination.value ?? {};
    if (page && pageCount && page < pageCount) return array;
    // If the last item is already an all loaded item we return the array as is
    if (array[array.length - 1].type === ListScrollItemType.AllLoaded) return array;
    const type = ListScrollItemType.AllLoaded;
    const index = items.value.length;
    // All loaded should be unique so id and key are based on the type
    const allLoaded: ListScrollItem = { id: type, type, index, key: type };
    return [...array, allLoaded];
  });
};

export const addLoadMore = (items: Ref<ListScrollItem[]>, pagination: Ref<StorePagination>, search: Ref<string>): Ref<ListScrollItem[]> => {
  return computed(() => {
    const array = items.value;
    if (!array.length) return array;
    // If there is no search value we add the all loaded item or return the array as is
    if (!search.value) return addAllLoaded(items, pagination).value;
    const { page, pageCount } = pagination.value ?? {};
    // If we are on the last page or an un-paginated view we add the all loaded item or return the array as is
    if (!page || !pageCount || page === pageCount) return addAllLoaded(items, pagination).value;
    // If the last item is already a load more item we return the array as is
    if (array[array.length - 1].type === ListScrollItemType.LoadMore) return array;
    const type = ListScrollItemType.LoadMore;
    const index = items.value.length;
    // Load more should be unique so id and key are based on the type
    const loadMore: ListScrollItem = { id: type, type, index, key: type };
    return [...array, loadMore];
  });
};

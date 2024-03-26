import type { NVirtualList, TagProps, VirtualListInst } from 'naive-ui';

import type { Ref } from 'vue';
import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktList } from '~/models/trakt/trakt-list.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktPerson } from '~/models/trakt/trakt-people.model';
import type { BaseTraktProgress, BaseTraktProgressEpisode, BaseTraktProgressSeason } from '~/models/trakt/trakt-progress.model';
import type { TraktSeason } from '~/models/trakt/trakt-season.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';
import type { ImageQuery, ImageStoreMedias } from '~/stores/data/image.store';

export type VirtualListRef = VirtualListInst & InstanceType<typeof NVirtualList>;
export type VirtualListProps = {
  itemSize?: number;
  visibleItemsTag?: string | ObjectConstructor;
  visibleItemsProps?: ObjectConstructor;
  paddingTop?: string | number;
  paddingBottom?: string | number;
};
export type VirtualListScrollToOptions = Parameters<VirtualListInst['scrollTo']>[0];

export type OnScroll = (listRef: Ref<VirtualListRef | undefined>) => void;
export type OnUpdated = (listRef: Ref<VirtualListRef | undefined>) => void;

export type ListScrollSourceItem = {
  id: string | number;
  type?: ListScrollItem['type'];

  movie?: TraktMovie<'short'>;
  show?: TraktShow<'short'>;
  season?: TraktSeason<'short'>;
  episode?: TraktEpisode<'short'>;
  person?: TraktPerson<'short'>;
  list?: TraktList<'short'>;
};

export type ListScrollItemTag = {
  label: string;
  i18n?: boolean | string[];
  meta?: string;
  url?: string;
} & TagProps;

export type ListScrollItemProgressEpisode = BaseTraktProgressEpisode & {
  date: Date;
};

export type ListScrollItemProgressSeason = BaseTraktProgressSeason & {
  episodes: ListScrollItemProgressEpisode[];
};

export const ListScrollItemProgressType = {
  collection: 'collection',
  watched: 'watched',
} as const;

export type ListScrollItemProgress = BaseTraktProgress & {
  id: string | number;
  type: (typeof ListScrollItemProgressType)[keyof typeof ListScrollItemProgressType];
  date: Date;
  seasons: ListScrollItemProgressSeason[];
  percentage: number;
  completed: number;
  total: number;
};

export const ListScrollItemType = {
  movie: 'movie',
  show: 'show',
  season: 'season',
  episode: 'episode',
  person: 'person',
  list: 'list',
  loading: 'loading',
  loadMore: 'load-more',
  placeholder: 'placeholder',
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- meta is intentionally weakly typed
export type ListScrollItem<T = Record<string, any>> = {
  id: string | number;
  index: number;

  type?: (typeof ListScrollItemType)[keyof typeof ListScrollItemType];
  title?: string;
  content?: string;
  tags?: ListScrollItemTag[];

  progress?: ListScrollItemProgress;
  progressRef?: Ref<ListScrollItemProgress | undefined>;
  getProgressQuery?: () => string | number | undefined;

  poster?: string;
  posterRef?: Ref<ImageStoreMedias | undefined>;
  getPosterQuery?: () => ImageQuery | undefined;

  meta?: T;

  loading?: boolean;
  date?: {
    previous?: Date;
    current: Date;
    next?: Date;
    sameDayAsPrevious?: boolean;
    sameDayAsNext?: boolean;
  };
};

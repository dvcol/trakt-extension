import type { BaseCacheOption } from '@dvcol/base-http-client';
import type { NVirtualList, VirtualListInst } from 'naive-ui';

import type { Ref } from 'vue';
import type { PosterItem } from '~/models/poster.model';
import type { TagLink } from '~/models/tag.model';
import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktList } from '~/models/trakt/trakt-list.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktPerson } from '~/models/trakt/trakt-people.model';
import type { BaseTraktProgress, BaseTraktProgressEpisode, BaseTraktProgressSeason } from '~/models/trakt/trakt-progress.model';
import type { TraktSeason } from '~/models/trakt/trakt-season.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';

export type VirtualListRef = VirtualListInst & InstanceType<typeof NVirtualList>;
export type ScrollTo = Parameters<VirtualListInst['scrollTo']>[0];
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
  i18n?: boolean | string[];
} & TagLink;

export type EpisodeProgress = BaseTraktProgressEpisode & {
  date: Date;
};

export type SeasonProgress = BaseTraktProgressSeason & {
  episodes: EpisodeProgress[];
  percentage: number;
  finished: boolean;
};

export const ShowProgressType = {
  Collection: 'collection',
  Watched: 'watched',
} as const;

export type ShowProgressTypes = (typeof ShowProgressType)[keyof typeof ShowProgressType];

export type ShowProgress = BaseTraktProgress & {
  id: string | number;
  type: ShowProgressTypes;
  date: Date;
  seasons: SeasonProgress[];
  percentage: number;
  finished: boolean;
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
export type ListScrollItem<T = Record<string, any>> = Omit<PosterItem, 'type'> & {
  id: string | number;
  index: number;
  key: string;

  type?: (typeof ListScrollItemType)[keyof typeof ListScrollItemType];
  title?: string;
  content?: string;
  tags?: ListScrollItemTag[];

  progress?: ShowProgress;
  progressRef?: Ref<ShowProgress | undefined>;
  getProgressQuery?: () => { id: string | number | undefined; cacheOptions?: BaseCacheOption };

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

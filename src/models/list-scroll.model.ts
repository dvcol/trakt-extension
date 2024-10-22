import type { BaseCacheOption } from '@dvcol/base-http-client';
import type {
  BaseTraktProgress,
  BaseTraktProgressEpisode,
  BaseTraktProgressSeason,
  TraktApiIds,
  TraktEpisode,
  TraktList,
  TraktMovie,
  TraktPerson,
  TraktSeason,
  TraktShow,
} from '@dvcol/trakt-http-client/models';
import type { NVirtualList, VirtualListInst } from 'naive-ui';
import type { Ref } from 'vue';
import type { CustomLink } from '~/models/link.model';
import type { PosterItem } from '~/models/poster.model';
import type { ProgressItem } from '~/models/progress.model';
import type { TagLink } from '~/models/tag.model';

export type VirtualListRef = VirtualListInst & InstanceType<typeof NVirtualList>;
export type ScrollTo = Parameters<VirtualListInst['scrollTo']>[0];
export type VirtualListProps = {
  itemSize?: number;
  visibleItemsTag?: string | ObjectConstructor;
  visibleItemsProps?: ObjectConstructor;
  paddingTop?: number;
  paddingBottom?: number;
};
export type VirtualListScrollToOptions = Parameters<VirtualListInst['scrollTo']>[0];

export type OnScroll = (listRef: Ref<VirtualListRef | undefined> | VirtualListRef) => void;
export type OnUpdated = (listRef: Ref<VirtualListRef | undefined> | VirtualListRef) => void;

export type ListScrollSourceItem = {
  id: string | number;
  type?: ListScrollItem['type'];

  movie?: TraktMovie<'any'>;
  show?: TraktShow<'any'>;
  season?: TraktSeason<'short'>;
  episode?: TraktEpisode<'any'>;
  person?: TraktPerson<'short'>;
  list?: TraktList<'short'>;
};

export type ListScrollItemTag = {
  i18n?: boolean | string[];
} & (TagLink & Partial<CustomLink>);

export type EpisodeProgress = BaseTraktProgressEpisode & {
  date?: Date;
};

export type SeasonProgress = BaseTraktProgressSeason & {
  episodes: EpisodeProgress[];
  date?: Date;
  percentage: number;
  finished: boolean;
};

export const isSeasonProgress = (_progress?: ShowProgress | SeasonProgress | EpisodeProgress): _progress is SeasonProgress => {
  return !!_progress && 'episodes' in _progress;
};

export const ShowProgressType = {
  Collection: 'collection',
  Watched: 'watched',
} as const;

export type ShowProgressTypes = (typeof ShowProgressType)[keyof typeof ShowProgressType];

export type ShowProgress = BaseTraktProgress & {
  id: string | number;
  type: ShowProgressTypes;
  date?: Date;
  seasons: SeasonProgress[];
  percentage: number;
  finished: boolean;
  lastAired?: SeasonProgress;
};

export const ListScrollItemType = {
  Movie: 'movie',
  Show: 'show',
  Season: 'season',
  Episode: 'episode',
  Person: 'person',
  List: 'list',
  Loading: 'loading',
  LoadMore: 'load-more',
  AllLoaded: 'all-loaded',
  Placeholder: 'placeholder',
} as const;

export type ListScrollItemTypes = (typeof ListScrollItemType)[keyof typeof ListScrollItemType];

export type ListScrollItemMeta<T = { [key: string]: unknown }> = {
  source: ListScrollSourceItem | ProgressItem;
  ids: {
    movie?: Partial<TraktMovie['ids']>;
    show?: Partial<TraktShow['ids']>;
    season?: Partial<TraktSeason['ids']>;
    episode?: Partial<TraktEpisode['ids']>;
    person?: Partial<TraktPerson['ids']>;
    [key: string]: Partial<TraktApiIds> | undefined;
  };
  genres?: string[];
  number?: {
    season?: number;
    episode?: number;
  };
} & T;

export type AnchorLinkUrl = {
  href?: string;
  label?: string;
  onClick?: (event: MouseEvent, link: Omit<AnchorLinkUrl, 'onClick'>) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- meta is intentionally weakly typed
export type ListScrollItem<T extends Record<string, any> = ListScrollItemMeta> = Omit<PosterItem, 'type'> & {
  id: string | number;
  index: number;
  key: string;

  type?: ListScrollItemTypes;
  typeLink?: AnchorLinkUrl;
  title?: string;
  titleLink?: AnchorLinkUrl;
  content?: string;
  contentLink?: AnchorLinkUrl;
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

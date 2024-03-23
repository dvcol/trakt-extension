import type { NVirtualList, TagProps, VirtualListInst } from 'naive-ui';

import type { Ref } from 'vue';
import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktList } from '~/models/trakt/trakt-list.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktPerson } from '~/models/trakt/trakt-people.model';
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
  type?: TagProps['type'];
  bordered?: boolean;
  meta?: string;
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

export type ListScrollItem = {
  id: string | number;
  index: number;

  type?: (typeof ListScrollItemType)[keyof typeof ListScrollItemType];
  title?: string;
  content?: string;
  tags?: ListScrollItemTag[];

  poster?: Ref<ImageStoreMedias | undefined>;
  getPosterQuery?: () => ImageQuery | undefined;

  meta?: Record<string, unknown>;

  loading?: boolean;
  date?: {
    previous?: Date;
    current: Date;
    next?: Date;
    sameDayAsPrevious?: boolean;
    sameDayAsNext?: boolean;
  };
};

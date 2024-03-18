import type { NVirtualList, VirtualListInst } from 'naive-ui';
import type { Ref } from 'vue';
import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktSeason } from '~/models/trakt/trakt-season.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';

export type VirtualListRef = VirtualListInst & InstanceType<typeof NVirtualList>;
export type VirtualListProps = {
  itemSize?: number;
  visibleItemsTag?: string | ObjectConstructor;
  visibleItemsProps?: ObjectConstructor;
  paddingTop?: string | number;
  paddingBottom?: string | number;
};

export type OnScroll = (listRef: Ref<VirtualListRef | undefined>) => void;
export type OnUpdated = (listRef: Ref<VirtualListRef | undefined>) => void;

export type ListScrollSourceItem = {
  id: string | number;

  movie?: TraktMovie<'short'>;
  show?: TraktShow<'short'>;
  season?: TraktSeason<'short'>;
  episode?: TraktEpisode<'short'>;
};

export type ListScrollItem = ListScrollSourceItem & {
  id: string | number | 'load-more';
  index: number;

  type?: 'movie' | 'show' | 'season' | 'episode';

  poster?: Ref<string | undefined>;

  loading?: boolean;
  date?: {
    previous?: Date;
    current: Date;
    next?: Date;
    sameDayAsPrevious?: boolean;
    sameDayAsNext?: boolean;
  };
};

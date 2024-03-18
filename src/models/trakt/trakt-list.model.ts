import type { TraktApiExtended, TraktApiParamsExtended, TraktApiParamsPagination } from '~/models/trakt/trakt-client.model';
import type { Any } from '~/models/trakt/trakt-entity.model';
import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktApiIds } from '~/models/trakt/trakt-id.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktPerson } from '~/models/trakt/trakt-people.model';
import type { TraktSeason } from '~/models/trakt/trakt-season.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';
import type { TraktUser } from '~/models/trakt/trakt-user.model';
import type { RequireAtLeastOne } from '~/utils/typescript.utils';

export type TraktList<T extends string | 'watchlist' | 'favorites' | 'personal' = string> = {
  name: string;
  description: string;
  privacy: 'private' | 'friends' | 'public' | 'link';
  share_link: string;
  display_numbers: boolean;
  allow_comments: boolean;
  sort_by:
    | 'rank'
    | 'added'
    | 'title'
    | 'released'
    | 'runtime'
    | 'popularity'
    | 'percentage'
    | 'votes'
    | 'my_rating'
    | 'random'
    | 'watched'
    | 'collected';
  sort_how: 'asc' | 'desc';
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  created_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  item_count: number;
  comment_count: number;
  likes: number;
  ids: Pick<TraktApiIds, 'trakt' | 'slug'>;
  user: TraktUser;
} & (T extends 'watchlist'
  ? { type: 'watchlist' }
  : T extends 'favorites'
    ? { type: 'favorites' }
    : T extends 'personal'
      ? { type: 'personal' }
      : { type: T });

export type TraktListList = {
  like_count: number;
  comment_count: number;
  list: TraktList;
};

export type BaseTraktListItem = {
  rank: number;
  id: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  listed_at: string;
  notes: string;
  type: 'movie' | 'show' | 'season' | 'episode' | 'person';
};

export type BaseTraktListMedia = {
  movie: TraktMovie;
  show: TraktShow;
  season: TraktSeason;
  episode: TraktEpisode;
  person: TraktPerson;
};

export type TraktListItem<T extends Any | 'movie' | 'show' | 'season' | 'episode' | 'person' = Any> = BaseTraktListItem &
  (T extends 'movie'
    ? Pick<BaseTraktListMedia, 'movie'> & { type: 'movie' }
    : T extends 'show'
      ? Pick<BaseTraktListMedia, 'show'> & { type: 'show' }
      : T extends 'season'
        ? Pick<BaseTraktListMedia, 'season' | 'show'> & { type: 'season' }
        : T extends 'episode'
          ? Pick<BaseTraktListMedia, 'episode' | 'show'> & { type: 'episode' }
          : T extends 'list'
            ? Pick<BaseTraktListMedia, 'person'> & { type: 'person' }
            : Partial<BaseTraktListMedia>);

export type BaseTraktUserListItemMedia = {
  movie: Partial<TraktMovie> & Pick<TraktMovie, 'ids'>;
  show: Partial<TraktShow> & Pick<TraktShow, 'ids'> & { seasons?: Pick<TraktSeason, 'number'> & { episodes?: Pick<TraktEpisode, 'number'>[] } };
  season: Partial<TraktSeason> & Pick<TraktSeason, 'ids'>;
  episode: Partial<TraktEpisode> & Pick<TraktEpisode, 'ids'>;
  person: Partial<TraktPerson> & Pick<TraktPerson, 'ids'>;
};

export type TraktUserListItem<T extends Any | 'movie' | 'show' | 'season' | 'episode' | 'person' = Any> = T extends 'movie'
  ? Pick<BaseTraktUserListItemMedia, 'movie'>
  : T extends 'show'
    ? Pick<BaseTraktUserListItemMedia, 'show'>
    : T extends 'season'
      ? Pick<BaseTraktUserListItemMedia, 'season'>
      : T extends 'episode'
        ? Pick<BaseTraktUserListItemMedia, 'episode'>
        : T extends 'person'
          ? Pick<BaseTraktUserListItemMedia, 'person'>
          : RequireAtLeastOne<BaseTraktUserListItemMedia>;

export type TraktUserListItemRequest = {
  movies: { notes?: string } & TraktUserListItem<'movie'>[];
  shows: { notes?: string } & TraktUserListItem<'show'>[];
  seasons: { notes?: string } & TraktUserListItem<'season'>[];
  episodes: { notes?: string } & TraktUserListItem<'episode'>[];
  people: { notes?: string } & TraktUserListItem<'person'>[];
};

export type TraktUserListItemAdded = {
  added: {
    movies: number;
    shows: number;
    seasons: number;
    episodes: number;
    people: number;
  };
  existing: {
    movies: number;
    shows: number;
    seasons: number;
    episodes: number;
    people: number;
  };
  not_found: {
    movies: Pick<TraktMovie, 'ids'>[];
    shows: Pick<TraktShow, 'ids'>[];
    seasons: Pick<TraktSeason, 'ids'>[];
    episodes: Pick<TraktEpisode, 'ids'>[];
    people: Pick<TraktPerson, 'ids'>[];
  };
  list: {
    /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
    updated_at: string;
    item_count: number;
  };
};

export type TraktUserListItemRemoveRequest = {
  movies: TraktUserListItem<'movie'>[];
  shows: TraktUserListItem<'show'>[];
  seasons: TraktUserListItem<'season'>[];
  episodes: TraktUserListItem<'episode'>[];
  people: TraktUserListItem<'person'>[];
};

export type TraktUserListItemRemoved = {
  deleted: {
    movies: number;
    shows: number;
    seasons: number;
    episodes: number;
    people: number;
  };
  not_found: {
    movies: Pick<TraktMovie, 'ids'>[];
    shows: Pick<TraktShow, 'ids'>[];
    seasons: Pick<TraktSeason, 'ids'>[];
    episodes: Pick<TraktEpisode, 'ids'>[];
    people: Pick<TraktPerson, 'ids'>[];
  };
  list: {
    /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
    updated_at: string;
    item_count: number;
  };
};

export type TraktListReordered = {
  updated: number;
  skipped_ids: number[];
  list: {
    /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
    updated_at: string;
    item_count: number;
  };
};

export type TraktListItemsGetQuery = {
  /** User slug */
  id: string;
  /** List Trakt ID or Trakt slug */
  list_id: string;
  /** Type of list items */
  type?: ('movies' | 'shows' | 'seasons' | 'episodes' | 'person') | ('movies' | 'shows' | 'seasons' | 'episodes' | 'person')[];
} & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
  TraktApiParamsPagination;

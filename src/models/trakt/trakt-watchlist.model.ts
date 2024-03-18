import type { TraktApiExtended, TraktApiParamsExtended, TraktApiParamsPagination } from '~/models/trakt/trakt-client.model';
import type { Any, EntityTypes } from '~/models/trakt/trakt-entity.model';
import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktList } from '~/models/trakt/trakt-list.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktSeason } from '~/models/trakt/trakt-season.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';

type BaseTraktWatchlistItem<E extends EntityTypes = Any> = {
  movie: TraktMovie<E>;
  show: TraktShow<E>;
  season: TraktSeason<E>;
  episode: TraktEpisode<E>;
};

type TraktWatchlistItem<T extends 'movie' | 'show' | 'season' | 'episode' | Any = Any, E extends EntityTypes = Any> = {
  type: T extends Any ? 'movie' | 'show' | 'season' | 'episode' : T;
} & (T extends 'movie'
  ? Pick<BaseTraktWatchlistItem<E>, 'movie'>
  : T extends 'show'
    ? Pick<BaseTraktWatchlistItem<E>, 'show'>
    : T extends 'season'
      ? Pick<BaseTraktWatchlistItem<E>, 'season' | 'show'>
      : T extends 'episode'
        ? Pick<BaseTraktWatchlistItem<E>, 'episode' | 'show'>
        :
            | Pick<BaseTraktWatchlistItem<E>, 'movie'>
            | Pick<BaseTraktWatchlistItem<E>, 'show'>
            | Pick<BaseTraktWatchlistItem<E>, 'season' | 'show'>
            | Pick<BaseTraktWatchlistItem<E>, 'episode' | 'show'>);

export type TraktWatchlist<T extends 'movie' | 'show' | 'season' | 'episode' | Any = Any, E extends EntityTypes = Any> = {
  rank: number;
  id: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  listed_at: string;
  notes: string;
} & TraktWatchlistItem<T, E>;

export type TraktWatchlistList = TraktList<'watchlist'>;

export type TraktWatchlistAdded = {
  added: {
    movies: number;
    shows: number;
    seasons: number;
    episodes: number;
  };
  existing: {
    movies: number;
    shows: number;
    seasons: number;
    episodes: number;
  };
  not_found: {
    movies: Pick<TraktMovie, 'ids'>[];
    shows: Pick<TraktShow, 'ids'>[];
    seasons: Pick<TraktSeason, 'ids'>[];
    episodes: Pick<TraktEpisode, 'ids'>[];
  };
  list: {
    /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
    updated_at: string;
    item_count: number;
  };
};

export type TraktWatchlistRemoved = {
  deleted: {
    movies: number;
    shows: number;
    seasons: number;
    episodes: number;
  };
  not_found: {
    movies: Pick<TraktMovie, 'ids'>[];
    shows: Pick<TraktShow, 'ids'>[];
    seasons: Pick<TraktSeason, 'ids'>[];
    episodes: Pick<TraktEpisode, 'ids'>[];
  };
  list: {
    /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
    updated_at: string;
    item_count: number;
  };
};

export type TraktWatchlistGetQuery = {
  /** Filter for a specific item type */
  type?: 'movies' | 'shows' | 'seasons' | 'episodes';
  /** How to sort (only if type is also sent) */
  sort?: 'rank' | 'added' | 'released' | 'title';
} & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
  TraktApiParamsPagination;

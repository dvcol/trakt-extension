import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktList } from '~/models/trakt-list.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktSeason } from '~/models/trakt-season.model';
import type { TraktShow } from '~/models/trakt-show.model';

type BaseTraktWatchlistItem<E extends 'extended' | 'short' | 'any' = 'any'> = {
  movie: TraktMovie<E>;
  show: TraktShow<E>;
  season: TraktSeason<E>;
  episode: TraktEpisode<E>;
};

type TraktWatchlistItem<T extends 'movie' | 'show' | 'season' | 'episode' | 'any' = 'any', E extends 'extended' | 'short' | 'any' = 'any'> = {
  type: T extends 'any' ? 'movie' | 'show' | 'season' | 'episode' : T;
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

export type TraktWatchlist<T extends 'movie' | 'show' | 'season' | 'episode' | 'any' = 'any', E extends 'extended' | 'short' | 'any' = 'any'> = {
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

import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktList } from '~/models/trakt-list.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktSeason } from '~/models/trakt-season.model';
import type { TraktShow } from '~/models/trakt-show.model';

type TraktSyncWatchlistItem<
  T extends 'movie' | 'show' | 'season' | 'episode' | 'any' = 'any',
  E extends 'extended' | 'short' | 'any' = 'any',
> = T extends 'movie'
  ? { type: 'movie'; movie: TraktMovie<E> }
  : T extends 'show'
    ? { type: 'show'; show: TraktShow<E> }
    : T extends 'season'
      ? { type: 'season'; season: TraktSeason<E>; show: TraktShow<E> }
      : T extends 'episode'
        ? { type: 'episode'; episode: TraktEpisode<E>; show: TraktShow<E> }
        : { type: 'movie' | 'show' | 'season' | 'episode' } & (
            | { movie: TraktMovie<E> }
            | { show: TraktShow<E> }
            | { season: TraktSeason<E>; show: TraktShow<E> }
            | { episode: TraktEpisode<E>; show: TraktShow<E> }
          );

export type TraktSyncWatchlist<T extends 'movie' | 'show' | 'season' | 'episode' | 'any' = 'any', E extends 'extended' | 'short' | 'any' = 'any'> = {
  rank: number;
  id: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  listed_at: string;
  notes: string;
} & TraktSyncWatchlistItem<T, E>;

export type TraktWatchlist = TraktList<'watchlist'>;

export type TraktSyncWatchlistAdded = {
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

export type TraktSyncWatchlistRemoved = {
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

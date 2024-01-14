import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktSeason } from '~/models/trakt-season.model';
import type { TraktShow } from '~/models/trakt-show.model';
import type { BaseSyncRequestItem } from '~/models/trakt-sync.model';

type TraktSyncRatingItem<
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

export type TraktSyncRating<T extends 'movie' | 'show' | 'season' | 'episode' | 'any' = 'any', E extends 'extended' | 'short' | 'any' = 'any'> = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  rated_at: string;
  rating: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
} & TraktSyncRatingItem<T, E>;

export type TraktSyncRatingRequestItem<T extends 'movies' | 'shows' | 'seasons' | 'episodes' | 'any' = 'any'> = {
  /**
   * UTC datetime when the item was rated. - Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ)
   */
  rated_at?: string;
  /** Rating between 1 and 10. */
  rating: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
} & BaseSyncRequestItem<T>;

export type TraktSyncRatingRequest = {
  movies?: TraktSyncRatingRequestItem<'movies'>[];
  shows?: TraktSyncRatingRequestItem<'shows'>[];
  seasons?: TraktSyncRatingRequestItem<'seasons'>[];
  episodes?: TraktSyncRatingRequestItem<'episodes'>[];
};

export type TraktSyncRatingAdded = {
  added: {
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
};

export type TraktSyncRatingRemoved = {
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
};

import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktSeason } from '~/models/trakt/trakt-season.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';
import type { BaseSyncRequestItem } from '~/models/trakt/trakt-sync.model';

type BaseTraktRatingItem<E extends 'extended' | 'short' | 'any' = 'any'> = {
  movie: TraktMovie<E>;
  show: TraktShow<E>;
  season: TraktSeason<E>;
  episode: TraktEpisode<E>;
};

type TraktRatingItem<T extends 'movie' | 'show' | 'season' | 'episode' | 'any' = 'any', E extends 'extended' | 'short' | 'any' = 'any'> = {
  type: T extends 'any' ? 'movie' | 'show' | 'season' | 'episode' : T;
} & (T extends 'movie'
  ? Pick<BaseTraktRatingItem<E>, 'movie'>
  : T extends 'show'
    ? Pick<BaseTraktRatingItem<E>, 'show'>
    : T extends 'season'
      ? Pick<BaseTraktRatingItem<E>, 'season' | 'show'>
      : T extends 'episode'
        ? Pick<BaseTraktRatingItem<E>, 'episode' | 'show'>
        :
            | Pick<BaseTraktRatingItem<E>, 'movie'>
            | Pick<BaseTraktRatingItem<E>, 'show'>
            | Pick<BaseTraktRatingItem<E>, 'season' | 'show'>
            | Pick<BaseTraktRatingItem<E>, 'episode' | 'show'>);

export type TraktRating<T extends 'movie' | 'show' | 'season' | 'episode' | 'any' = 'any', E extends 'extended' | 'short' | 'any' = 'any'> = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  rated_at: string;
  rating: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
} & TraktRatingItem<T, E>;

export type TraktRatingRequestItem<T extends 'movies' | 'shows' | 'seasons' | 'episodes' | 'any' = 'any'> = {
  /**
   * UTC datetime when the item was rated. - Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ)
   */
  rated_at?: string;
  /** Rating between 1 and 10. */
  rating: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
} & BaseSyncRequestItem<T>;

export type TraktRatingRequest = {
  movies?: TraktRatingRequestItem<'movies'>[];
  shows?: TraktRatingRequestItem<'shows'>[];
  seasons?: TraktRatingRequestItem<'seasons'>[];
  episodes?: TraktRatingRequestItem<'episodes'>[];
};

export type TraktRatingAdded = {
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

export type TraktRatingRemoved = {
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

import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktShow } from '~/models/trakt-show.model';

export type TraktSyncWatchedEpisode = {
  number: number;
  plays: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  last_watched_at: string;
};

export type TraktSyncWatchedSeason = {
  number: number;
  episodes: TraktSyncWatchedEpisode[];
};

export type TraktSyncWatchedShow<N extends 'no-seasons' | 'short' | 'any' = 'any'> = N extends 'no-seasons'
  ? { show: TraktShow }
  : { show: TraktShow; seasons: TraktSyncWatchedSeason[] };

export type TraktSyncWatched<T extends 'movie' | 'show' | 'any' = 'any', N extends 'no-seasons' | 'short' | 'any' = 'any'> = {
  plays: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  last_watched_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  last_updated_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  reset_at?: string;
} & T extends 'movie'
  ? { movie: TraktMovie }
  : T extends 'show'
    ? TraktSyncWatchedShow<N>
    : { movie: TraktMovie } | TraktSyncWatchedShow<N>;

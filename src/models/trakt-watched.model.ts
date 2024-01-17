import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktShow } from '~/models/trakt-show.model';

export type TraktWatchedEpisode = {
  number: number;
  plays: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  last_watched_at: string;
};

export type TraktWatchedSeason = {
  number: number;
  episodes: TraktWatchedEpisode[];
};

export type TraktWatchedShow<N extends 'no-seasons' | 'short' | 'any' = 'any'> = N extends 'no-seasons'
  ? { show: TraktShow }
  : { show: TraktShow; seasons: TraktWatchedSeason[] };

export type TraktWatched<T extends 'movie' | 'show' | 'any' = 'any', N extends 'no-seasons' | 'short' | 'any' = 'any'> = {
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
    ? TraktWatchedShow<N>
    : { movie: TraktMovie } | TraktWatchedShow<N>;

export type TraktWatching<T extends 'movie' | 'show' | 'any' = 'any'> = {
  expires_at: string;
  started_at: string;
  action: 'scrobble';
  type: T extends 'any' ? 'movie' | 'show' : T;
} & (T extends 'movie'
  ? { movie: TraktMovie }
  : T extends 'show'
    ? { episode: TraktEpisode; show: TraktShow }
    : { movie: TraktMovie } | { episode: TraktEpisode; show: TraktShow });

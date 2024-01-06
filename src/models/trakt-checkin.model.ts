import type { TraktSharing } from '~/models/trakt-entity.model';
import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktShow } from '~/models/trakt-show.model';

type BaseTraktCheckin = {
  movie: TraktMovie;
  episode: TraktEpisode;
  show: TraktShow;
};

export type TypedTraktCheckin<T extends 'any' | 'movie' | 'show' | 'episode'> = T extends 'movie'
  ? Pick<BaseTraktCheckin, 'movie'>
  : T extends 'show'
    ? Pick<BaseTraktCheckin, 'show'>
    : T extends 'episode'
      ? Pick<BaseTraktCheckin, 'episode'>
      : Partial<BaseTraktCheckin>;

export type TraktCheckin<T extends 'any' | 'movie' | 'show' | 'episode' = 'any'> = {
  id: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  watched_at: string;
  sharing: TraktSharing;
} & TypedTraktCheckin<T>;

/**
 * Error when there is already a checkin in progress. (code 409)
 */
export type TraktCheckedError = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  expires_at: '2014-10-15T22:21:29.000Z';
};

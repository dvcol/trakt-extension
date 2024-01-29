import type { TraktSharing, Any } from '~/models/trakt/trakt-entity.model';
import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';

type BaseTraktCheckin = {
  movie: TraktMovie;
  episode: TraktEpisode;
  show: TraktShow;
};

export type TypedTraktCheckin<T extends Any | 'movie' | 'show' | 'episode'> = T extends 'movie'
  ? Pick<BaseTraktCheckin, 'movie'>
  : T extends 'show'
    ? Pick<BaseTraktCheckin, 'show'>
    : T extends 'episode'
      ? Pick<BaseTraktCheckin, 'episode'>
      : Partial<BaseTraktCheckin>;

export type TraktCheckin<T extends Any | 'movie' | 'show' | 'episode' = Any> = {
  id: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  watched_at: string;
  sharing: TraktSharing;
} & TypedTraktCheckin<T>;

/**
 * Error when there is already a checkin in progress. (code 409)
 */
export type TraktCheckinError = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  expires_at: '2014-10-15T22:21:29.000Z';
};

type TraktCheckinRequestMovie = {
  /** Movie to be checked-in */
  movie: TraktMovie;
};

type TraktCheckinRequestShow = {
  /** Show to be checked-in */
  show: TraktShow;
  /** Episode to be checked-in. If no traktv ids is provided, either episode's season & number or number_abs is required */
  episode: Partial<TraktEpisode> & (Pick<TraktEpisode, 'season' | 'number'> | { number_abs: number });
};

type TraktCheckinRequestEpisode = {
  /** Episode to be checked-in. If no show is provided, traktv ids are required */
  episode: Partial<TraktEpisode> & Pick<TraktEpisode, 'ids'>;
};

type TraktCheckinRequestItem<T extends 'movie' | 'show' | 'episode' | Any = Any> = T extends 'movie'
  ? TraktCheckinRequestMovie
  : T extends 'show'
    ? TraktCheckinRequestShow
    : T extends 'episode'
      ? TraktCheckinRequestEpisode
      : TraktCheckinRequestMovie | TraktCheckinRequestEpisode | TraktCheckinRequestShow;

export type TraktCheckinRequest<T extends 'movie' | 'show' | 'episode' | Any = Any> = {
  /**
   * Control sharing to any connected social networks.
   *
   * The sharing object is optional and will apply the user's settings if not sent.
   * If sharing is sent, each key will override the user's setting for that social network.
   * Send true to post or false to not post on the indicated social network.
   * You can see which social networks a user has connected with the [/users/settings]{@link https://trakt.docs.apiary.io/reference/users/settings} method.
   *
   * Note: If a checkin is already in progress, a 409 HTTP status code will returned. The response will contain an expires_at timestamp which is when the user can check in again.
   */
  sharing?: TraktSharing;
  /** Message used for sharing. If not sent, it will use the watching string in the user settings. */
  message?: string;
} & TraktCheckinRequestItem<T>;

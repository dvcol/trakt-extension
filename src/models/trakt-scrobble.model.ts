import type { TraktSharing } from '~/models/trakt-entity.model';
import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktShow } from '~/models/trakt-show.model';

type TraktScrobbleRequestMovie = {
  /** Movie to be checked-in */
  movie: TraktMovie;
};

type TraktScrobbleRequestShow = {
  /** Show to be checked-in */
  show: TraktShow;
  /** Episode to be checked-in. If no traktv ids is provided, either episode's season & number or number_abs is required */
  episode: Partial<TraktEpisode> & (Pick<TraktEpisode, 'season' | 'number'> | { number_abs: number });
};

type TraktScrobbleRequestEpisode = {
  /** Episode to be checked-in. If no show is provided, traktv ids are required */
  episode: Partial<TraktEpisode> & Pick<TraktEpisode, 'ids'>;
};

type TraktScrobbleRequestItem<T extends 'movie' | 'show' | 'episode' | 'any' = 'any'> = T extends 'movie'
  ? TraktScrobbleRequestMovie
  : T extends 'show'
    ? TraktScrobbleRequestShow
    : T extends 'episode'
      ? TraktScrobbleRequestEpisode
      : TraktScrobbleRequestMovie | TraktScrobbleRequestShow | TraktScrobbleRequestEpisode;

export type TraktScrobbleRequest<T extends 'movie' | 'show' | 'episode' | 'any' = 'any'> = {
  /** Progress percentage between 0 and 100. */
  progress: number;
} & TraktScrobbleRequestItem<T>;

type TraktScrobbleItem<T extends 'movie' | 'episode' | 'any' = 'any'> = T extends 'movie'
  ? { movie: TraktMovie }
  : T extends 'episode'
    ? { show: TraktShow; episode: TraktEpisode }
    : { movie: TraktMovie } | { show: TraktShow; episode: TraktEpisode };

type TraktScrobbleAction<A extends 'start' | 'pause' | 'stop' | 'any' = 'any'> = A extends 'start'
  ? { action: 'start' }
  : A extends 'pause'
    ? { action: 'pause' }
    : A extends 'stop'
      ? { action: 'scrobble' | 'pause' }
      : { action: 'start' | 'pause' | 'scrobble' };

export type TraktScrobble<A extends 'start' | 'pause' | 'stop' | 'any' = 'any', I extends 'movie' | 'episode' | 'any' = 'any'> = {
  id: number;
  progress: number;
  sharing: TraktSharing;
} & TraktScrobbleAction<A> &
  TraktScrobbleItem<I>;

export type TraktScrobbleError = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  watched_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  expires_at: string;
};

import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktSeason } from '~/models/trakt/trakt-season.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';
import type { BaseSyncRequestItem } from '~/models/trakt/trakt-sync.model';

export type TraktCollectionMetadata = {
  media_type: 'digital' | 'bluray' | 'hddvd' | 'dvd' | 'vcd' | 'vhs' | 'betamax' | 'laserdisc';
  resolution: 'uhd_4k' | 'hd_1080p' | 'hd_1080i' | 'hd_720p' | 'sd_480p' | 'sd_480i' | 'sd_576p' | 'sd_576i';
  hdr: 'dolby_vision' | 'hdr10' | 'hdr10_plus' | 'hlg';
  audio:
    | 'dolby_digital'
    | 'dolby_digital_plus'
    | 'dolby_digital_plus_atmos'
    | 'dolby_truehd'
    | 'dolby_atmos'
    | 'dolby_prologic'
    | 'dts'
    | 'dts_ma'
    | 'dts_hr'
    | 'dts_x'
    | 'auro_3d'
    | 'mp3'
    | 'mp2'
    | 'aac'
    | 'lpcm'
    | 'ogg'
    | 'ogg_opus'
    | 'wma'
    | 'flac';
  audio_channels:
    | '1.0'
    | '2.0'
    | '2.1'
    | '3.0'
    | '3.1'
    | '4.0'
    | '4.1'
    | '5.0'
    | '5.1'
    | '5.1.2'
    | '5.1.4'
    | '6.1'
    | '7.1'
    | '7.1.2'
    | '7.1.4'
    | '9.1'
    | '10.1';
  '3d': boolean;
};

export type TraktCollectionEpisode<M extends 'metadata' | 'short' | 'any' = 'any'> = {
  number: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  collected_at: string;
} & (M extends 'metadata'
  ? { metadata: TraktCollectionMetadata }
  : M extends 'short'
    ? Record<string, never>
    : { metadata?: TraktCollectionMetadata });

export type TraktCollectionSeason<M extends 'metadata' | 'short' | 'any' = 'any'> = {
  number: number;
  episodes: TraktCollectionEpisode<M>[];
};

type TraktCollectionShow<M extends 'metadata' | 'short' | 'any' = 'any', E extends 'extended' | 'short' | 'any' = 'any'> = {
  last_collected_at: string;
  last_updated_at: string;
  show: TraktShow<E>;
  seasons: TraktCollectionSeason<M>[];
};

type TraktCollectionMovie<M extends 'metadata' | 'short' | 'any' = 'any', E extends 'extended' | 'short' | 'any' = 'any'> = {
  collected_at: string;
  updated_at: string;
  movie: TraktMovie<E>;
} & (M extends 'metadata'
  ? { metadata: TraktCollectionMetadata }
  : M extends 'short'
    ? Record<string, never>
    : { metadata?: TraktCollectionMetadata });

export type TraktCollection<
  T extends 'movie' | 'show' | 'any' = 'any',
  M extends 'metadata' | 'short' | 'any' = 'any',
  E extends 'extended' | 'short' | 'any' = 'any',
> = T extends 'movie'
  ? TraktCollectionMovie<M, E>
  : T extends 'show'
    ? TraktCollectionShow<M, E>
    : TraktCollectionMovie<M, E> | TraktCollectionShow<M, E>;

export type TraktCollectionRequestItem<
  T extends 'movies' | 'shows' | 'seasons' | 'episodes' | 'any' = 'any',
  M extends 'metadata' | 'short' = 'short',
> = {
  /**
   * UTC datetime when the item was collected. - Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ)
   * Set to released to automatically use the inital release date + runtime (episodes only)).
   */
  collected_at?: string;
} & (M extends 'metadata' ? Partial<TraktCollectionMetadata> & BaseSyncRequestItem<T> : BaseSyncRequestItem<T>);

export type TraktCollectionRequest<T extends 'metadata' | 'short' = 'short'> = {
  movies?: TraktCollectionRequestItem<'movies', T>[];
  shows?: TraktCollectionRequestItem<'shows', T>[];
  seasons?: TraktCollectionRequestItem<'seasons', T>[];
  episodes?: TraktCollectionRequestItem<'episodes', T>[];
};

export type TraktCollectionAdded = {
  added: {
    movies: number;
    episodes: number;
  };
  updated: {
    movies: number;
    episodes: number;
  };
  existing: {
    movies: number;
    episodes: number;
  };
  not_found: {
    movies: Pick<TraktMovie, 'ids'>[];
    shows: Pick<TraktShow, 'ids'>[];
    seasons: Pick<TraktSeason, 'ids'>[];
    episodes: Pick<TraktEpisode, 'ids'>[];
  };
};

export type TraktCollectionRemoved = {
  deleted: {
    movies: number;
    episodes: number;
  };
  not_found: {
    movies: Pick<TraktMovie, 'ids'>[];
    shows: Pick<TraktShow, 'ids'>[];
    seasons: Pick<TraktSeason, 'ids'>[];
    episodes: Pick<TraktEpisode, 'ids'>[];
  };
};

import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktSeason } from '~/models/trakt-season.model';
import type { TraktShow } from '~/models/trakt-show.model';
import type { BaseSyncRequestItem } from '~/models/trakt-sync.model';

export type TraktSyncCollectionMetadata = {
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

export type TraktSyncCollectionEpisode<M extends 'metadata' | 'short' | 'any' = 'any'> = {
  number: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  collected_at: string;
} & (M extends 'metadata'
  ? { metadata: TraktSyncCollectionMetadata }
  : M extends 'short'
    ? Record<string, never>
    : { metadata?: TraktSyncCollectionMetadata });

export type TraktSyncCollectionSeason<M extends 'metadata' | 'short' | 'any' = 'any'> = {
  number: number;
  episodes: TraktSyncCollectionEpisode<M>[];
};

type TraktSyncCollectionShow<M extends 'metadata' | 'short' | 'any' = 'any'> = {
  last_collected_at: string;
  last_updated_at: string;
  show: TraktShow;
  seasons: TraktSyncCollectionSeason<M>[];
};

type TraktSyncCollectionMovie<M extends 'metadata' | 'short' | 'any' = 'any'> = {
  collected_at: string;
  updated_at: string;
  movie: TraktMovie;
} & (M extends 'metadata'
  ? { metadata: TraktSyncCollectionMetadata }
  : M extends 'short'
    ? Record<string, never>
    : { metadata?: TraktSyncCollectionMetadata });

export type TraktSyncCollection<T extends 'movie' | 'show' | 'any' = 'any', M extends 'metadata' | 'short' | 'any' = 'any'> = T extends 'movie'
  ? TraktSyncCollectionMovie<M>
  : T extends 'show'
    ? TraktSyncCollectionShow<M>
    : TraktSyncCollectionMovie<M> | TraktSyncCollectionShow<M>;

export type TraktSyncCollectionRequestItem<
  T extends 'movies' | 'shows' | 'seasons' | 'episodes' | 'any' = 'any',
  M extends 'metadata' | 'short' = 'short',
> = {
  /**
   * UTC datetime when the item was collected. - Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ)
   * Set to released to automatically use the inital release date + runtime (episodes only)).
   */
  collected_at?: string;
} & (M extends 'metadata' ? Partial<TraktSyncCollectionMetadata> & BaseSyncRequestItem<T> : BaseSyncRequestItem<T>);

export type TraktSyncCollectionRequest<T extends 'metadata' | 'short' = 'short'> = {
  movies?: TraktSyncCollectionRequestItem<'movies', T>[];
  shows?: TraktSyncCollectionRequestItem<'shows', T>[];
  seasons?: TraktSyncCollectionRequestItem<'seasons', T>[];
  episodes?: TraktSyncCollectionRequestItem<'episodes', T>[];
};

export type TraktSyncCollectionAdded = {
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

export type TraktSyncCollectionRemoved = {
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

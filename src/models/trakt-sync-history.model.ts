import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktSeason } from '~/models/trakt-season.model';
import type { TraktShow } from '~/models/trakt-show.model';
import type { BaseSyncRequestItem, TraktSyncRequest } from '~/models/trakt-sync.model';

type TraktSyncHistoryItem<T extends 'movie' | 'episode' | 'any' = 'any', E extends 'extended' | 'short' | 'any' = 'any'> = T extends 'movie'
  ? { type: 'movie'; movie: TraktMovie<E> }
  : T extends 'episode'
    ? { type: 'episode'; episode: TraktEpisode<E>; show: TraktShow<E> }
    : {
        type: 'movie' | 'episode';
      } & ({ movie: TraktMovie<E> } | { episode: TraktEpisode<E>; show: TraktShow<E> });

export type TraktSyncHistory<T extends 'movie' | 'episode' | 'any' = 'any', E extends 'extended' | 'short' | 'any' = 'any'> = {
  id: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  watched_at: string;
  action: 'scrobble' | 'checkin' | 'watch';
} & TraktSyncHistoryItem<T, E>;

export type TraktSyncHistoryRequestItem<T extends 'movies' | 'shows' | 'seasons' | 'episodes' | 'any' = 'any'> = {
  /**
   * UTC datetime when the item was watched. - Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ)
   * Set to released to automatically use the inital release date + runtime (episodes only)).
   */
  watched_at?: string;
} & BaseSyncRequestItem<T>;

export type TraktSyncHistoryRequest = {
  movies?: TraktSyncHistoryRequestItem<'movies'>[];
  shows?: TraktSyncHistoryRequestItem<'shows'>[];
  seasons?: TraktSyncHistoryRequestItem<'seasons'>[];
  episodes?: TraktSyncHistoryRequestItem<'episodes'>[];
};

export type TraktSyncHistoryAdded = {
  added: {
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

export type TraktSyncHistoryRemovedRequest = TraktSyncRequest & {
  /** Array of history ids. */
  ids: number[];
};

export type TraktSynHistoryRemoved = {
  deleted: {
    movies: number;
    episodes: number;
  };
  not_found: {
    movies: Pick<TraktMovie, 'ids'>[];
    shows: Pick<TraktShow, 'ids'>[];
    seasons: Pick<TraktSeason, 'ids'>[];
    episodes: Pick<TraktEpisode, 'ids'>[];
    ids: number[];
  };
};

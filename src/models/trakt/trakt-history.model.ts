import type { Any, EntityTypes } from '~/models/trakt/trakt-entity.model';
import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktSeason } from '~/models/trakt/trakt-season.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';
import type { BaseSyncRequestItem, TraktSyncRequest } from '~/models/trakt/trakt-sync.model';

type TraktHistoryItem<T extends 'movie' | 'episode' | Any = Any, E extends EntityTypes = Any> = {
  type: T extends Any ? 'movie' | 'episode' : T;
} & (T extends 'movie'
  ? { movie: TraktMovie<E> }
  : T extends 'episode'
    ? { episode: TraktEpisode<E>; show: TraktShow<E> }
    : { movie: TraktMovie<E> } | { episode: TraktEpisode<E>; show: TraktShow<E> });

export type TraktHistory<T extends 'movie' | 'episode' | Any = Any, E extends EntityTypes = Any> = {
  id: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  watched_at: string;
  action: 'scrobble' | 'checkin' | 'watch';
} & TraktHistoryItem<T, E>;

export type TraktHistoryRequestItem<T extends 'movies' | 'shows' | 'seasons' | 'episodes' | Any = Any> = {
  /**
   * UTC datetime when the item was watched. - Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ)
   * Set to released to automatically use the inital release date + runtime (episodes only)).
   */
  watched_at?: string;
} & BaseSyncRequestItem<T>;

export type TraktHistoryRequest = {
  movies?: TraktHistoryRequestItem<'movies'>[];
  shows?: TraktHistoryRequestItem<'shows'>[];
  seasons?: TraktHistoryRequestItem<'seasons'>[];
  episodes?: TraktHistoryRequestItem<'episodes'>[];
};

export type TraktHistoryAdded = {
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

export type TraktHistoryRemovedRequest = TraktSyncRequest & {
  /** Array of history ids. */
  ids: number[];
};

export type TraktHistoryRemoved = {
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

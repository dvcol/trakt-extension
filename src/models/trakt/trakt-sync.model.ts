import type { Any } from '~/models/trakt/trakt-entity.model';
import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktSeason } from '~/models/trakt/trakt-season.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';

export type TraktSyncActivity = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  watched_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  collected_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  rated_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  watchlisted_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  favorited_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  commented_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  paused_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  hidden_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  liked_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  blocked_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  settings_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  followed_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  following_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  pending_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  requested_at: string;
};

export type TraktSyncActivities = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  all: string;
  movies: Pick<
    TraktSyncActivity,
    'watched_at' | 'collected_at' | 'rated_at' | 'watchlisted_at' | 'favorited_at' | 'commented_at' | 'paused_at' | 'hidden_at'
  >;
  episodes: Pick<TraktSyncActivity, 'watched_at' | 'collected_at' | 'rated_at' | 'watchlisted_at' | 'commented_at' | 'paused_at'>;
  shows: Pick<TraktSyncActivity, 'rated_at' | 'watchlisted_at' | 'favorited_at' | 'commented_at' | 'hidden_at'>;
  seasons: Pick<TraktSyncActivity, 'rated_at' | 'watchlisted_at' | 'commented_at' | 'hidden_at'>;
  comments: Pick<TraktSyncActivity, 'liked_at' | 'blocked_at'>;
  lists: Pick<TraktSyncActivity, 'liked_at' | 'updated_at' | 'commented_at'>;
  watchlist: Pick<TraktSyncActivity, 'updated_at'>;
  favorites: Pick<TraktSyncActivity, 'updated_at'>;
  account: Pick<TraktSyncActivity, 'settings_at' | 'followed_at' | 'following_at' | 'pending_at' | 'requested_at'>;
  saved_filters: Pick<TraktSyncActivity, 'updated_at'>;
  noted: Pick<TraktSyncActivity, 'updated_at'>;
};

export type TraktSyncProgress<T extends 'movie' | 'episode' | Any = Any> = {
  progress: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  paused_at: number;
  id: number;
} & { type: T extends Any ? 'movie' | 'episode' : T } & (T extends 'movie'
    ? { movie: TraktMovie }
    : T extends 'episode'
      ? { episode: TraktEpisode; show: TraktShow }
      : { movie: TraktMovie } | { episode: TraktEpisode; show: TraktShow });

export type BaseSyncRequestItem<T extends 'movies' | 'shows' | 'seasons' | 'episodes' | Any = Any> = T extends 'movies'
  ? Partial<TraktMovie> & Pick<TraktMovie, 'ids'>
  : T extends 'shows'
    ? Partial<TraktShow> & Pick<TraktShow, 'ids'> & { seasons?: Pick<TraktSeason, 'number'> & Partial<TraktSeason<'episodes'>>[] }
    : T extends 'seasons'
      ? Partial<TraktSeason> & Pick<TraktSeason, 'ids'>
      : T extends 'episodes'
        ? Partial<TraktEpisode> & Pick<TraktEpisode, 'ids'>
        :
            | (Partial<TraktMovie> & Pick<TraktMovie, 'ids'>)
            | (Partial<TraktShow> & { seasons?: Pick<TraktSeason, 'number'> & Partial<TraktSeason<'episodes'>>[] })
            | (Partial<TraktSeason> & Pick<TraktSeason, 'ids'>)
            | (Partial<TraktEpisode> & Pick<TraktEpisode, 'ids'>);

export type TraktSyncRequest = {
  movies?: BaseSyncRequestItem<'movies'>[];
  shows?: BaseSyncRequestItem<'shows'>[];
  seasons?: BaseSyncRequestItem<'seasons'>[];
  episodes?: BaseSyncRequestItem<'episodes'>[];
};

export type TraktSyncUpdateRequest = {
  description?: string;
  sort_by?:
    | 'rank'
    | 'added'
    | 'title'
    | 'released'
    | 'runtime'
    | 'popularity'
    | 'percentage'
    | 'votes'
    | 'my_rating'
    | 'random'
    | 'watched'
    | 'collected';
  sort_how?: 'asc' | 'desc';
};

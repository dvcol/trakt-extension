import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktSeason } from '~/models/trakt/trakt-season.model';

type BaseTraktProgressEpisode = {
  number: number;
  completed: boolean;
};

export type TraktCollectionProgressEpisode = BaseTraktProgressEpisode & {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  collected_at: string;
};

type BaseTraktProgressSeason = {
  number: number;
  title: string;
  aired: number;
  completed: number;
};

export type TraktCollectionProgressSeason = BaseTraktProgressSeason & {
  episodes: TraktCollectionProgressEpisode[];
};

type BaseTraktProgress = {
  aired: number;
  completed: number;
  hidden_seasons: TraktSeason[];
  next_episode: TraktEpisode;
  last_episode: TraktEpisode;
};

export type TraktCollectionProgress = BaseTraktProgress & {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  last_collected_at: string;
  seasons: TraktCollectionProgressSeason[];
};

export type TraktWatchedProgressEpisode = BaseTraktProgressEpisode & {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  collected_at: string;
};

export type TraktWatchedProgressSeason = BaseTraktProgressSeason & {
  episodes: TraktWatchedProgressEpisode[];
};

export type TraktWatchedProgress = BaseTraktProgress & {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  last_watched_at: string;
  reset_at: string;
  seasons: TraktWatchedProgressSeason[];
};

export type TraktProgressReset = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  reset_at: string;
};

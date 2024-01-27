import type { TraktApiIds } from '~/models/trakt/trakt-id.model';
import type { TraktCast } from '~/models/trakt/trakt-people.model';

export const TraktShowStatus = {
  /** Airing right now */
  ReturningSeries: 'returning series',
  /** Airing right now */
  Continuing: 'continuing',
  /** Airing soon */
  InProduction: 'in production',
  /** In development */
  Planned: 'planned',
  /** In development */
  Upcoming: 'upcoming',
  Pilot: 'pilot',
  Canceled: 'canceled',
  Ended: 'ended',
};

export type TraktShowStatuses = (typeof TraktShowStatus)[keyof typeof TraktShowStatus];
export const TraktShowStatusValues = Object.values(TraktShowStatus);

export type TraktShowShort = {
  title: string;
  year: number;
  ids: Pick<TraktApiIds, 'trakt' | 'slug' | 'imdb' | 'tvdb' | 'tmdb'>;
};

export type TraktShowExtended = TraktShowShort & {
  tagline: string;
  overview: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  first_aired: string;
  airs: {
    day: string;
    time: string;
    timezone: string;
  };
  /** In minutes */
  runtime: number;
  certification: string;
  network: string;
  /** 2 character country code (ISO 3166-1 alpha-2) */
  country: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  trailer: string;
  homepage: string;
  status: TraktShowStatuses;
  rating: number;
  votes: number;
  comment_count: number;
  /** 2 character language code. (ISO 639-1) */
  language: string;
  /** Array of 2 character language code. (ISO 639-1) */
  available_translations: string[];
  genres: string[];
  aired_episodes: number;
};

export type TraktShow<T extends 'extended' | 'short' | 'any' = 'short'> = T extends 'extended'
  ? TraktShowExtended
  : T extends 'short'
    ? TraktShowShort
    : TraktShowShort & Partial<TraktShowExtended>;

export type TraktShowCast = TraktCast<'any', 'episodes', 'any'>;

export type TraktShowTrending<T extends 'extended' | 'short' | 'any' = 'any'> = {
  watchers: number;
  show: TraktShow<T>;
};

export type TraktShowFavorited<T extends 'extended' | 'short' | 'any' = 'any'> = {
  user_count: number;
  show: TraktShow<T>;
};

export type TraktShowPlayed<T extends 'extended' | 'short' | 'any' = 'any'> = {
  watcher_count: number;
  play_count: number;
  collected_count: number;
  show: TraktShow<T>;
};

export type TraktShowAnticipated<T extends 'extended' | 'short' | 'any' = 'any'> = {
  list_count: number;
  show: TraktShow<T>;
};

export type TraktShowUpdate<T extends 'extended' | 'short' | 'any' = 'any'> = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  show: TraktShow<T>;
};

export type TraktShowCertification = {
  certification: string;
  /** 2 character country code (ISO 3166-1 alpha-2) */
  country: string;
};

export type TraktShowStats = {
  watchers: number;
  plays: number;
  collectors: number;
  collected_episodes: number;
  comments: number;
  lists: number;
  votes: number;
  favorited: number;
};
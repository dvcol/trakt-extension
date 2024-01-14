import type { TraktApiIds } from '~/models/trakt-id.model';
import type { TraktCast } from '~/models/trakt-people.model';

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

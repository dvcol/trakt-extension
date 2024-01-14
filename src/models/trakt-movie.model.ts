import type { TraktApiIds } from '~/models/trakt-id.model';
import type { TraktCast } from '~/models/trakt-people.model';

export type TraktMovieShort = {
  title: string;
  year: number;
  ids: Pick<TraktApiIds, 'trakt' | 'slug' | 'imdb' | 'tmdb'>;
};

export type TraktMovieExtended = TraktMovieShort & {
  tagline: string;
  overview: string;
  /** Calendar Date in ISO 8601 format (YYYY-MM-DD) */
  released: string;
  /** In minutes */
  runtime: number;
  /** 2 character country code (ISO 3166-1 alpha-2) */
  country: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  trailer: string;
  homepage: string;
  status: 'released' | 'in production' | 'post production' | 'planned' | 'rumored' | 'canceled';
  rating: number;
  votes: number;
  comment_count: number;
  /** 2 character language code. (ISO 639-1) */
  language: string;
  /** Array of 2 character language code. (ISO 639-1) */
  available_translations: string[];
  genres: string[];
  certification: string;
};

export type TraktMovie<T extends 'extended' | 'short' | 'any' = 'short'> = T extends 'extended'
  ? TraktMovieExtended
  : T extends 'short'
    ? TraktMovieShort
    : TraktMovieShort & Partial<TraktMovieExtended>;

export type TraktMovieTrending<T extends 'extended' | 'short' | 'any' = 'any'> = {
  watchers: number;
  movie: TraktMovie<T>;
};

export type TraktMovieFavorited<T extends 'extended' | 'short' | 'any' = 'any'> = {
  user_count: number;
  movie: TraktMovie<T>;
};

export type TraktMoviePlayed<T extends 'extended' | 'short' | 'any' = 'any'> = {
  watcher_count: number;
  play_count: number;
  collected_count: number;
  movie: TraktMovie<T>;
};

export type TraktMovieAnticipated<T extends 'extended' | 'short' | 'any' = 'any'> = {
  list_count: number;
  movie: TraktMovie<T>;
};

export type TraktMovieBoxOffice<T extends 'extended' | 'short' | 'any' = 'any'> = {
  revenue: number;
  movie: TraktMovie<T>;
};

export type TraktMovieUpdate<T extends 'extended' | 'short' | 'any' = 'any'> = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  movie: TraktMovie<T>;
};

export type TraktMovieRelease = {
  /** 2 character country code (ISO 3166-1 alpha-2) */
  country: string;
  certification: string;
  release_date: string;
  release_type: 'unknown' | 'premiere' | 'limited' | 'theatrical' | 'digital' | 'physical' | 'tv';
  note: string;
};

export type TraktMovieCast = TraktCast<'short', 'short', 'any'>;

export type TraktMovieStats = {
  watchers: number;
  plays: number;
  collectors: number;
  comments: number;
  lists: number;
  votes: number;
  favorited: number;
};

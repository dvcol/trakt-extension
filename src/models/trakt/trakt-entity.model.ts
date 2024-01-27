import type { TraktApiTemplate } from '~/models/trakt/trakt-client.model';
import type { TraktApiIds } from '~/models/trakt/trakt-id.model';
import type { RequireAtLeastOne } from '~/utils/typescript.utils';

import { TraktApiTransforms } from '~/services/trakt-client/api/trakt-api.transforms';
import { TraktApiValidators } from '~/services/trakt-client/api/trakt-api.validators';

export type TraktSharing = RequireAtLeastOne<{
  twitter: boolean;
  mastodon: boolean;
  tumblr: boolean;
}>;

type TraktBaseSlugEntity = {
  name: string;
  slug: string;
};

export type TraktGenre = TraktBaseSlugEntity;
export type TraktCertification = TraktBaseSlugEntity & {
  description: string;
};

type TraktBaseCodeEntity = {
  name: string;
  code: string;
};

export type TraktCountry = TraktBaseCodeEntity;
export type TraktLanguage = TraktBaseCodeEntity;

export type TraktNetwork = {
  name: string;
  /** 2 character country code (ISO 3166-1 alpha-2) */
  country: string;
  ids: Pick<TraktApiIds, 'trakt' | 'tmdb'>;
};

export type TraktAlias = {
  title: string;
  /** 2 character country code (ISO 3166-1 alpha-2) */
  country: string;
};

export type TraktTranslation = {
  title: string;
  overview: string;
  tagline: string;
  /** 2 character language code (ISO 639-1) */
  language: string;
  /** 2 character country code (ISO 3166-1 alpha-2) */
  country: string;
};

export type TraktRating = {
  rating: number;
  votes: number;
  distribution: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10, number>;
};

export type TraktStudio = {
  name: string;
  /** 2 character country code (ISO 3166-1 alpha-2) */
  country: string;
  ids: Pick<TraktApiIds, 'trakt' | 'slug' | 'tmdb'>;
};

export type StartDateParam = {
  /**
   * Updated since this date and time.
   * Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ)
   *
   * * <b>Important</b>
   *
   * The start_date is only accurate to the hour, for caching purposes. Please drop the minutes and seconds from your timestamp to help optimize our cached data.
   * For example, use 2021-07-17T12:00:00Z and not 2021-07-17T12:23:34Z.
   */
  start_date?: string;
};

export const validateStartDate: TraktApiTemplate<StartDateParam>['validate'] = param => {
  if (param.start_date) TraktApiValidators.date(param.start_date);
  return true;
};

export const transformStartDate: TraktApiTemplate<StartDateParam>['transform'] = param => {
  if (param.start_date) return { ...param, start_date: TraktApiTransforms.date.dropMinutes(param.start_date) };
  return param;
};

import type { RequireAtLeastOne } from '~/utils/typescript.utils';

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
  country: string;
  ids: {
    trakt: number;
    tmdb: number;
  };
};

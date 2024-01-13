import type { TraktApiIds } from '~/models/trakt-id.model';

export type TraktPrivateUser = {
  username: string;
  private: boolean;
  ids: Pick<TraktApiIds, 'slug'>;
};

export type TraktPublicUser = TraktPrivateUser & {
  name: string;
  vip: boolean;
  vip_ep: boolean;
};

export type TraktUserExtended = TraktPublicUser & {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  joined_at: string;
  /** 2 character location code. */
  location: string;
  about: string;
  gender: string;
  age: number;
  images: {
    avatar: {
      full: string;
    };
  };
};

export type TraktUserVip = TraktPublicUser & {
  vi_og: boolean;
  vip_years: number;
  vip_cover_image: string;
};

export type TraktUser<T extends 'extended' | 'vip' | 'private' | 'public' | 'any' = 'public'> = T extends 'extended'
  ? TraktUserExtended
  : T extends 'vip'
    ? TraktUserVip
    : T extends 'private'
      ? TraktPrivateUser
      : T extends 'public'
        ? TraktPublicUser
        : TraktPublicUser & Partial<TraktUserExtended & TraktUserVip>;

import type { RequireAtLeastOne } from '~/utils/typescript.utils';

export type TraktMovie = {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    imdb: string;
    tmdb: number;
  };
};

export type TraktShow = {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    tvdb: number;
    imdb: string;
    tmdb: number;
  };
};

export type TraktSeason = {
  number: number;
  ids: {
    trakt: number;
    tvdb: number;
    tmdb: number;
  };
};

export type TraktEpisode = {
  season: number;
  number: number;
  number_abs: number;
  title: string;
  ids: {
    trakt: number;
    tvdb: number;
    imdb: string;
    tmdb: number;
  };
};

export type TraktPerson = {
  name: string;
  ids: {
    trakt: number;
    slug: string;
    imdb: string;
    tmdb: number;
  };
};

export type TraktUser = {
  username: string;
  private: boolean;
  name: string;
  vip: boolean;
  vip_ep: boolean;
  ids: {
    slug: string;
  };
};

export type TraktList = {
  name: string;
  description: string;
  privacy: string;
  share_link: string;
  type: string;
  display_numbers: boolean;
  allow_comments: boolean;
  sort_by: string;
  sort_how: string;
  created_at: string;
  updated_at: string;
  item_count: number;
  comment_count: number;
  likes: number;
  ids: {
    trakt: number;
    slug: string;
  };
  user: TraktUser;
};

export type TraktSharing = RequireAtLeastOne<{
  twitter: boolean;
  mastodon: boolean;
  tumblr: boolean;
}>;

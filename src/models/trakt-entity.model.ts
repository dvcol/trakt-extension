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
  number_abs?: number;
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

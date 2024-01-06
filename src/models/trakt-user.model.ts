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

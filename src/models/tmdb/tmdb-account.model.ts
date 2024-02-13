export type TmdbAccountAvatar = {
  gravatar: {
    hash: string;
  };
  tmdb: {
    avatar_path: string;
  };
};

export type TmdbAccount = {
  id: number;
  name: string;
  username: string;
  include_adult: boolean;
  /** The ISO 3166-1 code of the country */
  iso_3166_1: string;
  /** The ISO 639-1 code of the language */
  iso_639_1: string;
  avatar: TmdbAccountAvatar;
};

export type TmdbAccountStatus = {
  id: number;
  favorite: boolean;
  rated?:
    | false
    | {
        value: number;
      };
  watchlist: boolean;
};

export type TmdbAccountEpisodeStatus = {
  id: number;
  episode_number: number;
  rated:
    | false
    | {
        value: number;
      };
};

export type TmdbAccountSeasonStatus = {
  id: number;
  results: TmdbAccountEpisodeStatus[];
};

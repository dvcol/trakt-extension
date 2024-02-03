export type TmdbCreditSeason = {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  show_id: number;
};

export type TmdbCreditPerson = {
  adult: boolean;
  id: number;
  name: string;
  original_name: string;
  media_type: string;
  popularity: number;
  gender: number;
  known_for_department: string;
  profile_path: string;
};

export type TmdbCreditEpisode = {
  id: number;
  name: string;
  overview: string;
  media_type: string;
  vote_average: number;
  vote_count: number;
  /** Air date of the episode (YYYY-MM-DD) */
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
};

export type TmdbCreditMedia = {
  adult: boolean;
  backdrop_path: string;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string;
  media_type: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
  character: string;
  episodes: TmdbCreditEpisode[];
  seasons: TmdbCreditSeason[];
};

export type TmdbCredit = {
  credit_type: string;
  department: string;
  job: string;
  media: TmdbCreditMedia;
  media_type: string;
  id: string;
  person: TmdbCreditPerson;
};

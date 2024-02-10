import type {
  EntityTypes,
  Extended,
  Short,
  TmdbAccountRating,
  TmdbCountry,
  TmdbGenre,
  TmdbLanguage,
  TmdbNetwork,
} from '~/models/tmdb/tmdb-entity.model';
import type { TmdbEpisode } from '~/models/tmdb/tmdb-episode.model';
import type { TmdbSeason } from '~/models/tmdb/tmdb-season.model';
import type { TmdbCompanyModel } from '~/models/tmdb/tmdb.company.model';

export type TmdbPersonShow = {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
};

export type TmdbShowShort = {
  media_type?: 'tv';
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  /** First air date of the show (YYYY-MM-DD) */
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
};

export type TmdbShowExtended = TmdbShowShort & {
  created_by: TmdbPersonShow[];
  episode_run_time: number[];
  genres: TmdbGenre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air?: TmdbEpisode & { show_id: number };
  next_episode_to_air?: TmdbEpisode & { show_id: number };
  networks: TmdbNetwork[];
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: TmdbCompanyModel[];
  production_countries: TmdbCountry[];
  seasons: TmdbSeason[];
  spoken_languages: TmdbLanguage[];
  status: string;
  tagline: string;
  type: string;
};

export type TmdbShow<T extends EntityTypes = Short> = T extends Extended
  ? TmdbShowExtended
  : T extends Short
    ? TmdbShowShort
    : TmdbShowShort | TmdbShowExtended;

export type TmdbShowRating = TmdbShowShort & {
  account_rating: TmdbAccountRating;
};
export type TmdbShowGuestRating = TmdbShowShort & {
  rating: number;
};

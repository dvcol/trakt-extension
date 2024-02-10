import type { EntityTypes, Extended, Short } from '~/models/tmdb/tmdb-entity.model';
import type { TmdbPerson } from '~/models/tmdb/tmdb-person.model';

export type TmdbEpisodeShort = {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  /** Air date of the episode (YYYY-MM-DD) */
  air_date: string;
  episode_number: number;
  production_code: string;
  runtime: number;
  season_number: number;
  still_path: string;
};

export type TmdbEpisodePerson = TmdbPerson & {
  credit_id: string;
  original_name: string;
};

export type TmdbEpisodePersonCrew = TmdbEpisodePerson & {
  department: string;
  job: string;
};

export type TmdbEpisodeGuestStar = TmdbEpisodePerson & {
  character: string;
  order: number;
};

export type TmdbEpisodeExtended = TmdbEpisodeShort & {
  crew: TmdbEpisodePersonCrew[];
  guest_stars: TmdbEpisodeGuestStar[];
};

export type TmdbEpisode<T extends EntityTypes = Short> = T extends Extended
  ? TmdbEpisodeExtended
  : T extends Short
    ? TmdbEpisodeShort
    : TmdbEpisodeExtended | TmdbEpisodeShort;

export type TmdbEpisodeRating = TmdbEpisode & {
  show_id: number;
  rating: number;
};

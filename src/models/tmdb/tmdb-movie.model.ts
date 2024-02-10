import type { TmdbCollection } from '~/models/tmdb/tmdb-collection.model';
import type { EntityTypes, Extended, Short, TmdbAccountRating, TmdbCountry, TmdbGenre, TmdbLanguage } from '~/models/tmdb/tmdb-entity.model';
import type { TmdbCompanyModel } from '~/models/tmdb/tmdb.company.model';

export type TmdbMovieShort = {
  media_type?: 'movie';
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  /** The date of release YYYY-MM-DD */
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type TmdbMovieExtended = TmdbMovieShort & {
  belongs_to_collection?: TmdbCollection;
  budget: number;
  genres: TmdbGenre[];
  homepage: string;
  imdb_id: string;
  production_companies: TmdbCompanyModel[];
  production_countries: TmdbCountry[];
  revenue: number;
  runtime: number;
  spoken_languages: TmdbLanguage[];
  status: string;
  tagline: string;
};

export type TmdbMovie<T extends EntityTypes = Short> = T extends Extended
  ? TmdbMovieExtended
  : T extends Short
    ? TmdbMovieShort
    : TmdbMovieShort | TmdbMovieExtended;

export type TmdbMovieRating = TmdbMovie & {
  account_rating: TmdbAccountRating;
};

export type TmdbMovieGuestRating = TmdbMovie & {
  rating: number;
};

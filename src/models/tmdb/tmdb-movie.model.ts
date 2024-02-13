import type { TmdbCollection } from '~/models/tmdb/tmdb-collection.model';
import type { TmdbCompany } from '~/models/tmdb/tmdb-company.model';
import type { EntityTypes, Extended, Short, TmdbAccountRating, TmdbCountry, TmdbGenre, TmdbLanguage } from '~/models/tmdb/tmdb-entity.model';
import type { TmdbImageShort } from '~/models/tmdb/tmdb-image.model';

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
  production_companies: TmdbCompany[];
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

export type TmdbMovieTitle = {
  iso_3166_1: string;
  title: string;
  type: string;
};

export type TmdbMovieTitles = {
  /** The movie id */
  id: number;
  titles: TmdbMovieTitle[];
};

export type TmdbMovieImages = {
  id: number;
  backdrops: TmdbImageShort[];
  posters: TmdbImageShort[];
  logos: TmdbImageShort[];
};

export const TmdbMovieReleaseType = {
  1: 'Premiere',
  2: 'Theatrical (limited)',
  3: 'Theatrical',
  4: 'Digital',
  5: 'Physical',
  6: 'TV',
} as const;

export type TmdbMovieReleaseDate = {
  certification: string;
  descriptors: string[];
  /** The ISO 3166-1 code of the country */
  iso_3166_1: string;
  note?: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DDThh:mm:ss.sssZ) */
  release_date: string;
  type: keyof typeof TmdbMovieReleaseType;
};

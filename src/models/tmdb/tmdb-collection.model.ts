import type { TmdbImageShort } from '~/models/tmdb/tmdb-image.model';
import type { TmdbMovie } from '~/models/tmdb/tmdb-movie.model';
import type { TmdbShow } from '~/models/tmdb/tmdb-show.model';

export type TmdbCollection = {
  id: number;
  name: string;
  overview?: string;
  poster_path: string;
  backdrop_path: string;
  parts?: (TmdbMovie | TmdbShow)[];
};

export type TmdbCollectionImages = {
  /** The id of the collection. */
  id: number;
  backdrops?: TmdbImageShort[];
  posters?: TmdbImageShort[];
};

export type TmdbSearchCollection = {
  adult: boolean;
  backdrop_path: string;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string;
};

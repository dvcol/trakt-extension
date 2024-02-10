import type { TmdbMovie } from '~/models/tmdb/tmdb-movie.model';

export type TmdbCollection = {
  id: number;
  name: string;
  overview?: string;
  poster_path: string;
  backdrop_path: string;
  parts?: TmdbMovie[];
};

export type TmdbCollectionImage = {
  file_path: string;
  /** ISO 639-1 language code */
  iso_639_1: string;
  aspect_ratio: number;
  height: number;
  width: number;
  vote_average: number;
  vote_count: number;
};

export type TmdbCollectionImages = {
  /** The id of the collection. */
  id: number;
  backdrops?: TmdbCollectionImage[];
  posters?: TmdbCollectionImage[];
};

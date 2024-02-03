import type { TmdbMovie } from '~/models/tmdb/tmdb-movie.model';

export type TmdbCollection = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  parts?: TmdbMovie[];
};

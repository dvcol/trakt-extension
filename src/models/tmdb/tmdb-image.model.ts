import type { EntityTypes, Extended, Short } from '~/models/tmdb/tmdb-entity.model';
import type { TmdbMovieShort } from '~/models/tmdb/tmdb-movie.model';
import type { TmdbShowShort } from '~/models/tmdb/tmdb-show.model';

export type TmdbImageShort = {
  file_path: string;
  /** ISO 639-1 language code */
  iso_639_1: string;
  aspect_ratio: number;
  height: number;
  width: number;
  vote_average: number;
  vote_count: number;
};

export type TmdbImageExtended = Omit<TmdbImageShort, 'iso_639_1'> & {
  id: string;
  file_type: string;
};

export type TmdbImages = {
  id: number;
  logos: TmdbImageExtended[];
};

export type TmdbImage<T extends EntityTypes = Short> = T extends Short
  ? TmdbImageShort
  : T extends Extended
    ? TmdbImageExtended
    : TmdbImageShort | TmdbImageExtended;

export type TmdbTaggedImage = TmdbImageShort & {
  id: string;
  image_type: string;
  media_type: string;
  media: TmdbMovieShort | TmdbShowShort;
};

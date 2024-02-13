import type { EntityTypes, Extended, Short } from '~/models/tmdb/tmdb-entity.model';
import type { TmdbMovie } from '~/models/tmdb/tmdb-movie.model';
import type { TmdbShow } from '~/models/tmdb/tmdb-show.model';

export type TmdbPersonShort = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name?: string;
  popularity: number;
  profile_path: string;
};

export type TmdbPersonExtended = TmdbPersonShort & {
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: string;
  homepage: string;
  imdb_id: string;
  place_of_birth: string;
};

export type TmdbPerson<T extends EntityTypes = Short> = T extends Extended
  ? TmdbPersonExtended
  : T extends Short
    ? TmdbPersonShort
    : TmdbPersonShort | TmdbPersonExtended;

export type TmdbPersonKnownFor = TmdbPerson & {
  known_for: (TmdbMovie | TmdbShow)[];
};

import type { EntityTypes, Extended, Short } from '~/models/tmdb/tmdb-entity.model';
import type { TmdbEpisodeExtended } from '~/models/tmdb/tmdb-episode.model';

export type TmdbSeasonShort = {
  /** Air date of the episode (YYYY-MM-DD) */
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
};

export type TmdbSeasonEpisode = TmdbEpisodeExtended & {
  episode_type: string;
  show_id: number;
};

export type TmdbSeasonExtended = TmdbSeason & {
  _id: string;
  air_date: string;
  episodes: TmdbSeasonEpisode[];
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
};

export type TmdbSeason<T extends EntityTypes = Short> = T extends Extended
  ? TmdbSeasonExtended
  : T extends Short
    ? TmdbSeasonShort
    : TmdbSeasonShort | TmdbSeasonExtended;

import type { EntityTypes, Extended, Short, TmdbNetwork } from '~/models/tmdb/tmdb-entity.model';
import type { TmdbEpisodeShort } from '~/models/tmdb/tmdb-episode.model';

export type TmdbEpisodeGroupShort = {
  description: string;
  episode_count: number;
  group_count: number;
  id: string;
  name: string;
  network: TmdbNetwork;
  type: number;
};

export type TmdbEpisodeGroupEpisode = TmdbEpisodeShort & {
  show_id: number;
  order: number;
};

export type TmdbEpisodeGroupItem = {
  id: string;
  name: string;
  order: number;
  locked: boolean;
  episodes: TmdbEpisodeGroupEpisode[];
};

export type TmdbEpisodeGroupExtended = TmdbEpisodeGroupShort & {
  groups: TmdbEpisodeGroupItem[];
};

export type TmdbEpisodeGroup<T extends EntityTypes = Short> = T extends Extended
  ? TmdbEpisodeGroupExtended
  : T extends Short
    ? TmdbEpisodeGroupShort
    : TmdbEpisodeGroupExtended | TmdbEpisodeGroupShort;

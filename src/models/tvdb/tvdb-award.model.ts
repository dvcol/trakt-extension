import type { Entity, EntityTypes, Extended, Short } from '~/models/tvdb/tvdb-entity.model';
import type { TvdbNomination } from '~/models/tvdb/tvdb-nomination.model';

export type TvdbAwardCategoryShort = {
  id: number;
  name: string;
  award: Entity;
  forMovies: boolean;
  forSeries: boolean;
  allowCoNominees: boolean;
};

export type TvdbAwardCategoryExtended = TvdbAwardCategory & {
  nominees: TvdbNomination[];
};

export type TvdbAwardCategory<T extends EntityTypes = Short> = T extends Short
  ? TvdbAwardCategoryShort
  : T extends Extended
    ? TvdbAwardCategoryExtended
    : TvdbAwardCategoryShort | TvdbAwardCategoryExtended;

export type TvdbAward = {
  id: number;
  name: string;
  categories: TvdbAwardCategory[];
  score: number;
};

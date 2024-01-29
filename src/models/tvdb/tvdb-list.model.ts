import type { EntityTypes, Extended, Short, TvdbAlias, TvdbRemoteId, TvdbTagOption } from '~/models/tvdb/tvdb-entity.model';

export type TvdbListShort = {
  aliases: TvdbAlias[];
  id: number;
  image?: string;
  imageIsFallback?: boolean;
  isOfficial: boolean;
  name: string;
  nameTranslations: string[];
  overview: string;
  overviewTranslations: string[];
  remoteIds?: TvdbRemoteId[];
  tags?: TvdbTagOption[];
  score: number;
  url: string;
};

export type TvdbListEntity = {
  order: number;
  seriesId: number;
  movieId: number;
};

export type TvdbListExtended = TvdbListShort & {
  entities: TvdbListEntity[];
};

export type TvdbList<T extends EntityTypes = Short> = T extends Short
  ? TvdbListShort
  : T extends Extended
    ? TvdbListExtended
    : TvdbListShort | TvdbListExtended;

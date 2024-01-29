import type { TvdbCharacter } from '~/models/tvdb/tvdb-character.model';
import type { Entity, EntityTypes, Extended, Short, TvdbAlias, TvdbRemoteId, TvdbTagOption } from '~/models/tvdb/tvdb-entity.model';
import type { TvdbTranslation } from '~/models/tvdb/tvdb-translation.model';

export type TvdbPersonShort = {
  aliases: TvdbAlias[];
  id: number;
  image: string;
  lastUpdated: string;
  name: string;
  nameTranslations: string[];
  overviewTranslations: string[];
  score: number;
};

type TvdbPersonBiography = {
  biography: string;
  language: string;
};

export type TvdbPersonExtended = TvdbPersonShort & {
  awards?: Entity[];
  biographies: TvdbPersonBiography[];
  birth: string;
  birthPlace: string;
  characters: TvdbCharacter[];
  death: string;
  gender: number;
  races: Record<string, unknown>[];
  remoteIds: TvdbRemoteId[];
  slug: 'string';
  tagOptions: TvdbTagOption[];
  translations?: {
    nameTranslations?: TvdbTranslation[];
    overviewTranslations?: TvdbTranslation[];
    alias?: string[];
  };
};

export type TvdbPerson<T extends EntityTypes = Short> = T extends Short
  ? TvdbPersonShort
  : T extends Extended
    ? TvdbPersonExtended
    : TvdbPersonShort | TvdbPersonExtended;

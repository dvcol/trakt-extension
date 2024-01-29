export const EntityType = {
  Short: 'short',
  Extended: 'extended',
  Any: 'any',
} as const;

export type Any = typeof EntityType.Any;
export type Short = typeof EntityType.Short;
export type Extended = typeof EntityType.Extended;

export type EntityTypes = (typeof EntityType)[keyof typeof EntityType];

export type Entity = {
  id: number;
  name: string;
};

export type EntityExtended = Entity & {
  hasSpecials: boolean;
};

export type TvdbTagOption = {
  helpText: string;
  id: number;
  name: string;
  tag: number;
  tagName: string;
};

export type TvdbAlias = {
  language: string;
  name: string;
};

export type TvdbStatus = {
  id: number;
  keepUpdated: boolean;
  name: string;
  recordType: string;
};

export type TvdbRemoteId = {
  id: string;
  type: number;
  sourceName: string;
};

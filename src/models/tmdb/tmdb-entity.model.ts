export const EntityType = {
  Short: 'short',
  Extended: 'extended',
  Any: 'any',
} as const;

export type Any = typeof EntityType.Any;
export type Short = typeof EntityType.Short;
export type Extended = typeof EntityType.Extended;

export type EntityTypes = (typeof EntityType)[keyof typeof EntityType];

export type TmdbGenre = {
  id: number;
  name: string;
};

export type TmdbCompany = {
  id: number;
  logo_path?: string;
  name: string;
  origin_country: string;
  parent_company?: TmdbCompany;
  description?: string;
  headquarters?: string;
  homepage?: string;
};

export type TmdbCountry = {
  /** The ISO 3166-1 code of the country */
  iso_3166_1: string;
  name: string;
};

export type TmdbLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

export type TmdbNetwork = {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
  headquarters?: string;
  homepage?: string;
};

export type TmdbCertification = {
  certification: string;
  meaning: string;
  order: number;
};

export type TmdbKeyword = {
  id: number;
  name: string;
};

export type TmdbAccountRating = {
  /** Creation timestamp in ISO 8601 format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  created_at: string;
  value: number;
};

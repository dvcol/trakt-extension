export type TmdbCompanyModel = {
  id: number;
  logo_path?: string;
  name: string;
  origin_country: string;
  parent_company?: TmdbCompanyModel;
  description?: string;
  headquarters?: string;
  homepage?: string;
};

export type TmdbCompanyAlternativeName = {
  name: string;
  type: string;
};

export type TmdbCompanyAlternativeNames = {
  /** The company id */
  id: number;
  results: TmdbCompanyAlternativeName[];
};

export type TmdbCompanyImage = {
  id: string;
  file_path: string;
  file_type: string;
  aspect_ratio: number;
  height: number;
  width: number;
  vote_average: number;
  vote_count: number;
};

export type TmdbCompanyImages = {
  id: number;
  logos: TmdbCompanyImage[];
};

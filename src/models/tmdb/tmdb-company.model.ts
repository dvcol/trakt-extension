export type TmdbCompanyShort = {
  id: number;
  logo_path?: string;
  name: string;
  origin_country: string;
};

export type TmdbCompany = TmdbCompanyShort & {
  parent_company?: TmdbCompany;
  description?: string;
  headquarters?: string;
  homepage?: string;
};

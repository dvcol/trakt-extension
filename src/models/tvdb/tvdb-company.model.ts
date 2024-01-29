import type { TvdbAlias, TvdbTagOption } from '~/models/tvdb/tvdb-entity.model';

export type TvdbParentCompany = {
  id: number;
  name: string;
  relation: {
    id: number;
    typeName: string;
  };
};

export type TvdbCompany = {
  id: number;
  name: string;
  slug: string;
  country: string;
  activeDate: string;
  inactiveDate: string;
  aliases: TvdbAlias[];
  nameTranslations: string[];
  overviewTranslations: string[];
  primaryCompanyType: number;
  parentCompany: TvdbParentCompany;
  tagOptions: TvdbTagOption[];
};

export type TvdbCompanyType = {
  companyTypeId: number;
  companyTypeName: string;
};

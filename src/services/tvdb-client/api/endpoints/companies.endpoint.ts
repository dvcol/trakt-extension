import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TvdbCompany, TvdbCompanyType } from '~/models/tvdb/tvdb-company.model';

import { TvdbClientEndpoint, type TvdbPaginatedData, type TvdbParamPagination } from '~/models/tvdb/tvdb-client.model';

/**
 * Companies Endpoint
 *
 * @see [companies]{@link https://thetvdb.github.io/v4-api/#/Companies}
 */
export const companies = {
  /**
   * Returns a paginated list of company records
   *
   * @auth required
   *
   * @see [get-all-companies]{@link https://thetvdb.github.io/v4-api/#/Companies/getAllCompanies}
   */
  list: new TvdbClientEndpoint<TvdbParamPagination, TvdbPaginatedData<TvdbCompany>>({
    method: HttpMethod.GET,
    url: '/companies?page=',
    opts: {
      auth: true,
      parameters: {
        query: {
          page: false,
        },
      },
    },
  }),
  /**
   * Returns all company types records.
   *
   * @auth required
   *
   * @see [get-company-types]{@link https://thetvdb.github.io/v4-api/#/Companies/getCompanyTypes}
   */
  types: new TvdbClientEndpoint<Record<string, never>, TvdbCompanyType[]>({
    method: HttpMethod.GET,
    url: '/companies/types',
    opts: {
      auth: true,
    },
  }),
  /**
   * Returns a single company record.
   *
   * @auth required
   *
   * @see [get-company]{@link https://thetvdb.github.io/v4-api/#/Companies/getCompany}
   */
  get: new TvdbClientEndpoint<
    {
      id: number | string;
    },
    TvdbCompany
  >({
    method: HttpMethod.GET,
    url: '/companies/:id',
    opts: {
      auth: true,
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
};

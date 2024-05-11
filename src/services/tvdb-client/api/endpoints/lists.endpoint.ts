import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TvdbListExtended, TvdbListShort } from '~/models/tvdb/tvdb-list.model';

import type { TvdbTranslation } from '~/models/tvdb/tvdb-translation.model';

import { TvdbClientEndpoint, type TvdbPaginatedData, type TvdbParamPagination } from '~/models/tvdb/tvdb-client.model';

/**
 * List endpoints
 *
 * @see [lists]{@link https://thetvdb.github.io/v4-api/#/Lists}
 */
export const lists = {
  /**
   * Returns a paginated list of list records.
   *
   * @auth required
   *
   * @see [get-all-lists]{@link https://thetvdb.github.io/v4-api/#/Lists/getAllLists}
   */
  list: new TvdbClientEndpoint<TvdbParamPagination, TvdbPaginatedData<TvdbListShort>>({
    method: HttpMethod.GET,
    url: '/lists?page=',
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
   * Returns a single list record.
   *
   * @auth required
   *
   * @see [get-list]{@link https://thetvdb.github.io/v4-api/#/Lists/getList}
   */
  get: new TvdbClientEndpoint<
    {
      id: number | string;
    },
    TvdbListShort
  >({
    method: HttpMethod.GET,
    url: '/lists/:id',
    opts: {
      auth: true,
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns a list record that match the provided slug.
   *
   * @auth required
   *
   * @see [get-list-by-slug]{@link https://thetvdb.github.io/v4-api/#/Lists/getListBySlug}
   */
  slug: new TvdbClientEndpoint<
    {
      slug: string;
    },
    TvdbListShort
  >({
    method: HttpMethod.GET,
    url: '/lists/slug/:slug',
    opts: {
      auth: true,
      parameters: {
        path: {
          slug: true,
        },
      },
    },
  }),
  /**
   * Returns an extended list record.
   *
   * @auth required
   *
   * @see [get-list-extended]{@link https://thetvdb.github.io/v4-api/#/Lists/getListExtended}
   */
  extended: new TvdbClientEndpoint<
    {
      id: number | string;
    },
    TvdbListExtended
  >({
    method: HttpMethod.GET,
    url: '/lists/:id/extended',
    opts: {
      auth: true,
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns a list of translations for a given list.
   *
   * @auth required
   *
   * @see [get-list-translations]{@link https://thetvdb.github.io/v4-api/#/Lists/getListTranslation}
   */
  translations: new TvdbClientEndpoint<
    {
      id: number | string;
      language: string;
    },
    TvdbTranslation[]
  >({
    method: HttpMethod.GET,
    url: '/lists/:id/translations/:language',
    opts: {
      auth: true,
      parameters: {
        path: {
          id: true,
          language: true,
        },
      },
    },
  }),
};

import type { Entity } from '~/models/tvdb/tvdb-entity.model';
import type { TvdbPersonExtended, TvdbPersonShort } from '~/models/tvdb/tvdb-person.model';

import type { TvdbTranslation } from '~/models/tvdb/tvdb-translation.model';

import { TvdbClientEndpoint, type TvdbPaginatedData, type TvdbParamPagination } from '~/models/tvdb/tvdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * People endpoints
 *
 * @see [people]{@link https://thetvdb.github.io/v4-api/#/People}
 */
export const people = {
  /**
   * Returns a paginated list of people records.
   *
   * @auth required
   *
   * @see [get-all-people]{@link https://thetvdb.github.io/v4-api/#/People/getAllPeople}
   */
  list: new TvdbClientEndpoint<TvdbParamPagination, TvdbPaginatedData<TvdbPersonShort>>({
    method: HttpMethod.GET,
    url: '/people?page=',
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
   * Returns a single person record.
   *
   * @auth required
   *
   * @see [get-people]{@link https://thetvdb.github.io/v4-api/#/People/getPeopleBase}
   */
  get: new TvdbClientEndpoint<
    {
      id: number | string;
    },
    TvdbPersonShort
  >({
    method: HttpMethod.GET,
    url: '/people/:id',
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
   * Returns an extended person record.
   *
   * @auth required
   *
   * @see [get-people-extended]{@link https://thetvdb.github.io/v4-api/#/People/getPeopleExtended}
   */
  extended: new TvdbClientEndpoint<
    {
      id: number | string;
      /** The meta field can be used to request translations. */
      meta?: boolean | 'translations';
    },
    TvdbPersonExtended
  >({
    method: HttpMethod.GET,
    url: '/people/:id/extended?meta=',
    opts: {
      auth: true,
      parameters: {
        path: {
          id: true,
        },
        query: {
          meta: false,
        },
      },
    },
    /** Coerce meta into string value */
    transform: params => ({ ...params, meta: params.meta ? 'translations' : undefined }),
  }),
  /**
   * Returns a list of translations that exist for a given person record.
   *
   * @auth required
   *
   * @see [get-people-translations]{@link https://thetvdb.github.io/v4-api/#/People/getPeopleTranslation}
   */
  translations: new TvdbClientEndpoint<
    {
      id: number | string;
      language: string;
    },
    TvdbTranslation
  >({
    method: HttpMethod.GET,
    url: '/people/:id/translations/:language',
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
  /**
   * Returns a list of people types.
   *
   * @auth required
   *
   * @see [get-people-types]{@link https://thetvdb.github.io/v4-api/#/People%20Types/getAllPeopleTypes}
   */
  types: new TvdbClientEndpoint<Record<string, never>, Entity[]>({
    method: HttpMethod.GET,
    url: '/people/types',
    opts: {
      auth: true,
    },
  }),
};

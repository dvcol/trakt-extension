import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TvdbAward, TvdbAwardCategoryExtended, TvdbAwardCategoryShort } from '~/models/tvdb/tvdb-award.model';
import type { Entity } from '~/models/tvdb/tvdb-entity.model';

import { TvdbClientEndpoint } from '~/models/tvdb/tvdb-client.model';

/**
 * Award endpoints
 *
 * @see [awards]{@link https://thetvdb.github.io/v4-api/#/Awards}
 */
export const awards = {
  /**
   * Returns a list of award base records
   *
   * @auth required
   *
   * @see [get-all-awards]{@link https://thetvdb.github.io/v4-api/#/Awards/getAllAwards}
   */
  all: new TvdbClientEndpoint<Record<string, never>, Entity[]>({
    method: HttpMethod.GET,
    url: '/awards',
    opts: {
      auth: true,
    },
  }),
  /**
   * Returns a single award base record.
   *
   * @auth required
   *
   * @see [get-award]{@link https://thetvdb.github.io/v4-api/#/Awards/getAward}
   */
  get: new TvdbClientEndpoint<
    {
      id: number | string;
      extended?: boolean | 'extended';
    },
    Entity | TvdbAward
  >({
    method: HttpMethod.GET,
    url: '/awards/:id/:extended',
    opts: {
      auth: true,
      parameters: {
        path: {
          id: true,
          extended: false,
        },
      },
    },
    /** Coerce extended into string value */
    transform: params => ({ ...params, extended: params.extended ? 'extended' : undefined }),
  }),
  /**
   * Returns a single award extended record
   *
   * @auth required
   *
   * @see [get-award-extended]{@link https://thetvdb.github.io/v4-api/#/Awards/getAwardExtended}
   */
  extended: new TvdbClientEndpoint<
    {
      id: number | string;
    },
    TvdbAward
  >({
    method: HttpMethod.GET,
    url: '/awards/:id/extended',
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
   * Award categories endpoints
   *
   * @see [award-categories]{@link https://thetvdb.github.io/v4-api/#/Award%20Categories}
   */
  categories: {
    /**
     * Returns a single award category base record
     *
     * @auth required
     *
     * @see [get-award-category]{@link https://thetvdb.github.io/v4-api/#/Award%20Categories/getAwardCategory}
     */
    get: new TvdbClientEndpoint<
      {
        id: number | string;
      },
      TvdbAwardCategoryShort
    >({
      method: HttpMethod.GET,
      url: '/awards/categories/:id',
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
     * Returns a single award category extended record
     *
     * @auth required
     *
     * @see [get-award-category-extended]{@link https://thetvdb.github.io/v4-api/#/Award%20Categories/getAwardCategoryExtended}
     */
    extended: new TvdbClientEndpoint<
      {
        id: number | string;
      },
      TvdbAwardCategoryExtended
    >({
      method: HttpMethod.GET,
      url: '/awards/categories/:id/extended',
      opts: {
        auth: true,
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
  },
};

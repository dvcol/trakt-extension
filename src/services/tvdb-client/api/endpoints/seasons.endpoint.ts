import type { TvdbSeason, TvdbSeasonExtended, TvdbSeasonType } from '~/models/tvdb/tvdb-season.model';

import type { TvdbTranslation } from '~/models/tvdb/tvdb-translation.model';

import { TvdbClientEndpoint, type TvdbPaginatedData, type TvdbParamPagination } from '~/models/tvdb/tvdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Season endpoints
 *
 * @see [seasons]{@link https://thetvdb.github.io/v4-api/#/Seasons}
 */
export const seasons = {
  /**
   * Returns a paginated list of season records.
   *
   * @auth required
   *
   * @see [get-all-seasons]{@link https://thetvdb.github.io/v4-api/#/Seasons/getAllSeasons}
   */
  list: new TvdbClientEndpoint<TvdbParamPagination, TvdbPaginatedData<TvdbSeason>>({
    method: HttpMethod.GET,
    url: '/seasons?page=',
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
   * Returns a single season record.
   *
   * @auth required
   *
   * @see [get-season]{@link https://thetvdb.github.io/v4-api/#/Seasons/getSeasonBase}
   */
  get: new TvdbClientEndpoint<
    {
      id: number | string;
    },
    TvdbSeason
  >({
    method: HttpMethod.GET,
    url: '/seasons/:id',
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
   * Returns an extended season record.
   *
   * @auth required
   *
   * @see [get-season-extended]{@link https://thetvdb.github.io/v4-api/#/Seasons/getSeasonExtended}
   */
  extended: new TvdbClientEndpoint<
    {
      id: number | string;
    },
    TvdbSeasonExtended
  >({
    method: HttpMethod.GET,
    url: '/seasons/:id/extended',
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
   * Returns a list of episode types.
   *
   * @auth required
   *
   * @see [get-season-types]{@link https://thetvdb.github.io/v4-api/#/Seasons/getSeasonTypes}
   */
  types: new TvdbClientEndpoint<Record<string, never>, TvdbSeasonType[]>({
    method: HttpMethod.GET,
    url: '/seasons/types',
    opts: {
      auth: true,
    },
  }),
  /**
   * Returns a translation record for a given season record.
   *
   * @auth required
   *
   * @see [get-season-translations]{@link https://thetvdb.github.io/v4-api/#/Seasons/getSeasonTranslation}
   */
  translations: new TvdbClientEndpoint<
    {
      id: number | string;
      language: string;
    },
    TvdbTranslation
  >({
    method: HttpMethod.GET,
    url: '/seasons/:id/translations/:language',
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

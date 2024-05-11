import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TvdbEpisode, TvdbEpisodeExtended, TvdbEpisodeShort } from '~/models/tvdb/tvdb-episode.model';

import type { TvdbTranslation } from '~/models/tvdb/tvdb-translation.model';

import { TvdbClientEndpoint, type TvdbPaginatedData, type TvdbParamPagination } from '~/models/tvdb/tvdb-client.model';

/**
 * Endpoints for episodes.
 *
 * @see [API Documentation]{@link https://thetvdb.github.io/v4-api/#/Episodes}
 */
export const episodes = {
  /**
   * Returns a list of episodes base records with the basic attributes.
   * Note that all episodes are returned, even those that may not be included in a series' default season order.
   *
   * @auth required
   *
   * @see [get-all-episodes]{@link https://thetvdb.github.io/v4-api/#/Episodes/getAllEpisodes}
   */
  all: new TvdbClientEndpoint<TvdbParamPagination, TvdbPaginatedData<TvdbEpisode>>({
    method: HttpMethod.GET,
    url: '/episodes?page=',
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
   * Returns an episode base record.
   *
   * @auth required
   *
   * @see [get-episode]{@link https://thetvdb.github.io/v4-api/#/Episodes/getEpisodeBase}
   */
  get: new TvdbClientEndpoint<
    {
      id: number | string;
    },
    TvdbEpisodeShort
  >({
    method: HttpMethod.GET,
    url: '/episodes/:id',
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
   * Returns an extended episode record.
   *
   * @auth required
   *
   * @see [get-episode-extended]{@link https://thetvdb.github.io/v4-api/#/Episodes/getEpisodeExtended}
   */
  extended: new TvdbClientEndpoint<
    {
      id: number | string;
      /** The meta field can be used to request translations. */
      meta?: boolean | 'translations';
    },
    TvdbEpisodeExtended
  >({
    method: HttpMethod.GET,
    url: '/episodes/:id/extended?meta=',
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
    transform: params => ({ ...params, meta: params.meta ? 'translations' : undefined }),
  }),
  /**
   * Returns the translation record for an episode
   *
   * @auth required
   *
   * @see [get-episode-translations]{@link https://thetvdb.github.io/v4-api/#/Episodes/getEpisodeTranslation}
   */
  translations: new TvdbClientEndpoint<
    {
      id: number | string;
      language: string;
    },
    TvdbTranslation
  >({
    method: HttpMethod.GET,
    url: '/episodes/:id/translations/:language',
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

import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TmdbListV3 } from '~/models/tmdb/tmdb-list.model';

import type { TmdbMovieShort } from '~/models/tmdb/tmdb-movie.model';

import { TmdbClientEndpoint, type TmdbPaginatedData, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';

/**
 * Lists v3 endpoints.
 *
 * What are some of the improvements in v4?
 *
 * - You can import "unlimited" items in a single request
 * - You can use mixed type (movie and TV) lists
 * - You can use private lists
 * - You can add and use comments per item
 * - There are more sort options
 * - They are faster
 * - Check the v4 documentation for more information.
 *
 * @deprecated Please move to using [lists v4]{@link https://developer.themoviedb.org/v4/reference/list-details}.
 */
export const list = {
  /**
   * Add a movie to a list.
   *
   * @auth session-id
   * @version 3
   *
   * @see [lists]{@link https://developer.themoviedb.org/reference/list-add-movie}
   */
  add: new TmdbClientEndpoint<
    {
      list_id: string | number;
      media_id: string | number;

      session_id?: string;
    },
    unknown,
    false
  >({
    method: HttpMethod.POST,
    url: '/list/:list_id/add_item?list_id&session_id=',
    body: {
      media_id: true,
    },
    opts: {
      auth: 'session',
      cache: false,
      version: 3,
      parameters: {
        path: {
          list_id: true,
        },
        query: {
          session_id: false,
        },
      },
    },
  }),
  /**
   * Use this method to check if an item has already been added to the list.
   *
   * @version 3
   *
   * @see [list-check-item-status]{@link https://developer.themoviedb.org/reference/list-check-item-status}
   */
  check: new TmdbClientEndpoint<
    {
      list_id: string | number;
      movie_id: string | number;
      language?: string;
    },
    {
      id: number;
      item_present: boolean;
    }
  >({
    method: HttpMethod.GET,
    url: '/list/:list_id/item_status?list_id&movie_id=&language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          list_id: true,
        },
        query: {
          movie_id: true,
          language: false,
        },
      },
    },
  }),
  /**
   * Clear all items from a list.
   *
   * @auth session-id
   * @version 3
   *
   * @see [clear]{@link https://developer.themoviedb.org/reference/list-clear
   */
  clear: new TmdbClientEndpoint<
    {
      list_id: string | number;
      confirm: boolean;
      session_id?: string;
    },
    unknown,
    false
  >({
    method: HttpMethod.POST,
    url: '/list/:list_id/clear?list_id&confirm=&session_id=',
    opts: {
      auth: 'session',
      cache: false,
      version: 3,
      parameters: {
        path: {
          list_id: true,
        },
        query: {
          confirm: true,
          session_id: false,
        },
      },
    },
  }),
  /**
   * Create a new list.
   *
   * @auth session-id
   * @version 3
   *
   * @see [create]{@link https://developer.themoviedb.org/reference/list-create}
   */
  create: new TmdbClientEndpoint<
    {
      name: string;
      description: string;
      language: string;

      session_id?: string;
    },
    {
      list_id: number;
    },
    false
  >({
    method: HttpMethod.POST,
    url: '/list?session_id=',
    body: {
      name: true,
      description: true,
      language: true,
    },
    opts: {
      auth: 'session',
      cache: false,
      version: 3,
      parameters: {
        query: {
          session_id: false,
        },
      },
    },
  }),
  /**
   * Delete a list.
   *
   * @auth session-id
   * @version 3
   *
   * @see [delete]{@link https://developer.themoviedb.org/reference/list-delete}
   */
  delete: new TmdbClientEndpoint<
    {
      list_id: string | number;
      session_id?: string;
    },
    unknown,
    false
  >({
    method: HttpMethod.DELETE,
    url: '/list/:list_id?session_id=',
    opts: {
      auth: 'session',
      cache: false,
      version: 3,
      parameters: {
        path: {
          list_id: true,
        },
        query: {
          session_id: false,
        },
      },
    },
  }),
  /**
   * Get a list by id.
   *
   * @version 3
   *
   * @see [get-list]{@link https://developer.themoviedb.org/reference/list-details}
   */
  details: new TmdbClientEndpoint<
    {
      list_id: string | number;
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort, TmdbListV3>
  >({
    method: HttpMethod.GET,
    url: '/list/:list_id?list_id&language=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          list_id: true,
        },
        query: {
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Remove a movie from a list.
   *
   * @auth session-id
   * @version 3
   *
   * @see [remove]{@link https://developer.themoviedb.org/reference/list-remove-movie}
   */
  remove: new TmdbClientEndpoint<
    {
      list_id: string | number;
      media_id: string | number;

      session_id?: string;
    },
    unknown,
    false
  >({
    method: HttpMethod.POST,
    url: '/list/:list_id/remove_item?list_id&session_id=',
    body: {
      media_id: true,
    },
    opts: {
      auth: 'session',
      cache: false,
      version: 3,
      parameters: {
        path: {
          list_id: true,
        },
        query: {
          session_id: false,
        },
      },
    },
  }),
};

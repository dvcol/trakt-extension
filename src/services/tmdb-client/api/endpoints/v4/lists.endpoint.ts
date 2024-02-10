import type { TmdbListV4 } from '~/models/tmdb/tmdb-list.model';

import type { TmdbMovieShort } from '~/models/tmdb/tmdb-movie.model';

import { TmdbClientEndpoint, type TmdbPaginatedData, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

type TmdbListItem = { media_type: 'movie' | 'tv'; media_id: number; comment?: string };
type TmdbListItemResponse = TmdbListItem & { success: boolean };

/**
 * Lists v4 Endpoints.
 */
export const lists = {
  /**
   * Retrieve a list's details by id.
   *
   * Private lists can only be accessed by their owners and therefore require a valid user access token.
   *
   * @auth user-token
   * @version 4
   *
   * @see [list-details]{@link https://developer.themoviedb.org/v4/reference/list-details}
   */
  details: new TmdbClientEndpoint<
    {
      list_id: string | number;
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort, TmdbListV4>
  >({
    method: HttpMethod.GET,
    url: '/list/:list_id?language=&page=',
    opts: {
      auth: 'session',
      version: 4,
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
   * Add items to a list.
   *
   * @auth user-token
   * @version 4
   *
   * @see [add-items]{@link https://developer.themoviedb.org/v4/reference/list-add-items}
   */
  add: new TmdbClientEndpoint<
    {
      list_id: string | number;
      items: TmdbListItem[];
    },
    TmdbListItemResponse[],
    false
  >({
    method: HttpMethod.POST,
    url: '/list/:list_id/items',
    body: {
      items: true,
    },
    opts: {
      auth: 'token',
      cache: false,
      version: 4,
      parameters: {
        path: {
          list_id: true,
        },
      },
    },
  }),
  /**
   * Clear all of the items on a list.
   *
   * @auth user-token
   * @version 4
   *
   * @see [clear-list]{@link https://developer.themoviedb.org/v4/reference/list-clear}
   */
  clear: new TmdbClientEndpoint<
    {
      list_id: string | number;
    },
    {
      id: number;
      items_deleted: number;
    },
    false
  >({
    method: HttpMethod.GET,
    url: '/list/:list_id/clear',
    opts: {
      auth: 'token',
      version: 4,
      cache: false,
      parameters: {
        path: {
          list_id: true,
        },
      },
    },
  }),
  /**
   * Create a new list.
   *
   * You will need to have valid user access token in order to create a new list.
   *
   * @auth user-token
   * @version 4
   *
   * @see [create-list]{@link https://developer.themoviedb.org/v4/reference/list-creat}e
   */
  create: new TmdbClientEndpoint<
    {
      name: string;
      description: string;
      /** The ISO 3166-1 code of the country */
      iso_3166_1: string;
      /** The ISO 639-1 code of the language */
      iso_639_1: string;
      public: boolean;
    },
    {
      id: number;
    },
    false
  >({
    method: HttpMethod.POST,
    url: '/list',
    body: {
      name: true,
      description: false,
      iso_3166_1: false,
      iso_639_1: false,
      public: false,
    },
    opts: {
      auth: 'token',
      cache: false,
      version: 4,
    },
  }),
  /**
   * Delete a list by id.
   *
   * @auth user-token
   * @version 4
   *
   * @see [delete-list]{@link https://developer.themoviedb.org/v4/reference/list-delete}
   */
  delete: new TmdbClientEndpoint<
    {
      list_id: string | number;
    },
    unknown,
    false
  >({
    method: HttpMethod.DELETE,
    url: '/list/:list_id',
    opts: {
      auth: 'token',
      version: 4,
      cache: false,
      parameters: {
        path: {
          list_id: true,
        },
      },
    },
  }),
  /**
   * Check if an item is on a list.
   *
   * You must be the owner of the list and therefore have a valid user access token in order to check an item status.
   *
   * @auth user-token
   * @version 4
   *
   * @see [item-status]{@link https://developer.themoviedb.org/v4/reference/list-item-status}
   */
  status: new TmdbClientEndpoint<
    {
      list_id: string | number;
      media_type: 'movie' | 'tv';
      media_id: string | number;
    },
    {
      id: number;
      media_id: number;
      media_type: 'movie' | 'tv';
    }
  >({
    method: HttpMethod.GET,
    url: '/list/:list_id/item_status?media_type=&media_id=',
    opts: {
      auth: 'token',
      version: 4,
      parameters: {
        path: {
          list_id: true,
        },
        query: {
          media_type: true,
          media_id: true,
        },
      },
    },
  }),
  /**
   * Remove items from a list
   *
   * @auth user-token
   * @version 4
   *
   * @see [remove-items]{@link https://developer.themoviedb.org/v4/reference/list-remove-items}
   */
  remove: new TmdbClientEndpoint<
    {
      list_id: string | number;
      items: TmdbListItem[];
    },
    TmdbListItemResponse[],
    false
  >({
    method: HttpMethod.DELETE,
    url: '/list/:list_id/items',
    body: {
      items: true,
    },
    opts: {
      auth: 'token',
      version: 4,
      cache: false,
      parameters: {
        path: {
          list_id: true,
        },
      },
    },
  }),
  update: {
    /**
     * Update the details of a list.
     *
     * @auth user-token
     * @version 4
     *
     * @see [update-list]{@link https://developer.themoviedb.org/v4/reference/list-update}
     */
    list: new TmdbClientEndpoint<
      {
        list_id: string | number;
        name: string;
        sort_by: string;
        description: string;
        public: boolean;
      },
      unknown,
      false
    >({
      method: HttpMethod.PUT,
      url: '/list/:list_id',
      opts: {
        auth: 'token',
        version: 4,
        cache: false,
        parameters: {
          path: {
            list_id: true,
          },
        },
      },
    }),
    /**
     * Update an individual item on a list
     *
     * @auth user-token
     * @version 4
     *
     * @see [update-list-item]{@link https://developer.themoviedb.org/v4/reference/list-update-items}
     */
    items: new TmdbClientEndpoint<
      {
        list_id: string | number;
        items: TmdbListItem[];
      },
      TmdbListItemResponse[],
      false
    >({
      method: HttpMethod.PUT,
      url: '/list/:list_id/items',
      opts: {
        auth: 'token',
        version: 4,
        cache: false,
        parameters: {
          path: {
            list_id: true,
          },
        },
      },
    }),
  },
};

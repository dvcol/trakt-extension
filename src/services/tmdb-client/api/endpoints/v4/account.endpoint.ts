import type { TmdbList } from '~/models/tmdb/tmdb-list.model';

import type { TmdbMovie } from '~/models/tmdb/tmdb-movie.model';

import type { TmdbShow } from '~/models/tmdb/tmdb-show.model';

import { TmdbClientEndpoint, type TmdbPaginatedData, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Account Endpoints.
 */
export const account = {
  /**
   * Get the lists the user created.
   *
   * @auth required
   *
   * @see [lists]{@link https://developer.themoviedb.org/v4/reference/account-lists}
   */
  lists: new TmdbClientEndpoint<
    {
      account_id: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbList>
  >({
    method: HttpMethod.GET,
    url: '/account/:account_id/lists?page=',
    opts: {
      auth: true,
      parameters: {
        path: {
          account_id: true,
        },
        query: {
          page: false,
        },
      },
    },
  }),
  favorite: {
    /**
     * Get a user's list of favourite movies.
     *
     * @auth required
     *
     * @see [movies]{@link https://developer.themoviedb.org/v4/reference/account-favorite-movies}
     */
    movies: new TmdbClientEndpoint<
      {
        account_id: string;
        language?: string;
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbMovie>
    >({
      method: HttpMethod.GET,
      url: '/account/:account_id/movie/favorites?language=&page=',
      opts: {
        auth: true,
        parameters: {
          path: {
            account_id: true,
          },
          query: {
            page: false,
            language: false,
          },
        },
      },
    }),
    /**
     * Get a user's list of favourite TV shows.
     *
     * @auth required
     * @see [shows]{@link https://developer.themoviedb.org/v4/reference/account-favorite-tv}
     */
    shows: new TmdbClientEndpoint<
      {
        account_id: string;
        language?: string;
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbShow>
    >({
      method: HttpMethod.GET,
      url: '/account/:account_id/tv/favorites?language=&page=',
      opts: {
        auth: true,
        parameters: {
          path: {
            account_id: true,
          },
          query: {
            page: false,
            language: false,
          },
        },
      },
    }),
  },
  rated: {
    movies: new TmdbClientEndpoint({
      method: HttpMethod.GET,
      url: '/account/:account_id/movie/rated?language=&page=',
      opts: {
        auth: true,
        parameters: {
          path: {
            account_id: true,
          },
          query: {
            page: false,
            language: false,
          },
        },
      },
    }),
  },
};

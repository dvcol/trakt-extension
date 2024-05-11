import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TmdbAccountListV4 } from '~/models/tmdb/tmdb-list.model';

import type { TmdbMovieRating, TmdbMovieShort } from '~/models/tmdb/tmdb-movie.model';

import type { TmdbShowRating, TmdbShowShort } from '~/models/tmdb/tmdb-show.model';

import { TmdbClientEndpoint, type TmdbPaginatedData, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';

/**
 * Account v4 Endpoints.
 */
export const account = {
  /**
   * Get the lists the user created.
   *
   * @auth user-token
   * @version 4
   *
   * @see [lists]{@link https://developer.themoviedb.org/v4/reference/account-lists}
   */
  lists: new TmdbClientEndpoint<
    {
      account_id: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbAccountListV4>
  >({
    method: HttpMethod.GET,
    url: '/account/:account_id/lists?page=',
    opts: {
      auth: 'token',
      version: 4,
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
     * @auth user-token
     * @version 4
     *
     * @see [movies]{@link https://developer.themoviedb.org/v4/reference/account-favorite-movies}
     */
    movies: new TmdbClientEndpoint<
      {
        account_id: string;
        language?: string;
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbMovieShort>
    >({
      method: HttpMethod.GET,
      url: '/account/:account_id/movie/favorites?language=&page=',
      opts: {
        auth: 'token',
        version: 4,
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
     * @auth user-token
     * @version 4
     *
     * @see [shows]{@link https://developer.themoviedb.org/v4/reference/account-favorite-tv}
     */
    shows: new TmdbClientEndpoint<
      {
        account_id: string;
        language?: string;
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbShowShort>
    >({
      method: HttpMethod.GET,
      url: '/account/:account_id/tv/favorites?language=&page=',
      opts: {
        auth: 'token',
        version: 4,
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
    /**
     * Get a user's list of rated movies.
     *
     * @auth user-token
     * @version 4
     *
     * @see [rated-movies]{@link https://developer.themoviedb.org/v4/reference/account-rated-movies}
     */
    movies: new TmdbClientEndpoint<
      {
        account_id: string;
        language?: string;
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbMovieRating>
    >({
      method: HttpMethod.GET,
      url: '/account/:account_id/movie/rated?language=&page=',
      opts: {
        auth: 'token',
        version: 4,
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
     * Get a user's list of rated TV shows.
     *
     * @auth user-token
     * @version 4
     *
     * @see [rated-shows]{@link https://developer.themoviedb.org/v4/reference/account-rated-tv}
     */
    shows: new TmdbClientEndpoint<
      {
        account_id: string;
        language?: string;
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbShowRating>
    >({
      method: HttpMethod.GET,
      url: '/account/:account_id/tv/rated?language=&page=',
      opts: {
        auth: 'token',
        version: 4,
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
  recommended: {
    /**
     * Get a user's list of recommended movies.
     *
     * @auth user-token
     * @version 4
     *
     * @see [recommended-movies]{@link https://developer.themoviedb.org/v4/reference/account-movie-recommendations}
     */
    movies: new TmdbClientEndpoint<
      {
        account_id: string;
        language?: string;
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbMovieShort>
    >({
      method: HttpMethod.GET,
      url: '/account/:account_id/movie/recommendations?language=&page=',
      opts: {
        auth: 'token',
        version: 4,
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
     * Get a user's list of recommended TV shows.
     *
     * @auth user-token
     * @version 4
     *
     * @see [recommended-shows]{@link https://developer.themoviedb.org/v4/reference/account-tv-recommendations}
     */
    shows: new TmdbClientEndpoint<
      {
        account_id: string;
        language?: string;
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbShowShort>
    >({
      method: HttpMethod.GET,
      url: '/account/:account_id/tv/recommendations?language=&page=',
      opts: {
        auth: 'token',
        version: 4,
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
  watchlist: {
    /**
     * Get a user's movie watchlist.
     *
     * @auth user-token
     * @version 4
     *
     * @see [watchlist-movies]{@link https://developer.themoviedb.org/v4/reference/account-movie-watchlist}
     */
    movies: new TmdbClientEndpoint<
      {
        account_id: string;
        language?: string;
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbMovieShort>
    >({
      method: HttpMethod.GET,
      url: '/account/:account_id/movie/watchlist?language=&page=',
      opts: {
        auth: 'token',
        version: 4,
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
     * Get a user's TV watchlist.
     *
     * @auth user-token
     * @version 4
     *
     * @see [watchlist-shows]{@link https://developer.themoviedb.org/v4/reference/account-tv-watchlist}
     */
    shows: new TmdbClientEndpoint<
      {
        account_id: string;
        language?: string;
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbShowShort>
    >({
      method: HttpMethod.GET,
      url: '/account/:account_id/tv/watchlist?language=&page=',
      opts: {
        auth: 'token',
        version: 4,
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

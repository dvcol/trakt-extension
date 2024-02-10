import type { TmdbAccount } from '~/models/tmdb/tmdb-account.model';

import type { TmdbEpisodeRating } from '~/models/tmdb/tmdb-episode.model';
import type { TmdbListV3 } from '~/models/tmdb/tmdb-list.model';
import type { TmdbMovieRating, TmdbMovieShort } from '~/models/tmdb/tmdb-movie.model';

import type { TmdbShowRating, TmdbShowShort } from '~/models/tmdb/tmdb-show.model';

import { TmdbClientEndpoint, type TmdbPaginatedData, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 *  Account v3 Endpoint
 */
export const account = {
  /**
   * Get the details of an account.
   *
   * @auth session-id
   * @version 3
   *
   * @see [account-details]{@link https://developer.themoviedb.org/reference/account-details}
   */
  details: new TmdbClientEndpoint<
    {
      account_id: string | number;
      session_id?: string;
    },
    TmdbAccount
  >({
    method: 'GET',
    url: '/account/:account_id?session_id=',
    opts: {
      auth: 'session',
      version: 3,
      parameters: {
        path: {
          account_id: true,
        },
        query: {
          session_id: false,
        },
      },
    },
  }),
  favorite: {
    /**
     * Set a movie or TV show as a favorite.
     *
     * @auth session-id
     * @version 3
     *
     * @see [add-to-favorites]{@link https://developer.themoviedb.org/reference/account-add-favorite}
     */
    add: new TmdbClientEndpoint<{
      account_id: string | number;
      session_id?: string;

      media_type: 'movie' | 'tv';
      media_id: number;
      favorite: boolean;
    }>({
      method: 'POST',
      url: '/account/:account_id/favorite?session_id=',
      body: {
        media_type: true,
        media_id: true,
        favorite: false,
      },
      opts: {
        auth: 'session',
        version: 3,
        parameters: {
          path: {
            account_id: true,
          },
          query: {
            session_id: false,
          },
        },
      },
    }),
    /**
     * Get a user's list of favorite movies.
     *
     * @auth session-id
     * @version 3
     *
     * @see [get-favorite-movies]{@link https://developer.themoviedb.org/reference/account-get-favorites}
     */
    movies: new TmdbClientEndpoint<
      {
        account_id: string | number;
        session_id?: string;

        language?: string;
        sort_by?: 'created_at.asc' | 'created_at.desc';
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbMovieShort>
    >({
      method: 'GET',
      url: '/account/:account_id/favorite/movies?session_id=&language=&page=&sort_by=',
      opts: {
        auth: 'session',
        version: 3,
        parameters: {
          path: {
            account_id: true,
          },
          query: {
            session_id: false,
            language: false,
            page: false,
            sort_by: false,
          },
        },
      },
    }),
    /**
     * Get a user's list of favorite TV shows.
     *
     * @auth session-id
     * @version 3
     *
     * @see [get-favorite-tv-shows]{@link https://developer.themoviedb.org/reference/account-favorite-tv}
     */
    tv: new TmdbClientEndpoint<
      {
        account_id: string | number;
        session_id?: string;

        language?: string;
        sort_by?: 'created_at.asc' | 'created_at.desc';
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbShowShort>
    >({
      method: 'GET',
      url: '/account/:account_id/favorite/tv?session_id=&language=&page=&sort_by=',
      opts: {
        auth: 'session',
        version: 3,
        parameters: {
          path: {
            account_id: true,
          },
          query: {
            session_id: false,
            language: false,
            page: false,
            sort_by: false,
          },
        },
      },
    }),
  },
  watchlist: {
    /**
     * Add a movie or TV show to your watchlist.
     *
     * @auth session-id
     * @version 3
     *
     * @see [add-to-watchlist]{@link https://developer.themoviedb.org/reference/account-add-to-watchlist}
     */
    add: new TmdbClientEndpoint<{
      account_id: string | number;
      session_id?: string;

      media_type: 'movie' | 'tv';
      media_id: number;
      watchlist: boolean;
    }>({
      method: 'POST',
      url: '/account/:account_id/watchlist',
      body: {
        media_type: true,
        media_id: true,
        watchlist: false,
      },
      opts: {
        auth: 'session',
        version: 3,
        parameters: {
          path: {
            account_id: true,
          },
          query: {
            session_id: false,
          },
        },
      },
    }),
    /**
     * Get a user's movie watchlist.
     *
     * @auth session-id
     * @version 3
     *
     * @see [get-watchlist-movies]{@link https://developer.themoviedb.org/reference/account-watchlist-movies}
     */
    movies: new TmdbClientEndpoint<
      {
        account_id: string | number;
        session_id?: string;

        language?: string;
        sort_by?: 'created_at.asc' | 'created_at.desc';
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbMovieShort>
    >({
      method: 'GET',
      url: '/account/:account_id/watchlist/movies?session_id=&language=&page=&sort_by=',
      opts: {
        auth: 'session',
        version: 3,
        parameters: {
          path: {
            account_id: true,
          },
          query: {
            session_id: false,
            language: false,
            page: false,
            sort_by: false,
          },
        },
      },
    }),
    tv: new TmdbClientEndpoint<
      {
        account_id: string | number;
        session_id?: string;

        language?: string;
        sort_by?: 'created_at.asc' | 'created_at.desc';
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbShowShort>
    >({
      method: 'GET',
      url: '/account/:account_id/watchlist/tv?session_id=&language=&page=&sort_by=',
      opts: {
        auth: 'session',
        version: 3,
        parameters: {
          path: {
            account_id: true,
          },
          query: {
            session_id: false,
            language: false,
            page: false,
            sort_by: false,
          },
        },
      },
    }),
  },
  rated: {
    /**
     * Get a user's list of rated movies.
     *
     * @auth session-id
     * @version 3
     *
     * @see [get-rated-movies]{@link https://developer.themoviedb.org/reference/account-rated-movies}
     */
    movies: new TmdbClientEndpoint<
      {
        account_id: string | number;
        session_id?: string;

        language?: string;
        sort_by?: 'created_at.asc' | 'created_at.desc';
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbMovieRating>
    >({
      method: 'GET',
      url: '/account/:account_id/rated/movies?session_id=&language=&page=&sort_by=',
      opts: {
        auth: 'session',
        version: 3,
        parameters: {
          path: {
            account_id: true,
          },
          query: {
            session_id: false,
            language: false,
            page: false,
            sort_by: false,
          },
        },
      },
    }),
    /**
     * Get a user's list of rated TV shows.
     *
     * @auth session-id
     * @version 3
     *
     * @see [get-rated-tv-shows]{@link https://developer.themoviedb.org/reference/account-rated-movies}
     */
    tv: new TmdbClientEndpoint<
      {
        account_id: string | number;
        session_id?: string;

        language?: string;
        sort_by?: 'created_at.asc' | 'created_at.desc';
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbShowRating>
    >({
      method: 'GET',
      url: '/account/:account_id/rated/tv?session_id=&language=&page=&sort_by=',
      opts: {
        auth: 'session',
        version: 3,
        parameters: {
          path: {
            account_id: true,
          },
          query: {
            session_id: false,
            language: false,
            page: false,
            sort_by: false,
          },
        },
      },
    }),
    /**
     * Get a user's list of rated TV show episodes.
     *
     * @auth session-id
     * @version 3
     *
     * @see [get-rated-tv-episodes]{@link https://developer.themoviedb.org/reference/account-rated-tv-episodes}
     */
    episodes: new TmdbClientEndpoint<
      {
        account_id: string | number;
        session_id?: string;

        language?: string;
        sort_by?: 'created_at.asc' | 'created_at.desc';
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbEpisodeRating>
    >({
      method: 'GET',
      url: '/account/:account_id/rated/tv/episodes?session_id=&language=&page=&sort_by=',
      opts: {
        auth: 'session',
        version: 3,
        parameters: {
          path: {
            account_id: true,
          },
          query: {
            session_id: false,
            language: false,
            page: false,
            sort_by: false,
          },
        },
      },
    }),
  },
  /**
   * Get the lists created by a user.
   *
   * @auth session-id
   * @version 3
   *
   * @see [get-lists]{@link https://developer.themoviedb.org/reference/account-lists}
   */
  lists: new TmdbClientEndpoint<
    {
      account_id: string | number;
      session_id?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbListV3>
  >({
    method: HttpMethod.GET,
    url: '/account/:account_id/lists?page=&session_id=',
    opts: {
      auth: 'session',
      version: 3,
      parameters: {
        path: {
          account_id: true,
        },
        query: {
          page: false,
          session_id: false,
        },
      },
    },
  }),
};

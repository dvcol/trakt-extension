import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TmdbMovieShort } from '~/models/tmdb/tmdb-movie.model';

import type { TmdbPersonKnownFor } from '~/models/tmdb/tmdb-person.model';
import type { TmdbShowShort } from '~/models/tmdb/tmdb-show.model';

import { TmdbClientEndpoint, type TmdbPaginatedData, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';

/**
 * Trending v3 API endpoints.
 */
export const trending = {
  /**
   * Get the trending movies, TV shows and people.
   *
   * This call is similar to how the multi search works in the sense that we return multiple media types (movies, TV shows and people) in a single call to get the most trending data on the entirety of TMDB.
   *
   * If you would like to only get the trending data by a specific media type, use one of the specific methods:
   *
   * * [Trending movies]{@link https://developer.themoviedb.org/reference/trending-movies}
   * * [Trending TV shows]{@link https://developer.themoviedb.org/reference/trending-tv}
   * * [Trending people]{@link https://developer.themoviedb.org/reference/trending-people}
   */
  all: new TmdbClientEndpoint<
    {
      time_window: 'day' | 'week';
      /** ISO-639-1-ISO-3166-1 code. e.g. en-US */
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort | TmdbShowShort | TmdbPersonKnownFor>
  >({
    method: HttpMethod.GET,
    url: '/trending/all/:time_window?language=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          time_window: true,
        },
        query: {
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get the trending movies on TMDB.
   *
   * @version 3
   *
   * @see [trending-tv]{@link https://developer.themoviedb.org/reference/trending-movies}
   */
  movie: new TmdbClientEndpoint<
    {
      time_window: 'day' | 'week';
      /** ISO-639-1-ISO-3166-1 code. e.g. en-US */
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort>
  >({
    method: HttpMethod.GET,
    url: '/trending/movie/:time_window?language=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          time_window: true,
        },
        query: {
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get the trending people on TMDB.
   *
   * @version 3
   *
   * @see [trending-people]{@link https://developer.themoviedb.org/reference/trending-people}
   */
  people: new TmdbClientEndpoint<
    {
      time_window: 'day' | 'week';
      /** ISO-639-1-ISO-3166-1 code. e.g. en-US */
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbPersonKnownFor>
  >({
    method: HttpMethod.GET,
    url: '/trending/person/:time_window?language=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          time_window: true,
        },
        query: {
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get the trending TV shows on TMDB.
   *
   * @version 3
   *
   * @see [trending-tv]{@link https://developer.themoviedb.org/reference/trending-tv}
   */
  tv: new TmdbClientEndpoint<
    {
      time_window: 'day' | 'week';
      /** ISO-639-1-ISO-3166-1 code. e.g. en-US */
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbShowShort>
  >({
    method: HttpMethod.GET,
    url: '/trending/tv/:time_window?language=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          time_window: true,
        },
        query: {
          language: false,
          page: false,
        },
      },
    },
  }),
};

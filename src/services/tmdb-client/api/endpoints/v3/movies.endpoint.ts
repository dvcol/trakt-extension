import type { TmdbMovieExtended, TmdbMovieShort } from '~/models/tmdb/tmdb-movie.model';

import { TmdbClientEndpoint, type TmdbPaginatedData, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Movies v3 endpoints.
 */
export const movies = {
  /**
   * Get a list of movies that are currently in theatres.
   *
   * * <b>Note:</b>
   *
   * This call is really just a discover call behind the scenes.
   * If you would like to tweak any of the default filters head over and read about [discover]{@link https://developer.themoviedb.org/reference/discover-movie}.
   *
   * @version 3
   *
   * @see [now-playing]{@link https://developer.themoviedb.org/reference/movie-now-playing-list}
   */
  playing: new TmdbClientEndpoint<
    {
      language?: string;
      /** ISO-3166-1 country code */
      region?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort, { dates: { maximum: string; minimum: string } }>
  >({
    method: HttpMethod.GET,
    url: '/movie/now_playing?language=&region=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          language: false,
          region: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get a list of movies ordered by popularity.
   *
   * * <b>Note:</b>
   *
   * This call is really just a discover call behind the scenes.
   * If you would like to tweak any of the default filters head over and read about [discover]{@link https://developer.themoviedb.org/reference/discover-movie}.
   *
   * @version 3
   *
   * @see [popular]{@link https://developer.themoviedb.org/reference/movie-popular-list}
   */
  popular: new TmdbClientEndpoint<
    {
      language?: string;
      /** ISO-3166-1 country code */
      region?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort>
  >({
    method: HttpMethod.GET,
    url: '/movie/popular?language=&region=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          language: false,
          region: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get a list of movies ordered by rating.
   *
   * * <b>Note:</b>
   *
   * This call is really just a discover call behind the scenes.
   * If you would like to tweak any of the default filters head over and read about [discover]{@link https://developer.themoviedb.org/reference/discover-movie}.
   *
   * @version 3
   *
   * @see [top-rated]{@link https://developer.themoviedb.org/reference/movie-top-rated-list}
   */
  top: new TmdbClientEndpoint<
    {
      language?: string;
      /** ISO-3166-1 country code */
      region?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort>
  >({
    method: HttpMethod.GET,
    url: '/movie/top_rated?language=&region=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          language: false,
          region: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get a list of movies that are being released soon.
   *
   * * <b>Note:</b>
   *
   * This call is really just a discover call behind the scenes.
   * If you would like to tweak any of the default filters head over and read about [discover]{@link https://developer.themoviedb.org/reference/discover-movie}.
   *
   * @version 3
   *
   * @see [upcoming]{@link https://developer.themoviedb.org/reference/movie-upcoming-list}
   */
  upcoming: new TmdbClientEndpoint<
    {
      language?: string;
      /** ISO-3166-1 country code */
      region?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort, { dates: { maximum: string; minimum: string } }>
  >({
    method: HttpMethod.GET,
    url: '/movie/upcoming?language=&region=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          language: false,
          region: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get the top level details of a movie by ID.
   *
   * * <b>Append To Response:</b>
   *
   * This method supports using append_to_response.
   * It is an easy and efficient way to append extra requests to any top level namespace.
   * This makes it possible to make sub requests within the same namespace in a single HTTP request.
   * Each request will get appended to the response as a new JSON object.
   *
   * Read more about this [here]{@link https://developer.themoviedb.org/docs/append-to-response}.
   *
   * @version 3
   *
   * @see [get-movie-details]{@link https://developer.themoviedb.org/reference/movie-details}
   */
  details: new TmdbClientEndpoint<
    {
      movie_id: string | number;

      /** comma separated list of endpoints within this namespace, 20 items max */
      append_to_response?: string | string[];
      language?: string;
    },
    TmdbMovieExtended
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id?append_to_response=&language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
        },
        query: {
          append_to_response: false,
          language: false,
        },
      },
    },
    transform: params => (Array.isArray(params.append_to_response) ? { ...params, append_to_response: params.append_to_response.join(',') } : params),
  }),
};

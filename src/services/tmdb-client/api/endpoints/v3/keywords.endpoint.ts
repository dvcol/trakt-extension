import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TmdbKeyword } from '~/models/tmdb/tmdb-entity.model';

import type { TmdbMovieShort } from '~/models/tmdb/tmdb-movie.model';

import { TmdbClientEndpoint, type TmdbPaginatedData, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';

/**
 * Keywords v3 endpoints.
 */
export const keywords = {
  /**
   * Get the details of a keyword by id.
   *
   * @version 3
   *
   * @see [keyword-details]{@link https://developer.themoviedb.org/reference/keyword-details}
   */
  details: new TmdbClientEndpoint<
    {
      keyword_id: number | string;
    },
    TmdbKeyword
  >({
    method: HttpMethod.GET,
    url: '/keyword/:keyword_id',
    opts: {
      version: 3,
      parameters: {
        path: {
          keyword_id: true,
        },
      },
    },
  }),
  /**
   * Get the movies for a keyword id.
   *
   * @deprecated This method is deprecated, you should use [/discover/movie]{@link https://developer.themoviedb.org/reference/discover-movie} instead.
   *
   * @version 3
   *
   * @see [keyword-movies]{@link https://developer.themoviedb.org/reference/keyword-movies}
   */
  movies: new TmdbClientEndpoint<
    {
      keyword_id: number | string;

      include_adult?: boolean;
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort>
  >({
    method: HttpMethod.GET,
    url: '/keyword/:keyword_id/movies?include_adult=&language=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          keyword_id: true,
        },
        query: {
          include_adult: false,
          language: false,
          page: false,
        },
      },
    },
  }),
};

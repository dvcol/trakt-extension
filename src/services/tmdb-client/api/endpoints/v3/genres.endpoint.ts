import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import { TmdbClientEndpoint } from '~/models/tmdb/tmdb-client.model';

/**
 * Genres v3 endpoints.
 */
export const genres = {
  /**
   * Get the list of official genres for movies.
   *
   * @version 3
   *
   * @see [genre-movie-list]{@link https://developer.themoviedb.org/reference/genre-movie-list}
   */
  movie: new TmdbClientEndpoint<
    {
      language?: string;
    },
    {
      id: number;
      name: string;
    }[]
  >({
    method: HttpMethod.GET,
    url: '/genre/movie/list?language=',
    opts: {
      version: 3,
      parameters: {
        query: {
          language: false,
        },
      },
    },
  }),
  /**
   * Get the list of official genres for TV shows.
   *
   * @version 3
   *
   * @see [genre-tv-list]{@link https://developer.themoviedb.org/reference/genre-tv-list}
   */
  tv: new TmdbClientEndpoint<
    {
      language?: string;
    },
    {
      id: number;
      name: string;
    }[]
  >({
    method: HttpMethod.GET,
    url: '/genre/tv/list?language=',
    opts: {
      version: 3,
      parameters: {
        query: {
          language: false,
        },
      },
    },
  }),
};

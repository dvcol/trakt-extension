import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TvdbStatus } from '~/models/tvdb/tvdb-entity.model';
import type { TvdbLanguage } from '~/models/tvdb/tvdb-language.model';
import type { TvdbMovieExtended, TvdbMovieShort } from '~/models/tvdb/tvdb-movie.model';

import { TvdbClientEndpoint, type TvdbPaginatedData, type TvdbParamPagination } from '~/models/tvdb/tvdb-client.model';

/**
 * Movies Endpoint
 *
 * @see [movies]{@link https://thetvdb.github.io/v4-api/#/Movies}
 */
export const movies = {
  /**
   * Returns a paginated list of movie records.
   *
   * @auth required
   *
   * @see [get-all-movies]{@link https://thetvdb.github.io/v4-api/#/Movies/getAllMovie}
   */
  list: new TvdbClientEndpoint<TvdbParamPagination, TvdbPaginatedData<TvdbMovieShort>>({
    method: HttpMethod.GET,
    url: '/movies?page=',
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
   * Returns a single movie record.
   *
   * @auth required
   *
   * @see [get-movie]{@link https://thetvdb.github.io/v4-api/#/Movies/getMovieBase}
   */
  get: new TvdbClientEndpoint<
    {
      id: number | string;
    },
    TvdbMovieShort
  >({
    method: HttpMethod.GET,
    url: '/movies/:id',
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
   * Returns an extended movie record.
   *
   * @auth required
   *
   * @see [get-movie-extended]{@link https://thetvdb.github.io/v4-api/#/Movies/getMovieExtended}
   */
  extended: new TvdbClientEndpoint<
    {
      id: number | string;
      /** The meta field can be used to request translations. */
      meta?: boolean | 'translations';
      /** This reduce the payload and returns the shorten version of this record without characters, artworks and trailers. */
      short?: boolean;
    },
    TvdbMovieExtended
  >({
    method: HttpMethod.GET,
    url: '/movies/:id/extended?meta=&short=',
    opts: {
      auth: true,
      parameters: {
        path: {
          id: true,
        },
        query: {
          meta: false,
          short: false,
        },
      },
    },
    transform: params => ({ ...params, meta: params.meta ? 'translations' : undefined }),
  }),
  /**
   * Search for movies based on the provided query parameters.
   *
   * @auth required
   *
   * @see [get-movies-filter]{@link https://thetvdb.github.io/v4-api/#/Movies/getMoviesFilter}
   */
  filter: new TvdbClientEndpoint<
    {
      /** The original language */
      lang: string;
      /** The country of origin */
      country: string;
      /**
       * The genre category (between 1 and 36)
       * @see [genre]{@link https://thetvdb.github.io/v4-api/#/Genres/getAllGenres}
       */
      genres?: number;
      /** The production company */
      company?: number;
      /** The content rating id based on country */
      contentRating?: number;
      /** Sorts the results */
      sort?: 'score' | 'firstAired' | 'name';
      status?: 1 | 2 | 3;
      year?: number;
    },
    TvdbMovieShort[]
  >({
    method: HttpMethod.GET,
    url: '/movies/filter?lang=&country=&genres=&company=&contentRating=&sort=&status=&year=',
    opts: {
      auth: true,
      parameters: {
        query: {
          lang: true,
          country: true,
          genres: false,
          company: false,
          contentRating: false,
          sort: false,
          status: false,
          year: false,
        },
      },
    },
  }),
  /**
   * Returns a movie record that match the provided slug.
   *
   * @auth required
   *
   * @see [get-movie-by-slug]{@link https://thetvdb.github.io/v4-api/#/Movies/getMovieBaseBySlug}
   */
  slug: new TvdbClientEndpoint<
    {
      slug: string;
    },
    TvdbMovieShort
  >({
    method: HttpMethod.GET,
    url: '/movies/slug/:slug',
    opts: {
      auth: true,
      parameters: {
        path: {
          slug: true,
        },
      },
    },
  }),
  /**
   * Returns a movie translation record.
   *
   * @auth required
   *
   * @see [get-movie-translation]{@link https://thetvdb.github.io/v4-api/#/Movies/getMovieTranslation}
   */
  translations: new TvdbClientEndpoint<
    {
      id: number | string;
      language: string;
    },
    TvdbLanguage
  >({
    method: HttpMethod.GET,
    url: '/movies/:id/translations/:language',
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
  /**
   * Returns a list of movie status records.
   *
   * @auth required
   *
   * @see [get-movie-statuses]{@link https://thetvdb.github.io/v4-api/#/Movie%20Statuses/getAllMovieStatuses}
   */
  statuses: new TvdbClientEndpoint<Record<string, never>, TvdbStatus[]>({
    method: HttpMethod.GET,
    url: '/movies/statuses',
    opts: {
      auth: true,
    },
  }),
};

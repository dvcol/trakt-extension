import type { TmdbSearchCollection } from '~/models/tmdb/tmdb-collection.model';

import type { TmdbCompanyShort } from '~/models/tmdb/tmdb-company.model';
import type { TmdbKeyword } from '~/models/tmdb/tmdb-entity.model';
import type { TmdbMovieShort } from '~/models/tmdb/tmdb-movie.model';
import type { TmdbPersonKnownFor } from '~/models/tmdb/tmdb-person.model';
import type { TmdbShowShort } from '~/models/tmdb/tmdb-show.model';

import { TmdbClientEndpoint, type TmdbPaginatedData, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Search v3 endpoints.
 */
export const search = {
  /**
   * Search for collections by their original, translated and alternative names.
   *
   * @version 3
   *
   * @see [search-collections]{@link https://developer.themoviedb.org/reference/search-collection}
   */
  collection: new TmdbClientEndpoint<
    {
      query: string;
      include_adult?: boolean;
      language?: string;
      region?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbSearchCollection>
  >({
    method: HttpMethod.GET,
    url: '/search/collection?query=&include_adult=&language=&region=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          query: true,
          include_adult: false,
          language: false,
          region: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Search for companies by their original and alternative names.
   *
   * @version 3
   *
   * @see [search-companies]{@link https://developer.themoviedb.org/reference/search-company}
   */
  company: new TmdbClientEndpoint<
    {
      query: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbCompanyShort>
  >({
    method: HttpMethod.GET,
    url: '/search/company?query=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          query: true,
          page: false,
        },
      },
    },
  }),
  /**
   * Search for keywords by their name.
   *
   * @version 3
   *
   * @see [search-keywords]{@link https://developer.themoviedb.org/reference/search-keyword}
   */
  keyword: new TmdbClientEndpoint<
    {
      query: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbKeyword>
  >({
    method: HttpMethod.GET,
    url: '/search/keyword?query=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          query: true,
          page: false,
        },
      },
    },
  }),
  /**
   * Search for movies by their original, translated and alternative titles.
   *
   * @version 3
   *
   * @see [search-movies]{@link https://developer.themoviedb.org/reference/search-movie}
   */
  movie: new TmdbClientEndpoint<
    {
      query: string;
      include_adult?: boolean;
      language?: string;
      primary_release_year?: number;
      region?: string;
      year?: number;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort>
  >({
    method: HttpMethod.GET,
    url: '/search/movie?query=&include_adult=&language=&primary_release_year=&region=&year=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          query: true,
          include_adult: false,
          language: false,
          primary_release_year: false,
          region: false,
          year: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Use multi search when you want to search for movies, TV shows and people in a single request.
   *
   * @version 3
   *
   * @see [search-multi]{@link https://developer.themoviedb.org/reference/search-multi}
   */
  multi: new TmdbClientEndpoint<
    {
      query: string;
      include_adult?: boolean;
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort | TmdbShowShort | TmdbPersonKnownFor>
  >({
    method: HttpMethod.GET,
    url: '/search/multi?query=&include_adult=&language=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          query: true,
          include_adult: false,
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Search for people by their name and also known as names.
   */
  person: new TmdbClientEndpoint<
    {
      query: string;
      include_adult?: boolean;
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbPersonKnownFor>
  >({
    method: HttpMethod.GET,
    url: '/search/person?query=&include_adult=&language=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          query: true,
          include_adult: false,
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Search for TV shows by their original, translated and also known as names.
   *
   * @version 3
   *
   * @see [search-tv]{@link https://developer.themoviedb.org/reference/search-tv}
   */
  tv: new TmdbClientEndpoint<
    {
      query: string;
      /** Search only the first air date. Valid values are: 1000..9999 */
      first_air_date_year?: number;
      include_adult?: boolean;
      language?: string;
      /** Search the first air date and all episode air dates. Valid values are: 1000..9999 */
      year?: number;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbShowShort>
  >({
    method: HttpMethod.GET,
    url: '/search/tv?query=&first_air_date_year=&include_adult=&language=&year=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          query: true,
          first_air_date_year: false,
          include_adult: false,
          language: false,
          year: false,
          page: false,
        },
      },
    },
  }),
};

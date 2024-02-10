import type { TmdbDiscoverMovieQuery, TmdbDiscoverTvQuery } from '~/models/tmdb/tmdb-discover.model';

import type { TmdbMovieShort } from '~/models/tmdb/tmdb-movie.model';

import type { TmdbShowShort } from '~/models/tmdb/tmdb-show.model';

import { TmdbClientEndpoint, type TmdbPaginatedData, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Discover v3 API endpoints.
 */
export const discover = {
  /**
   * Find movies using over 30 filters and sort options.
   *
   * * <b>Advanced Filtering</b>
   *
   * If you specify the region parameter, the regional release date will be used instead of the primary release date.
   * The date returned will be the first date based on your query (ie. if a with_release_type is specified).
   * It's important to note the order of the release types that are used.
   * Specifying 2|3 would return the limited theatrical release date as opposed to 3|2 which would return the theatrical date.
   *
   * * <b>AND/OR Logic</b>
   *
   * Also note that a number of filters support being comma (,) or pipe (|) separated.
   * Comma's are treated like an AND query while pipe's are treated like an OR.
   * This allows for quite complex filtering depending on your desired results.
   *
   * @version 3
   *
   * @see [discover-movies]{@link https://developer.themoviedb.org/reference/discover-movie}
   */
  movie: new TmdbClientEndpoint<TmdbDiscoverMovieQuery & TmdbParamPagination, TmdbPaginatedData<TmdbMovieShort>>({
    method: HttpMethod.GET,
    url:
      '/discover/movie' +
      '?certification=' +
      '&certification.gte=' +
      '&certification.lte=' +
      '&certification_country=' +
      '&include_adult=' +
      '&include_video=' +
      '&language=' +
      '&primary_release_year=' +
      '&primary_release_date.gte=' +
      '&primary_release_date.lte=' +
      '&region=&release_date.gte=' +
      '&release_date.lte=&sort_by=' +
      '&vote_average.gte=' +
      '&vote_average.lte=' +
      '&vote_count.gte=' +
      '&vote_count.lte=' +
      '&watch_region=' +
      '&with_cast=' +
      '&with_companies=' +
      '&with_crew=' +
      '&with_genres=' +
      '&with_keywords=' +
      '&with_origin_country=' +
      '&with_original_language=' +
      '&with_people=' +
      '&with_release_type=' +
      '&with_runtime.gte=' +
      '&with_runtime.lte=' +
      '&with_watch_monetization_types=' +
      '&with_watch_providers=' +
      '&without_companies=' +
      '&without_genres=' +
      '&without_keywords=' +
      '&without_watch_providers=' +
      '&year=' +
      '&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          certification: false,
          'certification.gte': false,
          'certification.lte': false,
          certification_country: false,
          include_adult: false,
          include_video: false,
          language: false,
          primary_release_year: false,
          'primary_release_date.gte': false,
          'primary_release_date.lte': false,
          region: false,
          'release_date.gte': false,
          'release_date.lte': false,
          sort_by: false,
          'vote_average.gte': false,
          'vote_average.lte': false,
          'vote_count.gte': false,
          'vote_count.lte': false,
          watch_region: false,
          with_cast: false,
          with_companies: false,
          with_crew: false,
          with_genres: false,
          with_keywords: false,
          with_origin_country: false,
          with_original_language: false,
          with_people: false,
          with_release_type: false,
          'with_runtime.gte': false,
          'with_runtime.lte': false,
          with_watch_monetization_types: false,
          with_watch_providers: false,
          without_companies: false,
          without_genres: false,
          without_keywords: false,
          without_watch_providers: false,
          year: false,
          page: false,
        },
      },
    },
  }),

  /**
   * Find movies using over 30 filters and sort options.
   *
   * * <b>Advanced Filtering</b>
   *
   * If you specify the region parameter, the regional release date will be used instead of the primary release date.
   * The date returned will be the first date based on your query (ie. if a with_release_type is specified).
   * It's important to note the order of the release types that are used.
   * Specifying 2|3 would return the limited theatrical release date as opposed to 3|2 which would return the theatrical date.
   *
   * * <b>AND/OR Logic</b>
   *
   * Also note that a number of filters support being comma (,) or pipe (|) separated.
   * Comma's are treated like an AND query while pipe's are treated like an OR.
   * This allows for quite complex filtering depending on your desired results.
   *
   * @version 3
   *
   * @see [discover-movies]{@link https://developer.themoviedb.org/reference/discover-tv}
   */
  tv: new TmdbClientEndpoint<TmdbDiscoverTvQuery & TmdbParamPagination, TmdbPaginatedData<TmdbShowShort>>({
    method: HttpMethod.GET,
    url:
      '/discover/tv' +
      '?air_date.gte=' +
      '&air_date.lte=' +
      '&first_air_date_year=' +
      '&first_air_date.gte=' +
      '&first_air_date.lte=' +
      '&include_adult=' +
      '&include_null_first_air_dates=' +
      '&language=' +
      '&screened_theatrically=' +
      '&sort_by=' +
      '&timezone=' +
      '&vote_average.gte=' +
      '&vote_average.lte=' +
      '&vote_count.gte=' +
      '&vote_count.lte=' +
      '&watch_region=' +
      '&with_companies=' +
      '&with_genres=' +
      '&with_keywords=' +
      '&with_networks=' +
      '&with_origin_country=' +
      '&with_original_language=' +
      '&with_runtime.gte=' +
      '&with_runtime.lte=' +
      '&with_status=' +
      '&with_watch_monetization_types=' +
      '&with_watch_providers=' +
      '&without_companies=' +
      '&without_genres=' +
      '&without_keywords=' +
      '&without_watch_providers=' +
      '&with_types=' +
      '&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          'air_date.gte': false,
          'air_date.lte': false,
          first_air_date_year: false,
          'first_air_date.gte': false,
          'first_air_date.lte': false,
          include_adult: false,
          include_null_first_air_dates: false,
          language: false,
          screened_theatrically: false,
          sort_by: false,
          timezone: false,
          'vote_average.gte': false,
          'vote_average.lte': false,
          'vote_count.gte': false,
          'vote_count.lte': false,
          watch_region: false,
          with_companies: false,
          with_genres: false,
          with_keywords: false,
          with_networks: false,
          with_origin_country: false,
          with_original_language: false,
          'with_runtime.gte': false,
          'with_runtime.lte': false,
          with_status: false,
          with_watch_monetization_types: false,
          with_watch_providers: false,
          without_companies: false,
          without_genres: false,
          without_keywords: false,
          without_watch_providers: false,
          with_type: false,
          page: false,
        },
      },
    },
  }),
};

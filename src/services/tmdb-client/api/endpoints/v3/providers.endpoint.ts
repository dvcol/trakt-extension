import type { TmdbConfigurationCounty } from '~/models/tmdb/tmdb-configuration.model';

import type { TmdbProviderExtended } from '~/models/tmdb/tmdb-provider.model';

import { TmdbClientEndpoint } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Providers v3 endpoints.
 */
export const providers = {
  /**
   * Get the list of the countries we have watch provider (OTT/streaming) data for.
   *
   * @version 3
   *
   * @see [region-providers]{@link https://developer.themoviedb.org/reference/watch-providers-available-regions}
   */
  regions: new TmdbClientEndpoint<
    {
      language?: string;
    },
    TmdbConfigurationCounty[]
  >({
    method: HttpMethod.GET,
    url: '/watch/providers/regions?language=',
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
   * Get the list of streaming providers we have for movies.
   *
   * Returns a list of the watch provider (OTT/streaming) data we have available for movies. You can specify a watch_region param if you want to further filter the list by country. The results are localized.
   *
   * @version 3
   *
   * @see [movie-providers]{@link https://developer.themoviedb.org/reference/watch-providers-movie-list}
   */
  movies: new TmdbClientEndpoint<
    {
      language?: string;
      watch_region?: string;
    },
    TmdbProviderExtended
  >({
    method: HttpMethod.GET,
    url: '/watch/providers/movie?language=&watch_region=',
    opts: {
      version: 3,
      parameters: {
        query: {
          language: false,
          watch_region: false,
        },
      },
    },
  }),
  /**
   * Get the list of streaming providers we have for TV shows.
   *
   * Returns a list of the watch provider (OTT/streaming) data we have available for TV shows. You can specify a watch_region param if you want to further filter the list by country.
   *
   * @version 3
   *
   * @see [tv-providers]{@link https://developer.themoviedb.org/reference/watch-provider-tv-list}
   */
  tv: new TmdbClientEndpoint<
    {
      language?: string;
      watch_region?: string;
    },
    TmdbProviderExtended
  >({
    method: HttpMethod.GET,
    url: '/watch/providers/tv?language=&watch_region=',
    opts: {
      version: 3,
      parameters: {
        query: {
          language: false,
          watch_region: false,
        },
      },
    },
  }),
};

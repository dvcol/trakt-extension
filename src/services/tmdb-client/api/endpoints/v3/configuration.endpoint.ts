import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type {
  TmdbConfiguration,
  TmdbConfigurationCounty,
  TmdbConfigurationJobs,
  TmdbConfigurationTimezones,
} from '~/models/tmdb/tmdb-configuration.model';

import type { TmdbLanguage } from '~/models/tmdb/tmdb-entity.model';

import { TmdbClientEndpoint } from '~/models/tmdb/tmdb-client.model';

/**
 * Configuration v3 endpoints.
 */
export const configuration = {
  /**
   * Query the API configuration details.
   *
   * The data returned here in the configuration endpoint is designed to provide some of the required information you'll need as you integrate our API.
   *
   * For example, you can get a list of valid image sizes and the valid image address.
   *
   * @version 3
   *
   * @see [configuration-details]{@link https://developer.themoviedb.org/reference/configuration-details}
   */
  details: new TmdbClientEndpoint<Record<string, never>, TmdbConfiguration>({
    method: HttpMethod.GET,
    url: '/configuration',
    opts: {
      version: 3,
    },
  }),
  /**
   * Get the list of countries (ISO 3166-1 tags) used throughout TMDB.
   *
   * @version 3
   *
   * @see [configuration-countries]{@link https://developer.themoviedb.org/reference/configuration-countries}
   */
  countries: new TmdbClientEndpoint<
    {
      language?: string;
    },
    TmdbConfigurationCounty[]
  >({
    method: HttpMethod.GET,
    url: '/configuration/countries?language=',
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
   * Get the list of the jobs and departments we use on TMDB.
   *
   * @version 3
   *
   * @see [configuration-jobs]{@link https://developer.themoviedb.org/reference/configuration-jobs}
   */
  jobs: new TmdbClientEndpoint<Record<string, never>, TmdbConfigurationJobs[]>({
    method: HttpMethod.GET,
    url: '/configuration/jobs',
    opts: {
      version: 3,
    },
  }),
  /**
   * Get the list of languages (ISO 639-1 tags) used throughout TMDB.
   *
   * @version 3
   *
   * @see [configuration-languages]{@link https://developer.themoviedb.org/reference/configuration-languages}
   */
  languages: new TmdbClientEndpoint<Record<string, never>, TmdbLanguage[]>({
    method: HttpMethod.GET,
    url: '/configuration/languages',
    opts: {
      version: 3,
    },
  }),
  /**
   * Get a list of the officially supported translations on TMDB.
   *
   * @version 3
   *
   * @see [configuration-translations]{@link https://developer.themoviedb.org/reference/configuration-primary-translations}
   */
  translations: new TmdbClientEndpoint<Record<string, never>, string[]>({
    method: HttpMethod.GET,
    url: '/configuration/primary_translations',
    opts: {
      version: 3,
    },
  }),
  timezones: new TmdbClientEndpoint<Record<string, never>, TmdbConfigurationTimezones>({
    method: HttpMethod.GET,
    url: '/configuration/timezones',
    opts: {
      version: 3,
    },
  }),
};

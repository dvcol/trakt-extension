import type { TmdbAccountSeasonStatus } from '~/models/tmdb/tmdb-account.model';
import type { TmdbChanges } from '~/models/tmdb/tmdb-change.model';
import type { TmdbAggregateCredits, TmdbShowCredits } from '~/models/tmdb/tmdb-credit.model';
import type { TmdbVideo } from '~/models/tmdb/tmdb-entity.model';
import type { TmdbImageShort } from '~/models/tmdb/tmdb-image.model';
import type { TmdbProviders } from '~/models/tmdb/tmdb-provider.model';
import type { TmdbSeasonExtended } from '~/models/tmdb/tmdb-season.model';

import type { TmdbTranslations } from '~/models/tmdb/tmdb-translation.model';

import { TmdbClientEndpoint, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Season v3 endpoints.
 */
export const seasons = {
  /**
   * Query the details of a TV season.
   *
   * This method supports using append_to_response. Read more about this [here]{@link https://developer.themoviedb.org/docs/append-to-response}.
   *
   * @version 3
   *
   * @see [tv-season-details]{@link https://developer.themoviedb.org/reference/tv-season-details}
   */
  details: new TmdbClientEndpoint<
    {
      series_id: string | number;
      season_number: number;

      /** comma separated list of endpoints within this namespace, 20 items max */
      append_to_response?: string | string[];
      language?: string;
    },
    TmdbSeasonExtended
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/season/:season_number?append_to_response=&language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
          season_number: true,
        },
        query: {
          append_to_response: false,
          language: false,
        },
      },
    },
    transform: params => (Array.isArray(params.append_to_response) ? { ...params, append_to_response: params.append_to_response.join(',') } : params),
  }),
  /**
   * Get the rating, watchlist and favourite status.
   *
   * @auth session-id
   *
   * @version 3
   *
   * @see [tv-season-account-states]{@link https://developer.themoviedb.org/reference/tv-season-account-states}
   */
  account: new TmdbClientEndpoint<
    {
      series_id: string | number;
      season_number: number;

      session_id?: string;
      guest_session_id?: string;
    },
    TmdbAccountSeasonStatus
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/season/:season_number/account_states?session_id=&guest_session_id=',
    opts: {
      version: 3,
      auth: 'session',
      parameters: {
        path: {
          series_id: true,
          season_number: true,
        },
        query: {
          session_id: false,
          guest_session_id: false,
        },
      },
    },
  }),
  credits: {
    /**
     * Get the aggregate credits (cast and crew) that have been added to a TV season.
     *
     * * <b>Note:</b>
     *
     * This call differs from the main credits call in that it does not return the newest season. Instead, it is a view of all the entire cast & crew for all episodes belonging to a TV show.
     *
     * @version 3
     *
     * @see [tv-season-aggregate-credits]{@link https://developer.themoviedb.org/reference/tv-season-aggregate-credits}
     */
    aggregate: new TmdbClientEndpoint<
      {
        series_id: string | number;
        season_number: number;

        language?: string;
      },
      TmdbAggregateCredits
    >({
      method: HttpMethod.GET,
      url: '/tv/:series_id/season/:season_number/aggregate_credits?language=',
      opts: {
        version: 3,
        parameters: {
          path: {
            series_id: true,
            season_number: true,
          },
          query: {
            language: false,
          },
        },
      },
    }),
    /**
     * Get the season credits for a TV show.
     *
     * @version 3
     *
     * @see [tv-season-credits]{@link https://developer.themoviedb.org/reference/tv-season-credits}
     */
    season: new TmdbClientEndpoint<
      {
        series_id: string | number;
        season_number: number;

        language?: string;
      },
      TmdbShowCredits
    >({
      method: HttpMethod.GET,
      url: '/tv/:series_id/season/:season_number/credits?language=',
      opts: {
        version: 3,
        parameters: {
          path: {
            series_id: true,
            season_number: true,
          },
          query: {
            language: false,
          },
        },
      },
    }),
  } /**
   * Get the recent changes for a TV season.
   *
   * Get the changes for a TV season.
   * By default only the last 24 hours are returned.
   *
   * You can query up to 14 days in a single query by using the start_date and end_date query parameters.
   *
   * * <b>Note:</b>
   *
   * TV season changes are a little different than movie changes in that there are some edits on episodes that will create a top level change entry at the season level.
   * These can be found under the episode keys.
   * These keys will contain a episode_id.
   * You can use the episode changes methods to look these up individually.
   *
   * @version 3
   *
   * @see [tv-season-changes]{@link https://developer.themoviedb.org/reference/tv-season-changes-by-id}
   */,
  changes: new TmdbClientEndpoint<
    {
      season_id: string | number;

      start_date?: string;
      end_date?: string;
    } & TmdbParamPagination,
    TmdbChanges
  >({
    method: HttpMethod.GET,
    url: '/tv/season/:season_id/changes?start_date=&end_date=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          season_id: true,
        },
        query: {
          start_date: false,
          end_date: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get a list of external IDs that have been added to a TV season.
   *
   * | Source   | Supported? |
   * | -------- | ---------- |
   * | TheTVDB  | ✅         |
   * | Wikidata | ✅         |
   *
   * @version 3
   *
   * @see [tv-season-external-ids]{@link https://developer.themoviedb.org/reference/tv-season-external-ids}
   */
  external: new TmdbClientEndpoint<
    {
      series_id: string | number;
      season_number: number;
    },
    {
      id: number;
      freebase_mid: string;
      freebase_id: string;
      tvdb_id: number;
      tvrage_id: number;
      wikidata_id: string;
    }
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/season/:season_number/external_ids',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
          season_number: true,
        },
      },
    },
  }),
  /**
   * Get the images that belong to a TV season.
   *
   * This method will return the posters that have been added to a TV season.
   *
   * * <b>Note:</b>
   *
   * If you have a language specified, it will act as a filter on the returned items.
   * You can use the include_image_language param to query additional languages.
   *
   * @version 3
   *
   * @see [tv-season-images]{@link https://developer.themoviedb.org/reference/tv-season-images}
   */
  images: new TmdbClientEndpoint<
    {
      series_id: string | number;
      season_number: number;

      /** filter the list results by language, supports more than one value by using a comma separated list */
      include_image_language?: string | string[];
      language?: string;
    },
    { id: number; posters: TmdbImageShort[] }
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/season/:season_number/images?include_image_language=&language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
          season_number: true,
        },
        query: {
          include_image_language: false,
          language: false,
        },
      },
    },
    transform: params =>
      Array.isArray(params.include_image_language) ? { ...params, include_image_language: params.include_image_language.join(',') } : params,
  }),
  /**
   * Get the translations for a TV season.
   *
   * Take a read through our [language]{@link https://developer.themoviedb.org/docs/languages} documentation for more information about languages on TMDB.
   *
   * @version 3
   *
   * @see [tv-season-translations]{@link https://developer.themoviedb.org/reference/tv-season-translations}
   */
  translations: new TmdbClientEndpoint<
    {
      series_id: string | number;
      season_number: number;
    },
    TmdbTranslations<{
      name: string;
      overview: string;
    }>
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/season/:season_number/translations',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
          season_number: true,
        },
      },
    },
  }),
  /**
   * Get the videos that belong to a TV season.
   *
   * @version 3
   *
   * @see [tv-season-videos]{@link https://developer.themoviedb.org/reference/tv-season-videos}
   */
  videos: new TmdbClientEndpoint<
    {
      series_id: string | number;
      season_number: number;

      /** filter the list results by language, supports more than one value by using a comma separated list */
      include_video_language?: string | string[];
      language?: string;
    },
    {
      id: number;
      results: TmdbVideo[];
    }
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/season/:season_number/videos?include_video_language=&language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
          season_number: true,
        },
        query: {
          include_video_language: false,
          language: false,
        },
      },
    },
    transform: params =>
      Array.isArray(params.include_video_language) ? { ...params, include_video_language: params.include_video_language.join(',') } : params,
  }),
  /**
   * Get the list of streaming providers we have for a TV season.
   *
   * Powered by our partnership with JustWatch, you can query this method to get a list of the streaming/rental/purchase availabilities per country by provider.
   *
   * This is not going to return full deep links, but rather, it's just enough information to display what's available where.
   *
   * You can link to the provided TMDB URL to help support TMDB and provide the actual deep links to the content.
   *
   * * <b>JustWatch Attribution Required:</b>
   *
   * In order to use this data you must attribute the source of the data as JustWatch. If we find any usage not complying with these terms we will revoke access to the API.
   *
   * @version 3
   *
   * @see [tv-season-watch-providers]{@link https://developer.themoviedb.org/reference/tv-season-watch-providers}
   */
  provider: new TmdbClientEndpoint<
    {
      series_id: string | number;
      season_number: number;

      language?: string;
    },
    TmdbProviders
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/season/:season_number/watch/providers?language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
          season_number: true,
        },
        query: {
          language: false,
        },
      },
    },
  }),
};

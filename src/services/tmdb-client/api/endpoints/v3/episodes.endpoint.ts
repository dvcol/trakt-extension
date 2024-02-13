import type { TmdbAccountStatus } from '~/models/tmdb/tmdb-account.model';
import type { TmdbChanges } from '~/models/tmdb/tmdb-change.model';
import type { TmdbEpisodeCredits } from '~/models/tmdb/tmdb-credit.model';
import type { TmdbVideo } from '~/models/tmdb/tmdb-entity.model';
import type { TmdbEpisodeGroupExtended } from '~/models/tmdb/tmdb-episode-group.model';
import type { TmdbEpisodeExtended } from '~/models/tmdb/tmdb-episode.model';

import type { TmdbImageShort } from '~/models/tmdb/tmdb-image.model';
import type { TmdbTranslations } from '~/models/tmdb/tmdb-translation.model';
import type { RecursiveRecord } from '~/utils/typescript.utils';

import { TmdbClientEndpoint } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Episodes v3 endpoints.
 */
export const episodes = {
  /**
   * Query the details of a TV episode.
   *
   * This method supports using append_to_response. Read more about this [here]{@link https://developer.themoviedb.org/docs/append-to-response}.
   *
   * @version 3
   *
   * @see [tv-episode-details]{@link https://developer.themoviedb.org/reference/tv-episode-details}
   */
  details: new TmdbClientEndpoint<
    {
      series_id: string | number;
      season_number: number;
      episode_number: number;

      append_to_response?: string | string[];
      language?: string;
    },
    TmdbEpisodeExtended
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/season/:season_number/episode/:episode_number?append_to_response=&language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
          season_number: true,
          episode_number: true,
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
   * @version 3
   *
   * @see [tv-episode-account-states]{@link https://developer.themoviedb.org/reference/tv-episode-account-states}
   */
  account: new TmdbClientEndpoint<
    {
      series_id: string | number;
      season_number: number;
      episode_number: number;

      session_id?: string;
      guest_session_id?: never;
    },
    TmdbAccountStatus
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/season/:season_number/episode/:episode_number/account_states?session_id=&guest_session_id=',
    opts: {
      auth: 'session',
      version: 3,
      parameters: {
        path: {
          series_id: true,
          season_number: true,
          episode_number: true,
        },
        query: {
          session_id: false,
          guest_session_id: false,
        },
      },
    },
  }),
  /**
   * Get the recent changes for a TV episode.
   *
   * Get the changes for a TV episode. By default only the last 24 hours are returned.
   *
   * You can query up to 14 days in a single query by using the start_date and end_date query parameters.
   *
   * * <b>Note:</b>
   *
   * TV episode changes are a little different than movie changes in that there are some edits on episodes that will create a top level change entry at the season level.
   * These can be found under the episode keys. These keys will contain a episode_id.
   * You can use the episode changes methods to look these up individually.
   *
   * @version 3
   *
   * @see [tv-episode-changes]{@link https://developer.themoviedb.org/reference/tv-episode-changes-by-id}
   */
  change: new TmdbClientEndpoint<
    {
      episode_id: string | number;
    },
    TmdbChanges<{
      id: string;
      action: string;
      time: string;
      value: string | number | boolean | RecursiveRecord;
    }>
  >({
    method: HttpMethod.GET,
    url: '/tv/episode/:episode_id/changes',
    opts: {
      version: 3,
      parameters: {
        path: {
          episode_id: true,
        },
      },
    },
  }),
  /**
   * Get the credits (cast, crew and guest stars) that have been added to a TV episode.
   *
   * @version 3
   *
   * @see [tv-episode-credits]{@link https://developer.themoviedb.org/reference/tv-episode-credits}
   */
  credit: new TmdbClientEndpoint<
    {
      series_id: string | number;
      season_number: number;
      episode_number: number;

      language?: string;
    },
    TmdbEpisodeCredits
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/season/:season_number/episode/:episode_number/credits?language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
          season_number: true,
          episode_number: true,
        },
        query: {
          language: false,
        },
      },
    },
  }),
  /**
   * Get a list of external IDs that have been added to a TV episode.
   *
   * | Source   | Supported? |
   * | -------- | ---------- |
   * | IMDb     | ✅         |
   * | TheTVDB  | ✅         |
   * | Wikidata | ✅         |
   *
   * @version 3
   *
   * @see [tv-episode-external-ids]{@link https://developer.themoviedb.org/reference/tv-episode-external-ids}
   */
  external: new TmdbClientEndpoint<
    {
      series_id: string | number;
      season_number: number;
      episode_number: number;
    },
    {
      id: number;
      imdb_id: string;
      freebase_mid: string;
      freebase_id: string;
      tvdb_id: number;
      tvrage_id: number;
      wikidata_id: string;
    }
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/season/:season_number/episode/:episode_number/external_ids',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
          season_number: true,
          episode_number: true,
        },
      },
    },
  }),
  /**
   * Get the images that belong to a TV episode.
   *
   * This method will return the backdrops that have been added to a TV episode.
   *
   * * <b>Note:</b>
   *
   * If you have a language specified, it will act as a filter on the returned items.
   * You can use the include_image_language param to query additional languages.
   *
   * @version 3
   *
   * @see [tv-episode-images]{@link https://developer.themoviedb.org/reference/tv-episode-images}
   */
  images: new TmdbClientEndpoint<
    {
      series_id: string | number;
      season_number: number;
      episode_number: number;

      /** specify a comma separated list of ISO-639-1 values to query, for example: en,null */
      include_image_language?: string | string[];
      language?: string;
    },
    {
      id: number;
      stills: TmdbImageShort[];
    }
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/season/:season_number/episode/:episode_number/images?include_image_language=&language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
          season_number: true,
          episode_number: true,
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
   * Get the translations that have been added to a TV episode.
   *
   * Take a read through our [language]{@link https://developer.themoviedb.org/docs/languages} documentation for more information about languages on TMDB.
   *
   * @version 3
   *
   * @see [tv-episode-translations]{@link https://developer.themoviedb.org/reference/tv-episode-translations}
   */
  translation: new TmdbClientEndpoint<
    {
      series_id: string | number;
      season_number: number;
      episode_number: number;
    },
    TmdbTranslations<{
      name: string;
      overview: string;
    }>
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/season/:season_number/episode/:episode_number/translations',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
          season_number: true,
          episode_number: true,
        },
      },
    },
  }),
  /**
   * Get the videos that belong to a TV episode.
   *
   * @version 3
   *
   * @see [tv-episode-videos]{@link https://developer.themoviedb.org/reference/tv-episode-videos}
   */
  videos: new TmdbClientEndpoint<
    {
      series_id: string | number;
      season_number: number;
      episode_number: number;

      /** specify a comma separated list of ISO-639-1 values to query, for example: en,null */
      include_video_language?: string | string[];
      language?: string;
    },
    {
      id: number;
      results: TmdbVideo[];
    }
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/season/:season_number/episode/:episode_number/videos?include_video_language=&language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
          season_number: true,
          episode_number: true,
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
  rating: {
    /**
     * Rate a TV episode and save it to your rated list.
     *
     * @auth session-id
     * @version 3
     *
     * @see [tv-rate-episode]{@link https://developer.themoviedb.org/reference/tv-episode-add-rating}
     */
    add: new TmdbClientEndpoint<
      {
        series_id: string | number;
        season_number: number;
        episode_number: number;

        value: number;

        session_id?: string;
        guest_session_id?: never;
      },
      unknown,
      false
    >({
      method: HttpMethod.POST,
      url: '/tv/:series_id/season/:season_number/episode/:episode_number/rating?session_id=&guest_session_id=',
      body: {
        value: true,
      },
      opts: {
        auth: 'session',
        cache: false,
        version: 3,
        parameters: {
          path: {
            series_id: true,
            season_number: true,
            episode_number: true,
          },
          query: {
            session_id: false,
            guest_session_id: false,
          },
        },
      },
    }),
    /**
     * Delete your rating on a TV episode.
     *
     * @auth session-id
     * @version 3
     *
     * @see [tv-delete-rating]{@link https://developer.themoviedb.org/reference/tv-episode-delete-rating}
     */
    delete: new TmdbClientEndpoint<
      {
        series_id: string | number;
        season_number: number;
        episode_number: number;

        session_id?: string;
        guest_session_id?: never;
      },
      unknown,
      false
    >({
      method: HttpMethod.DELETE,
      url: '/tv/:series_id/season/:season_number/episode/:episode_number/rating?session_id=&guest_session_id=',
      opts: {
        auth: 'session',
        cache: false,
        version: 3,
        parameters: {
          path: {
            series_id: true,
            season_number: true,
            episode_number: true,
          },
          query: {
            session_id: false,
            guest_session_id: false,
          },
        },
      },
    }),
  },
  groups: {
    /**
     * Get the details of a TV episode group.
     *
     * Groups support 7 different types which are enumerated as the following:
     *
     * | Type | Name           |
     * | ---- | -------------- |
     * | 1    | Original air date |
     * | 2    | Absolute       |
     * | 3    | DVD            |
     * | 4    | Digital        |
     * | 5    | Story arc      |
     * | 6    | Production     |
     * | 7    | TV             |
     *
     * @version 3
     *
     * @see [tv-episode-group-details]{@link https://developer.themoviedb.org/reference/tv-episode-group-details}
     */
    details: new TmdbClientEndpoint<
      {
        tv_episode_group_id: string | number;
      },
      TmdbEpisodeGroupExtended
    >({
      method: HttpMethod.GET,
      url: '/tv/episode_group/:tv_episode_group_id',
      opts: {
        version: 3,
        parameters: {
          path: {
            tv_episode_group_id: true,
          },
        },
      },
    }),
  },
};

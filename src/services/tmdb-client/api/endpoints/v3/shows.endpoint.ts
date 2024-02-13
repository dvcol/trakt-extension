import type { TmdbAccountStatus } from '~/models/tmdb/tmdb-account.model';
import type { TmdbChanges } from '~/models/tmdb/tmdb-change.model';
import type { TmdbAggregateCredits, TmdbShowCredits } from '~/models/tmdb/tmdb-credit.model';
import type { TmdbAlternativeTitles, TmdbContentRating, TmdbKeyword, TmdbVideo } from '~/models/tmdb/tmdb-entity.model';
import type { TmdbEpisodeGroupShort } from '~/models/tmdb/tmdb-episode-group.model';
import type { TmdbShowListV3 } from '~/models/tmdb/tmdb-list.model';
import type { TmdbProviders } from '~/models/tmdb/tmdb-provider.model';
import type { TmdbReviewShort } from '~/models/tmdb/tmdb-review.model';
import type { TmdbScreenedShow, TmdbShowExtended, TmdbShowImages, TmdbShowShort } from '~/models/tmdb/tmdb-show.model';
import type { TmdbTranslations } from '~/models/tmdb/tmdb-translation.model';

import { TmdbClientEndpoint, type TmdbPaginatedData, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Shows v3 endpoint
 */
export const shows = {
  airing: {
    /**
     * Get a list of TV shows airing today.
     *
     * * <b>Note:</b>
     *
     * This call is really just a discover call behind the scenes.
     * If you would like to tweak any of the default filters head over and read about [discover]{@link https://developer.themoviedb.org/reference/discover-tv}.
     *
     * @version 3
     *
     * @see [tv-airing-today]{@link https://developer.themoviedb.org/reference/tv-series-airing-today-list}
     */
    today: new TmdbClientEndpoint<
      {
        language?: string;
        timezone?: string;
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbShowShort>
    >({
      method: HttpMethod.GET,
      url: '/tv/airing_today?language=&timezone=&page=',
      opts: {
        version: 3,
        parameters: {
          query: {
            language: false,
            timezone: false,
            page: false,
          },
        },
      },
    }),
    /**
     * Get a list of TV shows that air in the next 7 days.
     *
     * * <b>Note:</b>
     *
     * This call is really just a discover call behind the scenes.
     * If you would like to tweak any of the default filters head over and read about [discover]{@link https://developer.themoviedb.org/reference/discover-tv}.
     *
     * @version 3
     *
     * @see [tv-on-the-air]{@link https://developer.themoviedb.org/reference/tv-series-on-the-air-list}
     */
    week: new TmdbClientEndpoint<
      {
        language?: string;
        timezone?: string;
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbShowShort>
    >({
      method: HttpMethod.GET,
      url: '/tv/on_the_air?language=&timezone=&page=',
      opts: {
        version: 3,
        parameters: {
          query: {
            language: false,
            timezone: false,
            page: false,
          },
        },
      },
    }),
  },
  /**
   * Get a list of TV shows ordered by popularity.
   *
   * * <b>Note:</b>
   *
   * This call is really just a discover call behind the scenes.
   * If you would like to tweak any of the default filters head over and read about [discover]{@link https://developer.themoviedb.org/reference/discover-tv}.
   *
   * @version 3
   *
   * @see [tv-popular]{@link https://developer.themoviedb.org/reference/tv-series-popular-list}
   */
  popular: new TmdbClientEndpoint<
    {
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbShowShort>
  >({
    method: HttpMethod.GET,
    url: '/tv/popular?language=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get a list of TV shows ordered by rating.
   */
  rated: new TmdbClientEndpoint<
    {
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbShowShort>
  >({
    method: HttpMethod.GET,
    url: '/tv/top_rated?language=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get the details of a TV show.
   *
   * * <b>Append To Response:</b>
   *
   * This method supports using append_to_response. Read more about this [here]{@link https://developer.themoviedb.org/docs/append-to-response}.
   *
   * @version 3
   *
   * @see [tv-details]{@link https://developer.themoviedb.org/reference/tv-series-details}
   */
  details: new TmdbClientEndpoint<
    {
      series_id: string | number;
      /** comma separated list of endpoints within this namespace, 20 items max */
      append_to_response?: string | string[];
      language?: string;
    },
    TmdbShowExtended
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id?language=&append_to_response=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
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
   * @see [tv-account-states]{@link https://developer.themoviedb.org/reference/tv-series-account-states}
   */
  account: new TmdbClientEndpoint<
    {
      series_id: string | number;
      session_id?: string;
      guest_session_id?: string;
    },
    TmdbAccountStatus
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/account_states?session_id=&guest_session_id=',
    opts: {
      auth: 'session',
      version: 3,
      parameters: {
        path: {
          series_id: true,
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
     * Get the aggregate credits (cast and crew) that have been added to a TV show.
     *
     * * <b>Note:</b>
     *
     * This call differs from the main credits call in that it does not return the newest season.
     * Instead, it is a view of all the entire cast & crew for all episodes belonging to a TV show.
     *
     * @version 3
     *
     * @see [tv-aggregate-credits]{@link https://developer.themoviedb.org/reference/tv-series-aggregate-credits}
     */
    aggregate: new TmdbClientEndpoint<
      {
        series_id: string | number;
        language?: string;
      },
      TmdbAggregateCredits
    >({
      method: HttpMethod.GET,
      url: '/tv/:series_id/aggregate_credits?language=',
      opts: {
        version: 3,
        parameters: {
          path: {
            series_id: true,
          },
          query: {
            language: false,
          },
        },
      },
    }),
    /**
     * Get the latest season credits of a TV show.
     *
     * * <b>Note:</b>
     *
     * This is the original TV credits method which returns the latest season credit data.
     * If you would like to request the aggregate view (which is what you see on our website) you should use the [/aggregate_credits]{@link https://developer.themoviedb.org/reference/tv-series-aggregate-credits} method.
     *
     * @version 3
     *
     * @see [tv-latest-credits]{@link https://developer.themoviedb.org/reference/movie-credits}
     */
    season: new TmdbClientEndpoint<
      {
        series_id: string | number;
        language?: string;
      },
      TmdbShowCredits
    >({
      method: HttpMethod.GET,
      url: '/tv/:series_id/credits?language=',
      opts: {
        version: 3,
        parameters: {
          path: {
            series_id: true,
          },
          query: {
            language: false,
          },
        },
      },
    }),
  },
  /**
   * Get the alternative titles that have been added to a TV show.
   *
   * @version 3
   *
   * @see [tv-alternative-titles]{@link https://developer.themoviedb.org/reference/tv-series-alternative-titles}
   */
  titles: new TmdbClientEndpoint<
    {
      series_id: string | number;
    },
    TmdbAlternativeTitles
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/alternative_titles',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
        },
      },
    },
  }),
  /**
   * Get the recent changes for a TV show.
   *
   * Get the changes for a TV show. By default only the last 24 hours are returned.
   *
   * You can query up to 14 days in a single query by using the start_date and end_date query parameters.
   *
   * * <b>Note:</b>
   *
   * TV show changes are a little different than movie changes in that there are some edits on seasons and episodes that will create a top level change entry at the show level.
   * These can be found under the season and episode keys.
   * These keys will contain a series_id and episode_id. You can use the season changes and episode changes methods to look these up individually.
   *
   * @version 3
   *
   * @see [tv-changes]{@link https://developer.themoviedb.org/reference/tv-series-changes}
   */
  changes: new TmdbClientEndpoint<
    {
      series_id: string | number;
      start_date?: string;
      end_date?: string;
    } & TmdbParamPagination,
    TmdbChanges
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/changes?start_date=&end_date=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
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
   *  Get the content ratings that have been added to a TV show.
   *
   *  @version 3
   *
   *  @see [tv-content-ratings]{@link https://developer.themoviedb.org/reference/tv-series-content-ratings}
   */
  ratings: new TmdbClientEndpoint<
    {
      series_id: string | number;
    },
    {
      id: number;
      results: TmdbContentRating[];
    }
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/content_ratings',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
        },
      },
    },
  }),
  /**
   * Get the episode groups that have been added to a TV show.
   *
   * With a group ID you can call the get TV episode group details method.
   *
   * @version 3
   *
   * @see [tv-episode-groups]{@link https://developer.themoviedb.org/reference/tv-series-episode-groups}
   */
  groups: new TmdbClientEndpoint<
    {
      series_id: string | number;
    },
    {
      id: number;
      results: TmdbEpisodeGroupShort[];
    }
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/episode_groups',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
        },
      },
    },
  }),
  /**
   * Get a list of external IDs that have been added to a TV show.
   *
   * | Source   | Supported? |
   * | -------- | ---------- |
   * | Facebook | ✅         |
   * | IMDb     | ✅         |
   * | Instagram| ✅         |
   * | TheTVDB  | ✅         |
   * | Twitter  | ✅         |
   * | Wikidata | ✅         |
   *
   * @version 3
   *
   * @see [tv-external-ids]{@link https://developer.themoviedb.org/reference/tv-series-external-ids}
   */
  external: new TmdbClientEndpoint<
    { series_id: string | number },
    {
      id: number;
      imdb_id: string;
      freebase_mid: string;
      freebase_id: string;
      tvdb_id: number;
      tvrage_id: number;
      wikidata_id: string;
      facebook_id: string;
      instagram_id: string;
      twitter_id: string;
    }
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/external_ids',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
        },
      },
    },
  }),
  /**
   * Get the images that belong to a TV series.
   *
   * This method will return the backdrops, posters and logos that have been added to a TV show.
   *
   * * <b>Note:</b>
   *
   * If you have a language specified, it will act as a filter on the returned items. You can use the include_image_language param to query additional languages.
   *
   * @version 3
   *
   * @see [tv-images]{@link https://developer.themoviedb.org/reference/tv-series-images}
   */
  images: new TmdbClientEndpoint<
    {
      series_id: string | number;
      /** specify a comma separated list of ISO-639-1 values to query, for example: en,null */
      include_image_language?: string | string[];
      language?: string;
    },
    TmdbShowImages
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/images?include_image_language=&language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
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
   * Get a list of keywords that have been added to a TV show.
   *
   * @version 3
   *
   * @see [tv-keywords]{@link https://developer.themoviedb.org/reference/tv-series-keywords}
   */
  keywords: new TmdbClientEndpoint<
    {
      series_id: string | number;
    },
    {
      id: number;
      results: TmdbKeyword[];
    }
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/keywords',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
        },
      },
    },
  }),
  /**
   * Get the newest TV show ID.
   *
   * This is a live response and will continuously change.
   *
   * @version 3
   *
   * @see [tv-latest]{@link https://developer.themoviedb.org/reference/tv-series-latest-id}
   */
  latest: new TmdbClientEndpoint<Record<string, never>, TmdbShowExtended>({
    method: HttpMethod.GET,
    url: '/tv/latest',
    opts: {
      version: 3,
    },
  }),
  /**
   * Get the lists that a TV series has been added to.
   *
   * @version 3
   *
   * @see [tv-lists]{@link https://developer.themoviedb.org/reference/lists-copy}
   */
  lists: new TmdbClientEndpoint<
    {
      series_id: string | number;
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbShowListV3>
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/lists?language=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
        },
        query: {
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get the recommendations for a TV show.
   *
   * @version 3
   *
   * @see [tv-recommendations]{@link https://developer.themoviedb.org/reference/tv-series-recommendations}
   */
  recommendations: new TmdbClientEndpoint<
    {
      series_id: string | number;
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbShowShort>
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/recommendations?language=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
        },
        query: {
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get the reviews that have been added to a TV show.
   *
   * @version 3
   *
   * @see [tv-reviews]{@link https://developer.themoviedb.org/reference/tv-series-reviews}
   */
  reviews: new TmdbClientEndpoint<
    {
      series_id: string | number;
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbReviewShort>
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/reviews?language=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
        },
        query: {
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get the seasons and episodes that have screened theatrically.
   *
   * @version 3
   *
   * @see [tv-screened]{@link https://developer.themoviedb.org/reference/tv-series-screened-theatrically}
   */
  screened: new TmdbClientEndpoint<
    {
      series_id: string | number;
    },
    {
      id: number;
      results: TmdbScreenedShow[];
    }
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/screened_theatrically',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
        },
      },
    },
  }),
  /**
   * Get the similar TV shows for a specific TV show ID.
   *
   * @version 3
   *
   * @see [tv-similar]{@link https://developer.themoviedb.org/reference/tv-series-similar}
   */
  similar: new TmdbClientEndpoint<
    {
      series_id: string | number;
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbShowShort>
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/similar?language=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
        },
        query: {
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get the translations that have been added to a TV show.
   *
   * Take a read through our [language]{@link https://developer.themoviedb.org/docs/languages} documentation for more information about languages on TMDB.
   */
  translations: new TmdbClientEndpoint<
    {
      series_id: string | number;
    },
    TmdbTranslations<{
      name: string;
      overview: string;
      homepage: string;
      tagline: string;
    }>
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/translations',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
        },
      },
    },
  }),
  /**
   * Get the videos that belong to a TV show.
   *
   * @version 3
   *
   * @see [tv-videos]{@link https://developer.themoviedb.org/reference/tv-series-videos}
   */
  videos: new TmdbClientEndpoint<
    {
      series_id: string | number;
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
    url: '/tv/:series_id/videos?include_video_language=&language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
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
   * Get the list of streaming providers we have for a TV show.
   *
   * Powered by our partnership with JustWatch, you can query this method to get a list of the streaming/rental/purchase availabilities per country by provider.
   *
   * Powered by our partnership with JustWatch, you can query this method to get a list of the streaming/rental/purchase availabilities per country by provider.
   *
   * You can link to the provided TMDB URL to help support TMDB and provide the actual deep links to the content.
   *
   * * <b>JustWatch Attribution Required:</b>
   *
   * In order to use this data you must attribute the source of the data as JustWatch. If we find any usage not complying with these terms we will revoke access to the API.
   *
   * @version 3
   *
   * @see [tv-providers]{@link https://developer.themoviedb.org/reference/tv-series-watch-providers}
   */
  providers: new TmdbClientEndpoint<
    {
      series_id: string | number;
    },
    TmdbProviders
  >({
    method: HttpMethod.GET,
    url: '/tv/:series_id/watch/providers',
    opts: {
      version: 3,
      parameters: {
        path: {
          series_id: true,
        },
      },
    },
  }),
  rating: {
    /**
     * Rate a TV show and save it to your rated list.
     *
     * * <b>Reminder:</b>
     *
     * By default, we will remove a rated item from your watchlist if it's present.
     * This keeps your "watched" and and "want to watch" lists tidy and in sync.
     * You can edit this behaviour [here]{@link https://www.themoviedb.org/settings/sharing}.
     *
     * @auth session-id
     * @version 3
     *
     * @see [tv-add-rating]{@link https://developer.themoviedb.org/reference/tv-series-add-rating}
     */
    add: new TmdbClientEndpoint<
      {
        series_id: string | number;
        value: number;

        session_id?: string;
        guest_session_id?: never;
      },
      unknown,
      false
    >({
      method: HttpMethod.POST,
      url: '/tv/:series_id/rating?session_id=&guest_session_id=',
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
          },
          query: {
            session_id: false,
            guest_session_id: false,
          },
        },
      },
    }),
    /**
     * Delete your rating on a TV serie.
     *
     * @auth session-id
     * @version 3
     *
     * @see [tv-delete-rating]{@link https://developer.themoviedb.org/reference/tv-series-delete-rating}
     */
    delete: new TmdbClientEndpoint<
      {
        series_id: string | number;

        session_id?: string;
        guest_session_id?: never;
      },
      unknown,
      false
    >({
      method: HttpMethod.DELETE,
      url: '/tv/:series_id/rating?session_id=&guest_session_id=',
      opts: {
        auth: 'session',
        cache: false,
        version: 3,
        parameters: {
          path: {
            series_id: true,
          },
          query: {
            session_id: false,
            guest_session_id: false,
          },
        },
      },
    }),
  },
};

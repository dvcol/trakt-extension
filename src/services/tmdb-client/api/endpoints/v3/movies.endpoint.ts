import type { TmdbAccountStatus } from '~/models/tmdb/tmdb-account.model';
import type { TmdbChanges } from '~/models/tmdb/tmdb-change.model';
import type { TmdbMovieCredit } from '~/models/tmdb/tmdb-credit.model';
import type { TmdbKeyword, TmdbVideo } from '~/models/tmdb/tmdb-entity.model';
import type { TmdbListV3 } from '~/models/tmdb/tmdb-list.model';
import type { TmdbMovieExtended, TmdbMovieImages, TmdbMovieReleaseDate, TmdbMovieShort, TmdbMovieTitles } from '~/models/tmdb/tmdb-movie.model';
import type { TmdbProviders } from '~/models/tmdb/tmdb-provider.model';
import type { TmdbReviewShort } from '~/models/tmdb/tmdb-review.model';
import type { TmdbTranslations } from '~/models/tmdb/tmdb-translation.model';

import { TmdbClientEndpoint, type TmdbPaginatedData, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Movies v3 endpoints.
 */
export const movies = {
  /**
   * Get a list of movies that are currently in theatres.
   *
   * * <b>Note:</b>
   *
   * This call is really just a discover call behind the scenes.
   * If you would like to tweak any of the default filters head over and read about [discover]{@link https://developer.themoviedb.org/reference/discover-movie}.
   *
   * @version 3
   *
   * @see [now-playing]{@link https://developer.themoviedb.org/reference/movie-now-playing-list}
   */
  playing: new TmdbClientEndpoint<
    {
      language?: string;
      /** ISO-3166-1 country code */
      region?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort, { dates: { maximum: string; minimum: string } }>
  >({
    method: HttpMethod.GET,
    url: '/movie/now_playing?language=&region=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          language: false,
          region: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get a list of movies ordered by popularity.
   *
   * * <b>Note:</b>
   *
   * This call is really just a discover call behind the scenes.
   * If you would like to tweak any of the default filters head over and read about [discover]{@link https://developer.themoviedb.org/reference/discover-movie}.
   *
   * @version 3
   *
   * @see [popular]{@link https://developer.themoviedb.org/reference/movie-popular-list}
   */
  popular: new TmdbClientEndpoint<
    {
      language?: string;
      /** ISO-3166-1 country code */
      region?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort>
  >({
    method: HttpMethod.GET,
    url: '/movie/popular?language=&region=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          language: false,
          region: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get a list of movies ordered by rating.
   *
   * * <b>Note:</b>
   *
   * This call is really just a discover call behind the scenes.
   * If you would like to tweak any of the default filters head over and read about [discover]{@link https://developer.themoviedb.org/reference/discover-movie}.
   *
   * @version 3
   *
   * @see [top-rated]{@link https://developer.themoviedb.org/reference/movie-top-rated-list}
   */
  top: new TmdbClientEndpoint<
    {
      language?: string;
      /** ISO-3166-1 country code */
      region?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort>
  >({
    method: HttpMethod.GET,
    url: '/movie/top_rated?language=&region=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          language: false,
          region: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get a list of movies that are being released soon.
   *
   * * <b>Note:</b>
   *
   * This call is really just a discover call behind the scenes.
   * If you would like to tweak any of the default filters head over and read about [discover]{@link https://developer.themoviedb.org/reference/discover-movie}.
   *
   * @version 3
   *
   * @see [upcoming]{@link https://developer.themoviedb.org/reference/movie-upcoming-list}
   */
  upcoming: new TmdbClientEndpoint<
    {
      language?: string;
      /** ISO-3166-1 country code */
      region?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort, { dates: { maximum: string; minimum: string } }>
  >({
    method: HttpMethod.GET,
    url: '/movie/upcoming?language=&region=&page=',
    opts: {
      version: 3,
      parameters: {
        query: {
          language: false,
          region: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get the top level details of a movie by ID.
   *
   * * <b>Append To Response:</b>
   *
   * This method supports using append_to_response.
   * It is an easy and efficient way to append extra requests to any top level namespace.
   * This makes it possible to make sub requests within the same namespace in a single HTTP request.
   * Each request will get appended to the response as a new JSON object.
   *
   * Read more about this [here]{@link https://developer.themoviedb.org/docs/append-to-response}.
   *
   * @version 3
   *
   * @see [get-movie-details]{@link https://developer.themoviedb.org/reference/movie-details}
   */
  details: new TmdbClientEndpoint<
    {
      movie_id: string | number;

      /** comma separated list of endpoints within this namespace, 20 items max */
      append_to_response?: string | string[];
      language?: string;
    },
    TmdbMovieExtended
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id?append_to_response=&language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
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
   * Get the rating, watchlist and favourite status of an account for this movie id.
   *
   * @auth session-id
   * @version 3
   *
   * @see [get-movie-account-states]{@link https://developer.themoviedb.org/reference/movie-account-states}
   */
  account: new TmdbClientEndpoint<
    {
      movie_id: string | number;
      session_id?: string;
      guest_session_id?: string;
    },
    TmdbAccountStatus
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id/account_states?session_id=&guest_session_id=',
    opts: {
      auth: 'session',
      version: 3,
      parameters: {
        path: {
          movie_id: true,
        },
        query: {
          session_id: false,
          guest_session_id: false,
        },
      },
    },
  }),
  /**
   * Get the alternative titles for a movie.
   *
   * @version 3
   *
   * @see [get-movie-alternative-titles]{@link https://developer.themoviedb.org/reference/movie-alternative-titles}
   */
  titles: new TmdbClientEndpoint<
    {
      movie_id: string | number;
      /** specify a ISO-3166-1 value to filter the results */
      country?: string;
    },
    TmdbMovieTitles
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id/alternative_titles?country=',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
        },
        query: {
          country: false,
        },
      },
    },
  }),
  /**
   * Get the recent changes for a movie.
   *
   * Get the changes for a movie.
   * By default only the last 24 hours are returned.
   *
   * You can query up to 14 days in a single query by using the start_date and end_date query parameters.
   */
  changes: new TmdbClientEndpoint<
    {
      movie_id: string | number;
      end_date?: string;
      start_date?: string;
    } & TmdbParamPagination,
    TmdbChanges
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id/changes?end_date=&start_date=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
        },
        query: {
          end_date: false,
          start_date: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get the cast and crew for a movie.
   *
   * @version 3
   *
   * @see [get-movie-credits]{@link https://developer.themoviedb.org/reference/movie-credits}
   */
  credits: new TmdbClientEndpoint<
    {
      movie_id: string | number;
      language?: string;
    },
    TmdbMovieCredit
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id/credits?language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
        },
        query: {
          language: false,
        },
      },
    },
  }),
  /**
   * Get the external ids for a movie.
   *
   * | Media Databases | Social IDs |
   * | --------------- | ---------- |
   * | IMDb            | Facebook   |
   * | Wikidata        | Instagram  |
   * | -               | Twitter    |
   *
   * @version 3
   *
   * @see [get-movie-external-ids]{@link https://developer.themoviedb.org/reference/movie-external-ids}
   */
  external: new TmdbClientEndpoint<
    {
      movie_id: string | number;
    },
    {
      id: number;
      imdb_id: string;
      facebook_id: string;
      instagram_id: string;
      twitter_id: string;
    }
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id/external_ids',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
        },
      },
    },
  }),
  /**
   * Get the images that belong to a movie.
   *
   * This method will return the backdrops, posters and logos that have been added to a movie.
   *
   * * <b>Note:</b>
   *
   * If you have a language specified, it will act as a filter on the returned items.
   * You can use the include_image_language param to query additional languages.
   */
  images: new TmdbClientEndpoint<
    {
      movie_id: string | number;
      /** specify a comma separated list of ISO-639-1 values to query, for example: en,null */
      include_image_language?: string | string[];
      language?: string;
    },
    TmdbMovieImages
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id/images?include_image_language=&language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
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
   * Get the keywords that have been added to a movie.
   *
   * @version 3
   *
   * @see [get-movie-keywords]{@link https://developer.themoviedb.org/reference/movie-keywords}
   */
  keywords: new TmdbClientEndpoint<
    {
      movie_id: string | number;
    },
    {
      id: number;
      keywords: TmdbKeyword[];
    }
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id/keywords',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
        },
      },
    },
  }),
  /**
   * Get the newest movie ID.
   *
   * @version 3
   *
   * @see [get-latest-movie]{@link https://developer.themoviedb.org/reference/movie-latest-id}
   */
  latest: new TmdbClientEndpoint<Record<string, never>, TmdbMovieExtended>({
    method: HttpMethod.GET,
    url: '/movie/latest',
    opts: {
      version: 3,
    },
  }),
  /**
   * Get the lists that a movie has been added to.
   *
   * @version 3
   *
   * @see [get-movie-lists]{@link https://developer.themoviedb.org/reference/movie-lists}
   */
  lists: new TmdbClientEndpoint<
    {
      movie_id: string | number;
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbListV3>
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id/lists?language=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
        },
        query: {
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get the recommendations for a movie.
   *
   * @version 3
   *
   * @see [get-movie-recommendations]{@link https://developer.themoviedb.org/reference/movie-recommendations}
   */
  recommendations: new TmdbClientEndpoint<
    {
      movie_id: string | number;
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort>
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id/recommendations?language=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
        },
        query: {
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get the release dates and certifications for a movie.
   *
   * @version 3
   *
   * @see [get-movie-release-dates]{@link https://developer.themoviedb.org/reference/movie-release-dates}
   */
  release: new TmdbClientEndpoint<
    {
      movie_id: string | number;
    },
    TmdbMovieReleaseDate
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id/release_dates',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
        },
      },
    },
  }),
  /**
   * Get the user reviews for a movie.
   *
   * @version 3
   *
   * @see [get-movie-reviews]{@link https://developer.themoviedb.org/reference/movie-reviews}
   */
  reviews: new TmdbClientEndpoint<
    {
      movie_id: string | number;
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbReviewShort>
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id/reviews?language=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
        },
        query: {
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get the similar movies based on genres and keywords.
   *
   * * <b>Note:</b>
   *
   * This method only looks for other items based on genres and plot keywords.
   * As such, the results found here are not always going to be :100:.
   * Use it with that in mind.
   */
  similar: new TmdbClientEndpoint<
    {
      movie_id: string | number;
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbMovieShort>
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id/similar?language=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
        },
        query: {
          language: false,
          page: false,
        },
      },
    },
  }),
  /**
   * Get the translations for a movie.
   *
   * Take a read through our [language]{@link https://developer.themoviedb.org/docs/languages} documentation for more information about languages on TMDB.
   */
  translations: new TmdbClientEndpoint<
    {
      movie_id: string | number;
    },
    TmdbTranslations<{
      homepage: string;
      overview: string;
      runtime: string;
      tagline: string;
      title: string;
    }>
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id/translations',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
        },
      },
    },
  }),
  /**
   * Get the videos that have been added to a movie.
   *
   * @version 3
   *
   * @see [get-movie-videos]{@link https://developer.themoviedb.org/reference/movie-videos}
   */
  videos: new TmdbClientEndpoint<
    {
      movie_id: string | number;
      language?: string;
    },
    {
      id: number;
      results: TmdbVideo[];
    }
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id/videos?language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
        },
        query: {
          language: false,
        },
      },
    },
  }),
  /**
   * Get the list of streaming providers we have for a movie.
   *
   * Powered by our partnership with JustWatch, you can query this method to get a list of the streaming/rental/purchase availabilities per country by provider.
   *
   * This is not going to return full deep links, but rather, it's just enough information to display what's available where.
   *
   * You can link to the provided TMDB URL to help support TMDB and provide the actual deep links to the content.
   *
   * * <b>Note:</b> JustWatch Attribution Required
   *
   * In order to use this data you must attribute the source of the data as JustWatch.
   * If we find any usage not complying with these terms we will revoke access to the API.
   *
   * @version 3
   *
   * @see [get-movie-watch-providers]{@link https://developer.themoviedb.org/reference/movie-watch-providers}
   */
  providers: new TmdbClientEndpoint<
    {
      movie_id: string | number;
    },
    TmdbProviders
  >({
    method: HttpMethod.GET,
    url: '/movie/:movie_id/watch/providers',
    opts: {
      version: 3,
      parameters: {
        path: {
          movie_id: true,
        },
      },
    },
  }),
  rating: {
    /**
     * Rate a movie and save it to your rated list.
     *
     * * <b>Note:</b>
     *
     * By default, we will remove a rated item from your watchlist if it's present.
     * This keeps your "watched" and and "want to watch" lists tidy and in sync.
     * You can edit this behaviour [here]{@link https://www.themoviedb.org/settings/sharing}.
     *
     * @auth session-id
     * @version 3
     *
     * @see [rate-movie]{@link https://developer.themoviedb.org/reference/movie-add-rating}
     */
    add: new TmdbClientEndpoint<
      {
        movie_id: string | number;
        value: number;

        session_id?: string;
        guest_session_id?: string;
      },
      unknown,
      false
    >({
      method: HttpMethod.POST,
      url: '/movie/:movie_id/rating?session_id=&guest_session_id=',
      body: {
        value: true,
      },
      opts: {
        auth: 'session',
        version: 3,
        cache: false,
        parameters: {
          path: {
            movie_id: true,
          },
          query: {
            session_id: false,
            guest_session_id: false,
          },
        },
      },
    }),
    /**
     * Delete a user rating.
     *
     * @auth session-id
     * @version 3
     *
     * @see [delete-movie-rating]{@link https://developer.themoviedb.org/reference/movie-delete-rating}
     */
    delete: new TmdbClientEndpoint<
      {
        movie_id: string | number;

        session_id?: string;
        guest_session_id?: string;
      },
      unknown,
      false
    >({
      method: HttpMethod.DELETE,
      url: '/movie/:movie_id/rating?session_id=&guest_session_id=',
      opts: {
        auth: 'session',
        version: 3,
        cache: false,
        parameters: {
          path: {
            movie_id: true,
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

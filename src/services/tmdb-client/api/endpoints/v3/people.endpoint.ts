import type { TmdbChanges } from '~/models/tmdb/tmdb-change.model';
import type { TmdbCombinedCredit, TmdbPersonMovieCredits, TmdbPersonShowCredits } from '~/models/tmdb/tmdb-credit.model';
import type { TmdbImage, TmdbTaggedImage } from '~/models/tmdb/tmdb-image.model';
import type { TmdbPersonExtended, TmdbPersonKnownFor } from '~/models/tmdb/tmdb-person.model';

import type { TmdbTranslations } from '~/models/tmdb/tmdb-translation.model';

import { TmdbClientEndpoint, type TmdbPaginatedData, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * People v3 endpoints.
 */
export const people = {
  /**
   * Get a list of people ordered by popularity.
   *
   * @version 3
   *
   * @see [popular-people]{@link https://developer.themoviedb.org/reference/person-popular-list}
   */
  popular: new TmdbClientEndpoint<
    {
      language?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<TmdbPersonKnownFor>
  >({
    method: HttpMethod.GET,
    url: '/person/popular?language=&page=',
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
   * Query the top level details of a person.
   *
   * * <b>Append To Response:</b>
   *
   * This method supports using append_to_response. Read more about this [here]{@link https://developer.themoviedb.org/docs/append-to-response}.
   *
   * * <b>Genders</b>
   *
   * | Value | Gender                 |
   * |-------|------------------------|
   * | 0     | Not set / not specified |
   * | 1     | Female                 |
   * | 2     | Male                   |
   * | 3     | Non-binary             |
   *
   * @version 3
   *
   * @see [person-details]{@link https://developer.themoviedb.org/reference/person-details}
   */
  details: new TmdbClientEndpoint<
    {
      person_id: string | number;

      /** comma separated list of endpoints within this namespace, 20 items max */
      append_to_response?: string | string[];
      language?: string;
    },
    TmdbPersonExtended
  >({
    method: HttpMethod.GET,
    url: '/person/:person_id',
    opts: {
      version: 3,
      parameters: {
        path: {
          person_id: true,
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
   * Get the recent changes for a person.
   *
   * Get the changes for a person.
   * By default only the last 24 hours are returned.
   *
   * You can query up to 14 days in a single query by using the start_date and end_date query parameters.
   *
   * @version 3
   *
   * @see [person-changes]{@link https://developer.themoviedb.org/reference/person-changes}
   */
  changes: new TmdbClientEndpoint<
    {
      person_id: string | number;

      start_date?: string;
      end_date?: string;
    } & TmdbParamPagination,
    TmdbChanges
  >({
    method: HttpMethod.GET,
    url: '/person/:person_id/changes?start_date=&end_date=&page=',
    opts: {
      version: 3,
      parameters: {
        path: {
          person_id: true,
        },
        query: {
          start_date: false,
          end_date: false,
          page: false,
        },
      },
    },
  }),
  credits: {
    /**
     * Get the combined movie and TV credits that belong to a person.
     *
     * @version 3
     *
     * @see [person-combined-credits]{@link https://developer.themoviedb.org/reference/person-combined-credits}
     */
    combined: new TmdbClientEndpoint<
      {
        person_id: string | number;
        language?: string;
      },
      TmdbCombinedCredit
    >({
      method: HttpMethod.GET,
      url: '/person/:person_id/combined_credits?language=',
      opts: {
        version: 3,
        parameters: {
          path: {
            person_id: true,
          },
          query: {
            language: false,
          },
        },
      },
    }),
    /**
     * Get the movie credits for a person.
     *
     * @version 3
     *
     * @see [person-movie-credits]{@link https://developer.themoviedb.org/reference/person-movie-credits}
     */
    movie: new TmdbClientEndpoint<
      {
        person_id: string | number;
        language?: string;
      },
      TmdbPersonMovieCredits
    >({
      method: HttpMethod.GET,
      url: '/person/:person_id/movie_credits?language=',
      opts: {
        version: 3,
        parameters: {
          path: {
            person_id: true,
          },
          query: {
            language: false,
          },
        },
      },
    }),
    /**
     * Get the TV credits that belong to a person.
     *
     * @version 3
     *
     * @see [person-tv-credits]{@link https://developer.themoviedb.org/reference/person-tv-credits}
     */
    tv: new TmdbClientEndpoint<
      {
        person_id: string | number;
        language?: string;
      },
      TmdbPersonShowCredits
    >({
      method: HttpMethod.GET,
      url: '/person/:person_id/tv_credits?language=',
      opts: {
        version: 3,
        parameters: {
          path: {
            person_id: true,
          },
          query: {
            language: false,
          },
        },
      },
    }),
  },
  /**
   * Get the external ID's that belong to a person.
   *
   * We currently support the following external sources for person records:
   *
   * | Source   | Supported |
   * |----------|-----------|
   * | Facebook | ✅        |
   * | IMDb     | ✅        |
   * | Instagram| ✅        |
   * | TikTok   | ✅        |
   * | Twitter  | ✅        |
   * | Wikidata | ✅        |
   * | YouTube  | ✅        |
   *
   * @version 3
   *
   * @see [person-external-ids]{@link https://developer.themoviedb.org/reference/person-external-ids}
   */
  external: new TmdbClientEndpoint<
    {
      person_id: string | number;
    },
    {
      id: number;
      freebase_mid: string;
      freebase_id: string;
      imdb_id: string;
      tvrage_id: number;
      wikidata_id: string;
      facebook_id: string;
      instagram_id: string;
      tiktok_id: string;
      twitter_id: string;
      youtube_id: string;
    }
  >({
    method: HttpMethod.GET,
    url: '/person/:person_id/external_ids',
    opts: {
      version: 3,
      parameters: {
        path: {
          person_id: true,
        },
      },
    },
  }),
  /**
   * Get the profile images that belong to a person.
   *
   * This method will return the profile images that have been added to a person.
   *
   * @version 3
   *
   * @see [person-images]{@link https://developer.themoviedb.org/reference/person-images}
   */
  images: new TmdbClientEndpoint<
    {
      person_id: string | number;
    },
    {
      id: number;
      profiles: TmdbImage[];
    }
  >({
    method: HttpMethod.GET,
    url: '/person/:person_id/images',
    opts: {
      version: 3,
      parameters: {
        path: {
          person_id: true,
        },
      },
    },
  }),
  /**
   * @deprecated
   */
  tagged: {
    /**
     * Get the tagged images for a person.
     *
     * @deprecated
     *
     * @version 3
     *
     * @see [person-tagged-images]{@link https://developer.themoviedb.org/reference/person-tagged-images}
     */
    images: new TmdbClientEndpoint<
      {
        person_id: string | number;
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbTaggedImage>
    >({
      method: HttpMethod.GET,
      url: '/person/:person_id/tagged_images?page=',
      opts: {
        version: 3,
        parameters: {
          path: {
            person_id: true,
          },
          query: {
            page: false,
          },
        },
      },
    }),
  },
  latest: new TmdbClientEndpoint<Record<string, never>, TmdbPersonExtended>({
    method: HttpMethod.GET,
    url: '/person/latest',
    opts: {
      version: 3,
    },
  }),
  /**
   * Get the translations that belong to a person.
   *
   * Take a read through our [language]{@link language} documentation for more information about languages on TMDB.
   */
  translations: new TmdbClientEndpoint<
    {
      person_id: string | number;
    },
    TmdbTranslations<{ biography: string }>
  >({
    method: HttpMethod.GET,
    url: '/person/:person_id/translations',
    opts: {
      version: 3,
      parameters: {
        path: {
          person_id: true,
        },
      },
    },
  }),
};

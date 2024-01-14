import type { TraktRecommendation } from '~/models/trakt-recommendation.model';

import { TraktApiExtended, type TraktApiParamsExtended, TraktClientEndpoint } from '~/models/trakt-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Trakt social recommendations use all the Favorites lists from the users you follow.
 * The more users you follow with similar tastes, the better your recommendations will be.
 * We also use other factors for the algorithm to further personalize what gets recommended.
 *
 * @see [recommendations]{@link https://trakt.docs.apiary.io/#reference/recommendations}
 */
export const recommendations = {
  movies: {
    /**
     * Movie recommendations for a user. By default, 10 results are returned. You can send a limit to get up to 100 results per page.
     * Set ignore_collected=true to filter out movies the user has already collected or ignore_watchlisted=true to filter out movies the user has already watchlisted.
     *
     * The favorited_by array contains all users who favorited the item along with any notes they added.
     *
     * @extended [Full]{@link TraktApiExtended.Full}
     * @auth required
     *
     * @see [get-movie-recommendations]{@link https://trakt.docs.apiary.io/#reference/recommendations/movies/get-movie-recommendations}
     */
    get: new TraktClientEndpoint<
      {
        /** filter out collected movies */
        ignore_collected?: boolean;
        /** filter out watchlisted movies */
        ignore_watchlisted?: boolean;
      } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
      TraktRecommendation<'movie'>[]
    >({
      method: HttpMethod.GET,
      url: '/recommendations/movies/?ignore_collected=false&ignore_watchlisted=false',
      opts: {
        auth: true,
        extended: [TraktApiExtended.Full],
        parameters: {
          query: {
            ignore_collected: false,
            ignore_watchlisted: false,
          },
        },
      },
    }),
    /**
     * Hide a movie from getting recommended anymore.
     *
     * @auth required
     *
     * @see [hide-a-movie-recommendation]{@link https://trakt.docs.apiary.io/#reference/recommendations/hide-movie/hide-a-movie-recommendation}
     */
    hide: new TraktClientEndpoint<{
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    }>({
      method: HttpMethod.DELETE,
      url: '/recommendations/movies/:id',
      opts: {
        auth: true,
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
  },
  /**
   * TV show recommendations for a user. By default, 10 results are returned. You can send a limit to get up to 100 results per page.
   * Set ignore_collected=true to filter out shows the user has already collected or ignore_watchlisted=true to filter out shows the user has already watchlisted.
   *
   * The favorited_by array contains all users who favorited the item along with any notes they added.
   *
   * @extended [Full]{@link TraktApiExtended.Full}
   * @auth required
   *
   * @see [get-show-recommendations]{@link https://trakt.docs.apiary.io/#reference/recommendations/shows/get-show-recommendations}
   */
  shows: {
    get: new TraktClientEndpoint<
      {
        /** filter out collected movies */
        ignore_collected?: boolean;
        /** filter out watchlisted movies */
        ignore_watchlisted?: boolean;
      } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
      TraktRecommendation<'show'>[]
    >({
      method: HttpMethod.GET,
      url: '/recommendations/shows/?ignore_collected=false&ignore_watchlisted=false',
      opts: {
        auth: true,
        extended: [TraktApiExtended.Full],
        parameters: {
          query: {
            ignore_collected: false,
            ignore_watchlisted: false,
          },
        },
      },
    }),
    /**
     * Hide a show from getting recommended anymore.
     *
     * @auth required
     *
     * @see [hide-a-show-recommendation]{@link https://trakt.docs.apiary.io/#reference/recommendations/hide-show/hide-a-show-recommendation}
     */
    hide: new TraktClientEndpoint<{
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    }>({
      method: HttpMethod.DELETE,
      url: '/recommendations/shows/:id',
      opts: {
        auth: true,
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
  },
};

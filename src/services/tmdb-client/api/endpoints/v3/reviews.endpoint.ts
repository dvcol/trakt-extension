import type { TmdbReviewExtended } from '~/models/tmdb/tmdb-review.model';

import { TmdbClientEndpoint } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Review v3 endpoints.
 */
export const reviews = {
  /**
   * Retrieve the details of a movie or TV show review.
   *
   * @version 3
   *
   * @see [review]{@link https://developer.themoviedb.org/reference/review-details}
   */
  details: new TmdbClientEndpoint<
    {
      review_id: string | number;
    },
    TmdbReviewExtended
  >({
    method: HttpMethod.GET,
    url: '/review/:review_id',
    opts: {
      version: 3,
      parameters: {
        path: {
          review_id: true,
        },
      },
    },
  }),
};

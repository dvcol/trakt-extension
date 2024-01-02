import type { TraktEpisode, TraktMovie, TraktSharing, TraktShow } from '~/models/trakt-entity.model';

import { TraktClientEndpoint } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

/**
 * Checking in is a manual action used by mobile apps allowing the user to indicate what they are watching right now. While not as effortless as scrobbling, checkins help fill in the gaps.
 * You might be watching live tv, at a friend's house, or watching a movie in theaters. You can simply checkin from your phone or tablet in those situations.
 * The item will display as watching on the site, then automatically switch to watched status once the duration has elapsed.
 *
 * @see {@link https://trakt.docs.apiary.io/#reference/checkin}
 */
export const checkin = {
  /**
   * Check into a movie or episode. This should be tied to a user action to manually indicate they are watching something.
   * The item will display as watching on the site, then automatically switch to watched status once the duration has elapsed.
   * A unique history id (64-bit integer) will be returned and can be used to reference this checkin directly.
   *
   * note: For episode checkin you can either provide episode ids, or the show and either episode's season & number or episodes's number_abs
   *
   * @auth true
   *
   * @see {@link https://trakt.docs.apiary.io/#reference/checkin/checkin/check-into-an-item}
   */
  add: new TraktClientEndpoint<
    {
      /**
       * Control sharing to any connected social networks.
       *
       * The sharing object is optional and will apply the user's settings if not sent.
       * If sharing is sent, each key will override the user's setting for that social network.
       * Send true to post or false to not post on the indicated social network.
       * You can see which social networks a user has connected with the /users/settings method.
       *
       * note: If a checkin is already in progress, a 409 HTTP status code will returned. The response will contain an expires_at timestamp which is when the user can check in again.
       */
      sharing?: TraktSharing;
      /** Message used for sharing. If not sent, it will use the watching string in the user settings. */
      message?: string;
    } & (
      | {
          /** Movie to be checked-in */
          movie: TraktMovie;
        }
      | {
          /** Episode to be checked-in. If no show is provided, traktv ids are required */
          episode: Partial<TraktEpisode> & Pick<TraktEpisode, 'ids'>;
        }
      | {
          show: TraktShow;
          /** Episode to be checked-in. If no traktv ids is provided, either episode's season & number or number_abs is required */
          episode: Partial<TraktEpisode> & (Pick<TraktEpisode, 'season' | 'number'> | Pick<TraktEpisode, 'number_abs'>);
        }
    )
  >({
    method: HttpMethod.POST,
    url: '/checkin',
    opts: {
      auth: true,
    },
    body: {
      sharing: false,
      message: false,

      movie: false,
      episode: false,
      show: false,
    },
  }),
  /**
   * Removes any active checkins, no need to provide a specific item.
   *
   * @see {@link https://trakt.docs.apiary.io/#reference/checkin/checkin/delete-any-active-checkins}
   */
  delete: new TraktClientEndpoint({
    method: HttpMethod.DELETE,
    url: '/checkin',
    opts: {
      auth: true,
    },
  }),
};

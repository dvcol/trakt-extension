import type { ITraktApi } from '~/models/trakt-client.model';

import type { TraktEpisode, TraktMovie, TraktShow } from '~/models/trakt-entity.model';
import type { TraktApiCommonFilters } from '~/services/trakt-client/api/trakt-api.filters';

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
   * @auth true
   *
   * @see {@link https://trakt.docs.apiary.io/#reference/checkin/checkin/check-into-an-item}
   */
  add: new TraktClientEndpoint<
    {
      sharing?: {
        twitter: boolean;
        mastodon: boolean;
        tumblr: boolean;
      };
      message?: string;
      movie?: TraktMovie;
      episode?: Partial<TraktEpisode> & (Pick<TraktEpisode, 'ids'> | Pick<TraktEpisode, 'season' | 'number'>);
      show?: TraktShow;
    },
    TraktApiCommonFilters
  >({
    method: HttpMethod.POST,
    url: '/checkin',
    opts: {
      auth: true,
    },
    body: {
      /**
       * The sharing object is optional and will apply the user's settings if not sent.
       * If sharing is sent, each key will override the user's setting for that social network.
       * Send true to post or false to not post on the indicated social network.
       * You can see which social networks a user has connected with the /users/settings method.
       *
       * If a checkin is already in progress, a 409 HTTP status code will returned. The response will contain an expires_at timestamp which is when the user can check in again.
       */
      sharing: false,
      /** Message used for sharing. If not sent, it will use the watching string in the user settings. */
      message: false,

      movie: false,
      episode: false,
      show: false,
    },
    validate: param => {
      if (!param.movie && !param.episode && !param.show) {
        throw new Error('A required field is missing, please provide either movie, episode or show.');
      }
      if (param.episode && !param.episode.ids && !param.show) {
        throw new Error('Episode checkin requires either episode.ids or episode & show.');
      }
      return true;
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
} satisfies ITraktApi;

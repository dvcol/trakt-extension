import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TraktCheckin, TraktCheckinRequest } from '~/models/trakt/trakt-checkin.model';

import { TraktClientEndpoint } from '~/models/trakt/trakt-client.model';

/**
 * Checking in is a manual action used by mobile apps allowing the user to indicate what they are watching right now. While not as effortless as scrobbling, checkins help fill in the gaps.
 * You might be watching live tv, at a friend's house, or watching a movie in theaters. You can simply checkin from your phone or tablet in those situations.
 * The item will display as watching on the site, then automatically switch to watched status once the duration has elapsed.
 *
 * @see [checkin]{@link https://trakt.docs.apiary.io/#reference/checkin}
 */
export const checkin = {
  /**
   * Check into a movie or episode. This should be tied to a user action to manually indicate they are watching something.
   * The item will display as watching on the site, then automatically switch to watched status once the duration has elapsed.
   * A unique history id (64-bit integer) will be returned and can be used to reference this checkin directly.
   *
   * Note: For episode checkin you can either provide episode ids, or the show and either episode's season & number or episodes's number_abs
   *
   * @auth required
   *
   * @throws TraktCheckinError
   *
   * @see [check-into-an-item]{@link https://trakt.docs.apiary.io/#reference/checkin/checkin/check-into-an-item}
   */
  add: new TraktClientEndpoint<TraktCheckinRequest, TraktCheckin, false>({
    method: HttpMethod.POST,
    url: '/checkin',
    opts: {
      auth: true,
      cache: false,
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
   * @see [delete-any-active-checkins]{@link https://trakt.docs.apiary.io/#reference/checkin/checkin/delete-any-active-checkins}
   */
  delete: new TraktClientEndpoint<Record<string, never>, unknown, false>({
    method: HttpMethod.DELETE,
    url: '/checkin',
    opts: {
      auth: true,
      cache: false,
    },
  }),
};

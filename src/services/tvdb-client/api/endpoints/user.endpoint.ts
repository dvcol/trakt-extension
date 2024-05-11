import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TvdbUser } from '~/models/tvdb/tvdb-user.model';

import { TvdbClientEndpoint } from '~/models/tvdb/tvdb-client.model';

/**
 * User endpoints
 *
 * @see [user]{@link https://thetvdb.github.io/v4-api/#/User}
 */
export const user = {
  /**
   * Returns a list of user information.
   *
   * @auth required
   *
   * @see [get-user]{@link https://thetvdb.github.io/v4-api/#/User%20info/getUserInfo}
   */
  all: new TvdbClientEndpoint<Record<string, never>, TvdbUser[]>({
    method: HttpMethod.GET,
    url: '/user',
    opts: {
      auth: true,
    },
  }),
  /**
   * Returns a single user information.
   *
   * @auth required
   *
   * @see [get-user]{@link https://thetvdb.github.io/v4-api/#/User%20info/getUserInfoById}
   */
  get: new TvdbClientEndpoint<
    {
      id: number | string;
    },
    TvdbUser
  >({
    method: HttpMethod.GET,
    url: '/user/:id',
    opts: {
      auth: true,
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
};

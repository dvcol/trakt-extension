import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TmdbAuthAccessToken, TmdbAuthRequestToken } from '~/models/tmdb/tmdb-auth.model';

import { TmdbClientEndpoint } from '~/models/tmdb/tmdb-client.model';

/**
 * Authentication v4 endpoints.
 */
export const auth = {
  /**
   * This is step #1 from the [user authentication]{@link https://developer.themoviedb.org/v4/docs/authentication-user} page.
   *
   * This method generates a new request token that you can ask a user to approve.
   * This is the first step in getting permission from a user to read and write data on their behalf.
   *
   * The next step will be to have the user approve the request token via a redirect to TMDb using the following URL:
   * {@link https://www.themoviedb.org/auth/access?request_token={request_token}}
   *
   * Where request_token is the value of the request_token you retrieved in the previous step.
   *
   * You can think of a request token as a temporary token that is waiting for the TMDB user to authorize on your behalf.
   * It serves no other purpose and cannot be used for authenticating requests.
   * Unused request tokens will automatically expire after <b>15 minutes</b>.
   *
   * * <b>📘 Note</b>
   *
   * An optional post  body can be added alongside this request to set a redirect URL or callback that will be executed once a request token has been approved on TMDB.
   * If no redirect is set, the user will be redirected to {@link https://www.themoviedb.org/auth/access/approve}
   *
   * @example POST Body
   * {
   *   "redirect_to": "https://www.themoviedb.org/"
   * }
   *
   * @auth read-token
   * @version 4
   *
   * @see [create-request-token]{@link https://developer.themoviedb.org/v4/reference/auth-create-request-token}
   */
  request: new TmdbClientEndpoint<
    {
      /** Redirect URL or callback that will be executed once a request token has been approved on TMDB. */
      redirect_to?: string;
    },
    TmdbAuthRequestToken,
    false
  >({
    method: HttpMethod.POST,
    url: '/auth/request_token',
    opts: {
      cache: false,
      version: 4,
    },
    body: {
      redirect_to: false,
    },
  }),
  /**
   * This is step #3 from the [user authentication]{@link https://developer.themoviedb.org/v4/docs/authentication-user} page.
   *
   * This method will finish the user authentication flow and issue an official user access token.
   * The request token in this request is sent along as part of the POST body.
   * You should still use your standard API read access token for authenticating this request.
   *
   * Please provide the request token you received in the [first step]{@link https://developer.themoviedb.org/v4/reference/auth-create-request-token}.
   *
   * Access tokens do not expire once they have been authenticated.
   *
   * @auth read-token
   * @version 4
   *
   * @see [create-access-token]{@link https://developer.themoviedb.org/v4/reference/auth-create-access-token}
   */
  access: new TmdbClientEndpoint<
    {
      /** The request token that was approved by the user in the login flow. */
      request_token: string;
    },
    TmdbAuthAccessToken,
    false
  >({
    method: HttpMethod.POST,
    url: '/auth/access_token',
    opts: {
      cache: false,
      version: 4,
    },
    body: {
      request_token: true,
    },
  }),
  /**
   * Log out of a session with the access token you received from the [create access token]{@link https://developer.themoviedb.org/v4/reference/auth-create-access-token} method.
   *
   * @auth read-token
   * @version 4
   *
   * @see [delete-access-token]{@link https://developer.themoviedb.org/v4/reference/auth-logout}
   */
  logout: new TmdbClientEndpoint<
    {
      /** The request token that was returned from the final step of the login process */
      access_token: string;
    },
    Record<string, never>,
    false
  >({
    method: HttpMethod.DELETE,
    url: '/auth/access_token',
    opts: {
      cache: false,
      version: 4,
    },
  }),
};

import type { TmdbClientAuthentication } from '~/models/tmdb/tmdb-client.model';

import { BaseTmdbClient } from '~/services/tmdb-client/clients/base-tmdb-client';
import { Config } from '~/settings/tmdb.api';
import { createTab } from '~/utils/browser/browser.utils';

/**
 * TmdbClient is a wrapper around the TmdbApi to provide basic authentication and state management.
 *
 * @class TmdbClient
 *
 * @extends {BaseTmdbClient}
 */
export class TmdbClient extends BaseTmdbClient {
  /**
   * This is step #1 from the [user authentication]{@link https://developer.themoviedb.org/v4/docs/authentication-user} page.
   *
   * This method generates a new request token that is used to generate the url (redirect-approve) that you should forward the user to, so that they may approve the request token.
   *
   * An optional redirect_to parameter can be added alongside this request to set a redirect URL that will be executed once a request token has been approved on TMDB.
   *
   * @param redirect_to - The URL to redirect to after the user has approved the request token.
   *
   * @returns A promise resolving to the request token and redirect information.
   */
  async requestUserToken(redirect?: boolean, redirect_to?: string) {
    const response = await this.v4.auth.request({ redirect_to });

    const { request_token } = await response.json();

    if (redirect) createTab({ url: `${Config.requestTokenUrl}${request_token}` });

    return {
      request_token,
      expires: Date.now() + this.settings.requestTokenTTL,
      redirect_to,
      redirect_approve: `${Config.requestTokenUrl}${request_token}`,
    };
  }

  /**
   * This is step #3 from the [user authentication]{@link https://developer.themoviedb.org/v4/docs/authentication-user} page.
   *
   * This method will finish the user authentication flow and issue an official user access token.
   * Please provide the request token you received in the [first step]{@link requestUserToken}.
   *
   * @param request_token - The request token that was approved by the user in the login flow.
   *
   * @returns A promise resolving to the authentication information (including the access token).
   */
  async login(request_token: string) {
    const response = await this.v4.auth.access({ request_token });

    const { access_token } = await response.json();

    this.updateAuth(_auth => ({ ..._auth, accessToken: access_token }));

    return this.auth;
  }

  /**
   * Log out of a session with the access token you received from the {@link login} method.
   * The access token will be invalidated and cannot be used again.
   *
   * @param access_token - The access token to invalidate.
   *
   * @returns A promise resolving to the new authentication information.
   */
  async logout(access_token: string) {
    await this.v4.auth.logout({ access_token });

    this.updateAuth(_auth => ({ ..._auth, accessToken: undefined }));

    return this.auth;
  }

  /**
   * Imports the provided authentication information into the client.
   *
   * @param auth - The  authentication information to import.
   *
   * @returns A promise resolving to the imported authentication information.
   */
  importAuthentication(auth: TmdbClientAuthentication): TmdbClientAuthentication {
    this.updateAuth(auth);
    return this.auth;
  }
}

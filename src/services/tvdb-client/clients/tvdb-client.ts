import type { TvdbClientAuthentication, TvdbClientOptions } from '~/models/tvdb/tvdb-client.model';

import { tvdbApi } from '~/services/tvdb-client/api/tvdb-api.endpoint';
import { BaseTvdbClient } from '~/services/tvdb-client/clients/base-tvdb-client';

/**
 * TvdbClient is a wrapper around the TvdbApi to provide basic authentication and state management.
 *
 * @class TvdbClient
 *
 * @extends {BaseTvdbClient}
 */
export class TvdbClient extends BaseTvdbClient {
  /**
   * Creates an instance of TvdbClient, with the necessary endpoints and settings.
   * @param settings - The settings for the client.
   * @param authentication - The authentication for the client.
   */
  constructor(settings: TvdbClientOptions, authentication: TvdbClientAuthentication = {}) {
    super(settings, authentication, tvdbApi);
  }

  /**
   * Authenticates the client with the setting's secret and an optionally provided user pin.
   * The access token is stored in the client and used for all subsequent requests.
   * The token expires after 28 days and will need to be refreshed.
   *
   * @param userPin - The user pin to use for authentication.
   */
  async authenticate(userPin?: string) {
    const auth = await this.login({
      apiKey: this.settings.apiKey,
      pin: userPin,
    });

    const { token } = await auth.json();

    this.updateAuth({
      accessToken: token,
      userPin,
      expires: Date.now() + this.settings.tokenTTL,
    });

    return this.auth;
  }

  /**
   * Imports the provided authentication information into the client.
   * If the access token is expired, it attempts to refresh it.
   *
   * @param auth - The  authentication information to import.
   *
   * @returns A promise resolving to the imported authentication information.
   */
  async importAuthentication(auth: TvdbClientAuthentication = {}): Promise<TvdbClientAuthentication> {
    if (auth?.expires !== undefined && auth.expires < Date.now()) return this.authenticate(auth.userPin);

    this.updateAuth(auth);
    return this.auth;
  }
}

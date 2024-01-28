import { traktApi } from '../api/trakt-api.endpoints';

import { BaseTraktClient, isResponseOk } from './base-trakt-client';

import type {
  TraktAuthentication,
  TraktAuthenticationAuthorizeRequest,
  TraktAuthenticationBaseRequest,
  TraktAuthenticationCodeRequest,
  TraktAuthenticationRefreshRequest,
  TraktAuthenticationRevokeRequest,
  TraktClientAuthentication,
  TraktDeviceAuthentication,
} from '~/models/trakt/trakt-authentication.model';
import type {
  ITraktApi,
  TraktApiInit,
  TraktApiParams,
  TraktApiResponse,
  TraktClientEndpointCall,
  TraktClientOptions,
  TraktClientSettings,
} from '~/models/trakt/trakt-client.model';

import { TraktApiHeaders, TraktClientEndpoint } from '~/models/trakt/trakt-client.model';
import { randomHex } from '~/utils/crypto.utils';

/**
 * Type guard to check if the error is a Response
 * @param error - Response or Error
 */
const isResponse = <T>(error: T | Response): error is Response => error && typeof error === 'object' && 'status' in error;

/**
 * Parse error response and return a new Error if needed.
 * @param error - Response or Error
 * @returns Error
 */
const handleError = <T>(error: T | Response) => {
  if (!isResponse(error)) return error;

  if (error.status === 401 && error.headers.has('www-authenticate')) {
    return Error(error.headers.get('www-authenticate')!);
  }
  if (error.status === 429 && error.headers.has(TraktApiHeaders.XRatelimit)) {
    return new Error(error.headers.get(TraktApiHeaders.XRatelimit)!);
  }

  return error;
};

/**
 * The extracted type signature of the TraktApi
 */
type ITraktEndpoints = typeof traktApi;

/** Needed to type Object assignment */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging  -- To allow type extension
interface TraktApi extends ITraktEndpoints {}

/**
 * Type guard to check if the template is a TraktClientEndpoint
 * @param template - TraktClientEndpoint or ITraktApi
 */
const isTraktApiTemplate = <T extends TraktApiParams = TraktApiParams>(
  template: TraktClientEndpoint<T> | ITraktApi<T>,
): template is TraktClientEndpoint<T> => template instanceof TraktClientEndpoint;

/**
 * TraktClient is a wrapper around the TraktApi to provide a more user-friendly interface.
 *
 *  @class TraktClient
 *
 *  @extends {BaseTraktClient}
 *  @implements {ITraktEndpoints}
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging -- To allow type extension
class TraktApi extends BaseTraktClient implements ITraktEndpoints {
  /**
   * Binds BaseTraktClient _call instance to the endpoint instance and the call method of the endpoint
   *
   * @private
   *
   * @param api - The TraktApi to bind to
   *
   * @example client.endpoints({ request })
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic typing
  private bindToEndpoint(api: ITraktApi<any>) {
    const client = { ...api };
    Object.entries(client).forEach(([endpoint, template]) => {
      if (isTraktApiTemplate(template) && isTraktApiTemplate(client[endpoint])) {
        const fn: TraktClientEndpointCall = (param, init) => this._call(template, param, init);

        const cachedFn: TraktClientEndpointCall = async (param, init) => {
          const key = JSON.stringify({ param, init });
          const cached = await this._cache.get(key);
          if (cached) {
            if (!this._cache.retention) return cached.value;
            const expires = cached.cachedAt + this._cache.retention;
            if (expires > Date.now()) return cached.value;
          }
          try {
            const result = await fn(param, init);
            await this._cache.set(key, {
              cachedAt: Date.now(),
              value: result,
            });
            return result;
          } catch (error) {
            this._cache.delete(key);
            throw error;
          }
        };

        Object.entries(client[endpoint]).forEach(([key, value]) => {
          if (key === 'cached') {
            Object.defineProperty(fn, 'cached', { value: cachedFn });
          } else {
            Object.defineProperty(fn, key, { value });
            Object.defineProperty(cachedFn, key, { value });
          }
        });

        Object.defineProperty(fn, 'cached', { value: cachedFn });

        client[endpoint] = fn as (typeof client)[typeof endpoint];
      } else {
        client[endpoint] = this.bindToEndpoint(client[endpoint] as ITraktApi);
      }
    });
    return client;
  }

  constructor(settings: TraktClientSettings, authentication = {}, api = traktApi) {
    super(settings, authentication);
    Object.assign(this, this.bindToEndpoint(api));
  }
}

/**
 * TraktClient is a wrapper around the TraktApi to provide basic authentication and state management.
 *
 * @class TraktClient
 *
 * @extends {TraktApi}
 */
export class TraktClient extends TraktApi {
  private polling: ReturnType<typeof setTimeout> | undefined;

  constructor(options: TraktClientOptions) {
    super(options);
  }

  /**
   * Exchanges an authorization code or refresh token for an access token.
   *
   * @private
   *
   * @param request - The request object containing the code or refresh token.
   *
   * @returns A promise resolving to the updated Trakt authentication information.
   *
   * @throws Error Throws an error if the exchange fails or an error is received from the server.
   *
   * @see handleError
   * @memberof TraktClient
   */
  private async _exchange(request: Pick<TraktAuthenticationCodeRequest, 'code'> | Pick<TraktAuthenticationRefreshRequest, 'refresh_token'>) {
    const _request: TraktAuthenticationBaseRequest = {
      client_id: this._settings.client_id,
      client_secret: this._settings.client_secret,
      redirect_uri: this._settings.redirect_uri,
      grant_type: 'code' in request ? 'authorization_code' : 'refresh_token',
      ...request,
    };

    try {
      let response: TraktApiResponse<TraktAuthentication>;
      if ('code' in _request) {
        response = await this.authentication.oAuth.token.code(_request as TraktAuthenticationCodeRequest);
      } else {
        response = await this.authentication.oAuth.token.refresh(_request as TraktAuthenticationRefreshRequest);
      }

      const body = await response.json();

      this.updateAuth(auth => ({
        ...auth,
        refresh_token: body.refresh_token,
        access_token: body.access_token,
        expires: (body.created_at + body.expires_in) * 1000,
      }));

      return body;
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Revokes the current authentication by invalidating the access token.
   *
   * @private
   *
   * @paramrequest - Additional parameters for revoking authentication.
   *
   * @returns A promise resolving when the authentication is successfully revoked.
   *
   * @throws Error Throws an error if no access token is found.
   *
   * @see isResponseOk
   * @memberof TraktClient
   */
  private async _revoke(request: Partial<TraktAuthenticationRevokeRequest> = {}) {
    if (!request && !this.auth.access_token) throw new Error('No access token found.');

    const _request: TraktAuthenticationRevokeRequest = {
      token: this.auth.access_token!,
      client_id: this._settings.client_id,
      client_secret: this._settings.client_secret,
      ...request,
    };

    const response = await this.authentication.oAuth.revoke(_request);

    isResponseOk(response);

    return response;
  }

  /**
   * Initiates device authentication and retrieves the device code.
   *
   * @private
   *
   * @template T - The type of the authentication information to be returned (string means auth token, null means codes).
   *
   * @param {T extends string | null} code - The device code (if polling) or null to initiate a new device authentication.
   *
   * @returns A promise resolving to the authentication information.
   *
   * @throws Error Throws an error if the device authentication fails.
   *
   * @see handleError
   * @memberof TraktClient
   */
  private async _device<T extends string | null>(code: T): Promise<T extends null ? TraktDeviceAuthentication : TraktAuthentication> {
    try {
      let response: TraktApiResponse<TraktAuthentication | TraktDeviceAuthentication>;
      if (code) {
        response = await this.authentication.device.token({
          client_id: this._settings.client_id,
          client_secret: this._settings.client_secret,
          code,
        });
      } else {
        response = await this.authentication.device.code({
          client_id: this._settings.client_id,
        });
      }
      return (await response.json()) as T extends null ? TraktDeviceAuthentication : TraktAuthentication;
    } catch (error) {
      throw handleError(error);
    }
  }

  private async _devicePolling(poll: TraktDeviceAuthentication, timeout: number) {
    if (timeout <= Date.now()) {
      clearInterval(this.polling);
      throw new Error('Polling expired');
    }

    try {
      const body = await this._device(poll.device_code);

      this.updateAuth(auth => ({
        ...auth,
        refresh_token: body.refresh_token,
        access_token: body.access_token,
        expires: (body.created_at + body.expires_in) * 1000,
      }));

      clearInterval(this.polling);
      return body;
    } catch (error) {
      // do nothing on 400
      if (isResponse(error) && error.status === 400) {
        console.info('Polling in progress...');
        return;
      }

      clearInterval(this.polling);
      throw error;
    }
  }

  /**
   * Gets the device code for initiating device authentication.
   *
   * The code should then be used in conjunction with the {@link pollWithDeviceCode} method to finish authentication.
   *
   * @returns A promise resolving to the device authentication information.
   *
   * @memberof TraktClient
   */
  getDeviceCode() {
    return this._device(null);
  }

  /**
   * Initiates polling with the code obtained by {@link getDeviceCode} to complete device authentication.
   *
   * @param  poll - The device authentication information.
   *
   * @returns  A promise resolving to the completed authentication information or `undefined`.
   *
   * @memberof TraktClient
   */
  pollWithDeviceCode(poll: TraktDeviceAuthentication) {
    if (this.polling) {
      clearInterval(this.polling);
      console.warn('Polling already in progress, cancelling previous one...');
    }

    const timeout = Date.now() + poll.expires_in * 1000;

    return new Promise((resolve, reject) => {
      const pollDevice = () =>
        this._devicePolling(poll, timeout)
          .then(body => {
            if (body) resolve(body);
          })
          .catch(reject);

      this.polling = setInterval(pollDevice, poll.interval * 1000);
    });
  }

  /**
   * Initiates the OAuth process by generating a URL to the Trakt website.
   * Users will be prompted to sign in and authorize the application.
   *
   * Once redirected back to the application, the code should be exchanged for an access token using {@link exchangeCodeForToken}.
   *
   * @param request - Additional parameters for the authorization request.
   * @returns A promise resolving to the response from the Trakt website.
   *
   * @see [authorize]{@link https://trakt.docs.apiary.io/#reference/authentication-oauth/authorize}
   *
   * @memberof TraktClient
   */
  redirectToAuthentication(request: Pick<TraktAuthenticationAuthorizeRequest, 'state' | 'signup' | 'prompt'> & { redirect?: RequestRedirect } = {}) {
    this.updateAuth(auth => ({ ...auth, state: request.state ?? randomHex() }));
    const init: TraktApiInit = {};
    if (request.redirect) {
      init.redirect = request.redirect;
      delete request.redirect;
    }
    return this.authentication.oAuth.authorize(
      {
        response_type: 'code',
        client_id: this._settings.client_id,
        redirect_uri: this._settings.redirect_uri,
        state: this.auth.state,
        ...request,
      },
      init,
    );
  }

  /**
   * Exchanges the authorization code obtained after the user has authorized the application with {@link redirectToAuthentication}.
   *
   * @param  code - The authorization code obtained from the user.
   * @param  state - The optional CSRF token to verify the state.
   *
   * @returns  A promise resolving to the Trakt authentication information.
   *
   * @throws Error Throws an error if the CSRF token is invalid.
   *
   * @memberof TraktClient
   */
  exchangeCodeForToken(code: string, state?: string) {
    if (state && state !== this.auth.state) throw Error('Invalid CSRF (State)');
    return this._exchange({ code });
  }

  /**
   * Refreshes the access token using the refresh token.
   *
   * @returns  A promise resolving to the updated Trakt authentication information.
   *
   * @throws Error Throws an error if no refresh token is found.
   *
   * @memberof TraktClient
   */
  refreshToken() {
    if (!this.auth.refresh_token) {
      throw new Error('No refresh token found.');
    }
    return this._exchange({ refresh_token: this.auth.refresh_token });
  }

  /**
   * Revokes the current authentication by invalidating the access token.
   *
   * @returns  A promise resolving when the authentication is successfully revoked.
   *
   * @throws Error Throws an error if no access token is found.
   *
   * @memberof TraktClient
   */
  async revokeAuthentication(): Promise<void> {
    if (this.auth.access_token) {
      await this._revoke();
      this.updateAuth({});
    }
  }

  /**
   * Imports the provided Trakt authentication information into the client.
   * If the access token is expired, it attempts to refresh it.
   *
   * @param auth - The Trakt authentication information to import.
   *
   * @returns A promise resolving to the imported Trakt authentication information.
   *
   * @memberof TraktClient
   */
  async importAuthentication(auth: TraktClientAuthentication): Promise<TraktClientAuthentication> {
    this.updateAuth(auth);

    if (auth.expires && auth.expires < Date.now()) await this.refreshToken();
    return this.auth;
  }
}

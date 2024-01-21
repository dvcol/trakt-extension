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
} from '~/models/trakt-authentication.model';
import type { ITraktApi, TraktApiParams, TraktApiResponse, TraktClientEndpointCall, TraktClientSettings } from '~/models/trakt-client.model';

import { TraktApiHeaders, TraktClientEndpoint } from '~/models/trakt-client.model';
import { randomHex } from '~/utils/crypto.utils';

const isResponse = <T>(error: T | Response): error is Response => error && typeof error === 'object' && 'statusCode' in error;

const handleError = <T>(error: T | Response) => {
  if (!isResponse(error)) throw error;

  if (error.status === 401 && error.headers.has('www-authenticate')) {
    throw Error(error.headers.get('www-authenticate')!);
  } else if (error.status === 429 && error.headers.has(TraktApiHeaders.XRatelimit)) {
    throw new Error(error.headers.get(TraktApiHeaders.XRatelimit)!);
  }

  throw error;
};

type ITraktEndpoints = typeof traktApi;

/** Needed to type Object assignment */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface TraktApi extends ITraktEndpoints {}

const isTraktApiTemplate = <T extends TraktApiParams = TraktApiParams>(
  template: TraktClientEndpoint<T> | ITraktApi<T>,
): template is TraktClientEndpoint<T> => template instanceof TraktClientEndpoint;

/** To allow type extension */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class TraktApi extends BaseTraktClient implements ITraktEndpoints {
  /**
   * Binds BaseTraktClient _call instance to the endpoint instance and the call method of the endpoint
   *
   * @param api
   *
   * @private
   *
   * @example client.endpoints({ request })
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic typing
  private bindToEndpoint(api: ITraktApi<any>) {
    const client = { ...api };
    Object.entries(client).forEach(([endpoint, template]) => {
      if (isTraktApiTemplate(template) && isTraktApiTemplate(client[endpoint])) {
        const fn: TraktClientEndpointCall = param => this._call(template, param);
        Object.entries(client[endpoint]).forEach(([key, value]) => {
          Object.defineProperty(fn, key, { value });
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic typing
        client[endpoint] = fn as any;
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

export class TraktClient extends TraktApi {
  constructor({
    client_id,
    client_secret,
    redirect_uri,

    useragent,
    endpoint,

    debug,
  }: TraktClientSettings) {
    super({
      client_id,
      client_secret,
      redirect_uri,
      useragent,
      endpoint,
      debug,
    });
  }

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

      this._authentication.update(auth => ({
        ...auth,
        refresh_token: body.refresh_token,
        access_token: body.access_token,
        expires: (body.created_at + body.expires_in) * 1000,
      }));

      return body;
    } catch (error) {
      handleError(error);
    }
  }

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

  private async _device(code?: string) {
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
      return response.json();
    } catch (error) {
      handleError(error);
    }
  }

  deviceGetCode() {
    return this._device();
  }

  devicePollToken(codes: TraktDeviceAuthentication) {
    // TODO polling logic
    return this._device(codes.device_code);
  }

  /**
   * Generate URL to the Trakt website which will request auth credentials.
   * If the user isn't signed into Trakt, it will ask them to do so.
   *
   * @see [authorize]{@link https://trakt.docs.apiary.io/#reference/authentication-oauth/authorize}
   */
  authorizeUrl(request: Pick<TraktAuthenticationAuthorizeRequest, 'state' | 'signup' | 'prompt'> = {}) {
    this._authentication.update(auth => ({ ...auth, state: request.state ?? randomHex() }));
    return this.authentication.oAuth.authorize({
      response_type: 'code',
      client_id: this._settings.client_id,
      redirect_uri: this._settings.redirect_uri,
      state: this.auth.state,
      ...request,
    });
  }

  exchangeCode(code: string, state?: string) {
    if (state && state !== this.auth.state) throw Error('Invalid CSRF (State)');
    return this._exchange({ code });
  }

  refreshToken() {
    if (!this.auth.refresh_token) {
      throw new Error('No refresh token found.');
    }
    return this._exchange({ refresh_token: this.auth.refresh_token });
  }

  async revokeAuthentication(): Promise<void> {
    if (this.auth.access_token) {
      await this._revoke();
      this._authentication.update({});
    }
  }

  async importAuthentication(auth: TraktClientAuthentication): Promise<TraktClientAuthentication> {
    this._authentication.update(auth);

    if (auth.expires && auth.expires < Date.now()) await this.refreshToken();
    return this.auth;
  }
}

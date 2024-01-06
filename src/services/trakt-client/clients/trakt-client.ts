/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging -- necessary for infer signature from assign */

import { traktApi } from '../api/trakt-api.endpoints';

import { BaseTraktClient, isResponseOk } from './base-trakt-client';

import type {
  ITraktApi,
  TraktApiParams,
  TraktApiRequest,
  TraktClientAuthentication,
  TraktClientAuthenticationRequest,
  TraktClientEndpoint,
  TraktClientSettings,
} from '~/models/trakt-client.model';

import { TraktApiHeaders } from '~/models/trakt-client.model';
import { Client, Config } from '~/settings/traktv.api';
import { randomHex } from '~/utils/crypto.utils';
import { HttpMethod } from '~/utils/http.utils';

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
interface TraktApi extends ITraktEndpoints {}

const isTraktApiTemplate = <T extends TraktApiParams = TraktApiParams>(
  template: TraktClientEndpoint<T> | ITraktApi<T>,
): template is TraktClientEndpoint<T> => 'call' in template;

/** To allow type extension */
class TraktApi extends BaseTraktClient implements ITraktEndpoints {
  /* eslint-disable @typescript-eslint/no-explicit-any -- generic typing */
  /**
   * Binds BaseTraktClient _call instance to the endpoint instance and the call method of the endpoint
   *
   * @param template
   *
   * @example client.endpoints({ request }) or client.endpoints.call({ request }) for type inference
   */
  bindToEndpoint(template: ITraktApi<any>) {
    const api = { ...template };
    Object.entries(api).forEach(([key, value]) => {
      if (isTraktApiTemplate(value) && isTraktApiTemplate(api[key])) {
        const fn: TraktClientEndpoint['call'] = param => this._call(value, param);
        Object.entries(api[key]).forEach(([k, v]) => {
          Object.defineProperty(fn, k, {
            value: k === 'call' ? fn : v,
          });
        });
        api[key] = fn as any;
      } else {
        api[key] = this.bindToEndpoint(api[key] as ITraktApi);
      }
    });
    return api;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any -- generic typing */

  constructor(settings: TraktClientSettings, authentication = {}, api = traktApi) {
    super(settings, authentication);
    Object.assign(this, this.bindToEndpoint(api));
  }
}

export class TraktClient extends TraktApi {
  get authentication(): TraktClientAuthentication {
    return {
      access_token: this._authentication.access_token,
      refresh_token: this._authentication.refresh_token,
      expires: this._authentication.expires,
      state: this._authentication.state,
    };
  }

  constructor({
    client_id = Client.ID,
    client_secret = Client.Secret,
    redirect_uri = Config.RedirectionUrl,

    useragent = Config.UserAgent,
    endpoint = Config.TraktEndpoint,
    debug,
    pagination,
  }: Partial<TraktClientSettings> = {}) {
    super({
      client_id,
      client_secret,
      redirect_uri,
      useragent,
      endpoint,
      debug,
      pagination,
    });
  }

  /**
   * Exchange oauth token to authenticate client's calls
   * @param auth
   */
  private async _exchange(auth: TraktClientAuthenticationRequest) {
    const req: TraktApiRequest = {
      input: `${this._settings.endpoint}/oauth/token`,
      init: {
        method: HttpMethod.POST,
        headers: {
          [TraktApiHeaders.UserAgent]: this._settings.useragent,
          [TraktApiHeaders.ContentType]: 'application/json',
        },
        body: JSON.stringify(auth),
      },
    };

    super.debug(req);

    try {
      const response = await fetch(req.input, req.init);

      isResponseOk(response);

      const body = await response.json();

      this._authentication.refresh_token = body.refresh_token;
      this._authentication.access_token = body.access_token;
      this._authentication.expires = (body.created_at + body.expires_in) * 1000;

      return body;
    } catch (error) {
      handleError(error);
    }
  }

  /**
   * Revoke current authentication
   */
  private async _revoke() {
    const req: TraktApiRequest = {
      input: `${this._settings.endpoint}/oauth/revoke`,
      init: {
        method: HttpMethod.POST,
        headers: {
          [TraktApiHeaders.UserAgent]: this._settings.useragent,
          [TraktApiHeaders.ContentType]: 'application/json',
        },
        body: JSON.stringify({
          token: this._authentication.access_token,
          client_id: this._settings.client_id,
          client_secret: this._settings.client_secret,
        }),
      },
    };

    super.debug(req);

    const response = await fetch(req.input, req.init);

    isResponseOk(response);

    return response;
  }

  /**
   * Get remember device code to paste on login screen
   * @param auth
   * @param mode the type of code (i.e. code or token)
   */
  private async _deviceCode(auth: Partial<TraktClientAuthenticationRequest>, mode: 'code' | 'token' = 'code' in auth ? 'token' : 'code') {
    const req: TraktApiRequest = {
      input: `${this._settings.endpoint}/oauth/device/${mode}`,
      init: {
        method: HttpMethod.POST,
        headers: {
          [TraktApiHeaders.UserAgent]: this._settings.useragent,
          [TraktApiHeaders.ContentType]: 'application/json',
        },
        body: JSON.stringify(auth),
      },
    };

    super.debug(req);

    try {
      const response = await fetch(req.input, req.init);
      isResponseOk(response);
      return response.json();
    } catch (error) {
      handleError(error);
    }
  }

  /**
   * Get authentication url for browsers
   */
  getUrl() {
    this._authentication.state = randomHex();
    // Replace 'api' from the api_url to get the top level trakt domain
    const base_url = this._settings.endpoint.replace(/api\W/, '');
    return `${base_url}/oauth/authorize?response_type=code&client_id=${this._settings.client_id}&redirect_uri=${this._settings.redirect_uri}&state=${this._authentication.state}`;
  }

  /**
   * Verify code; optional state
   * @param code
   * @param state
   */
  exchangeCode(code: string, state: string) {
    if (state && state !== this._authentication.state) throw Error('Invalid CSRF (State)');

    return this._exchange({
      code,
      client_id: this._settings.client_id,
      client_secret: this._settings.client_secret,
      redirect_uri: this._settings.redirect_uri,
      grant_type: 'authorization_code',
    });
  }

  /**
   * Get authentication codes for devices
   */
  getCodes() {
    return this._deviceCode(
      {
        client_id: this._settings.client_id,
      },
      'code',
    );
  }

  /**
   * Refresh access token
   */
  refreshToken() {
    if (!this._authentication.refresh_token) {
      throw new Error('No refresh token found.');
    }
    return this._exchange({
      refresh_token: this._authentication.refresh_token,
      client_id: this._settings.client_id,
      client_secret: this._settings.client_secret,
      redirect_uri: this._settings.redirect_uri,
      grant_type: 'refresh_token',
    });
  }

  /**
   * Import tokens
   * @param auth
   */
  async importAuthentication(auth: TraktClientAuthentication): Promise<TraktClientAuthentication> {
    this.authentication.access_token = auth.access_token;
    this.authentication.expires = auth.expires;
    this.authentication.refresh_token = auth.refresh_token;

    if (auth.expires && auth.expires < Date.now()) await this.refreshToken();
    return this.authentication;
  }

  /**
   * Revoke authentication
   */
  async revokeAuthentication(): Promise<void> {
    if (this.authentication.access_token) {
      await this._revoke();
      this._authentication = {};
    }
  }
}

/* eslint-enable @typescript-eslint/no-unsafe-declaration-merging  */
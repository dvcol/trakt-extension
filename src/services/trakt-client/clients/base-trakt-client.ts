import type { TraktClientAuthentication } from '~/models/trakt/trakt-authentication.model';
import type {
  TraktApiInit,
  TraktApiParams,
  TraktApiQuery,
  TraktApiRequest,
  TraktApiResponse,
  TraktApiTemplate,
  TraktClientOptions,
  TraktClientSettings,
} from '~/models/trakt/trakt-client.model';

import type { CacheStore } from '~/utils/cache.utils';
import type { Primitive } from '~/utils/typescript.utils';

import { TraktApiHeaders } from '~/models/trakt/trakt-client.model';

import { isFilter, TraktApiFilterValidator } from '~/services/trakt-client/api/trakt-api.filters';
import { CancellableFetch } from '~/utils/fetch.utils';
import { Observable, ObservableState, type Observer, type Updater } from '~/utils/observable.utils';

/**
 * Parses body from {@link TraktApiTemplate} into stringifies {@link BodyInit}
 *
 * @private
 *
 * @template T - The type of the parameters.
 *
 * @param {TraktApiTemplate<T>['body']} [body={}] - The expected body structure.
 * @param {T} params - The actual parameters.
 *
 * @returns {BodyInit} The parsed request body.
 */
export const parseBody = <T extends TraktApiParams = TraktApiParams>(body: TraktApiTemplate<T>['body'] = {}, params: T): BodyInit => {
  const _body: Record<string, unknown> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (key in body) _body[key] = value;
  });

  Object.keys(body).forEach(key => {
    if (body[key] === true && !(key in _body)) throw new Error(`Missing mandatory body parameter: '${key}'`);
  });

  return JSON.stringify(_body);
};

/**
 * Checks if the fetch response is OK and handles redirects.
 *
 * @private
 *
 * @param  response - The fetch response.
 *
 * @returns  The same response object if OK.
 *
 * @throws Throws the response if not OK.
 */
export const isResponseOk = (response: Response) => {
  if (response.type === 'opaqueredirect') return response;
  if (!response.ok || response.status >= 400) throw response;
  return response;
};

/**
 * Parses a Trakt API response to extract {@link TraktClientPagination} and other information.
 *
 * @private
 *
 * @template T - The type of the response.
 *
 * @param {Response} response - The fetch response.
 *
 * @returns {TraktApiResponse<T>} The parsed Trakt API response.
 */
export const parseResponse = <T>(response: Response): TraktApiResponse<T> => {
  isResponseOk(response);

  const _response = response as TraktApiResponse<T>;

  if (
    response.headers.has(TraktApiHeaders.XPaginationItemCount) ||
    response.headers.has(TraktApiHeaders.XPaginationPageCount) ||
    response.headers.has(TraktApiHeaders.XPaginationLimit) ||
    response.headers.has(TraktApiHeaders.XPaginationPage)
  ) {
    _response.pagination = {
      itemCount: Number(response.headers.get(TraktApiHeaders.XPaginationItemCount)),
      pageCount: Number(response.headers.get(TraktApiHeaders.XPaginationPageCount)),
      limit: Number(response.headers.get(TraktApiHeaders.XPaginationLimit)),
      page: Number(response.headers.get(TraktApiHeaders.XPaginationPage)),
    };
  }

  if (response.headers.has(TraktApiHeaders.XSortBy) || response.headers.has(TraktApiHeaders.XSortHow)) {
    _response.sort = {
      by: response.headers.get(TraktApiHeaders.XSortBy),
      how: response.headers.get(TraktApiHeaders.XSortHow),
    };
  }

  if (response.headers.has(TraktApiHeaders.XAppliedSortBy) || response.headers.has(TraktApiHeaders.XAppliedSortHow)) {
    _response.appliedSort = {
      by: response.headers.get(TraktApiHeaders.XAppliedSortBy),
      how: response.headers.get(TraktApiHeaders.XAppliedSortHow),
    };
  }

  if (response.headers.has(TraktApiHeaders.XStartDate) || response.headers.has(TraktApiHeaders.XEndDate)) {
    _response.interval = {
      start: response.headers.get(TraktApiHeaders.XStartDate),
      end: response.headers.get(TraktApiHeaders.XEndDate),
    };
  }

  if (
    response.headers.has(TraktApiHeaders.XUpgradeURL) ||
    response.headers.has(TraktApiHeaders.XVipUser) ||
    response.headers.has(TraktApiHeaders.XAccountLimit)
  ) {
    _response.vip = {
      url: response.headers.get(TraktApiHeaders.XUpgradeURL),
      user: response.headers.get(TraktApiHeaders.XVipUser),
      limit: response.headers.get(TraktApiHeaders.XAccountLimit),
    };
  }

  return _response;
};

/**
 * Represents a Trakt API client with common functionality.
 *
 * @class BaseTraktClient
 */
export class BaseTraktClient {
  protected _cache: CacheStore<TraktApiResponse>;
  protected _settings: TraktClientSettings;
  protected _authentication: ObservableState<TraktClientAuthentication>;
  protected _callListeners: Observable<TraktApiQuery<unknown>>;

  /**
   * Clears the cache entry for the specified key.
   * If no key is provided, clears the entire cache.
   *
   * @param key - The cache key.
   */
  clearCache(key?: string) {
    if (key) return this._cache?.delete(key);
    return this._cache?.clear();
  }

  /**
   * Gets the authentication information.
   *
   * @readonly
   * @type {TraktClientAuthentication}
   */
  get auth() {
    return this._authentication.state;
  }

  /**
   * Updates the authentication information.
   * @param auth - The new authentication information.
   *
   * @protected
   */
  protected updateAuth(auth: Updater<TraktClientAuthentication>) {
    this._authentication.update(auth);
  }

  /**
   * Subscribes to changes in authentication information.
   * Emits the current authentication information on auth related changes (oAuth calls, token revocation, token refresh, etc.).
   *
   * @param observer - The observer function.
   * @returns A function to unsubscribe from changes.
   */
  onAuthChange(observer: Observer<TraktClientAuthentication | undefined>) {
    return this._authentication.subscribe(observer);
  }

  /**
   * Subscribes to Trakt API queries.
   * Emits query information on every call to the Trakt API.
   *
   * @param observer - The observer function.
   * @returns A function to unsubscribe from queries.
   */
  onCall(observer: Observer<TraktApiQuery<unknown>>) {
    return this._callListeners.subscribe(observer);
  }

  /**
   * Unsubscribes observers from authentication and call listeners.
   * If no observer is provided, unsubscribes all observers.
   *
   * @param observer - The observer to be removed.
   */
  unsubscribe(observer?: Observer<TraktClientAuthentication | undefined | TraktApiQuery<unknown>>) {
    return {
      auth: this._authentication.unsubscribe(observer),
      call: this._callListeners.unsubscribe(observer),
    };
  }

  constructor({ cacheStore, ...settings }: TraktClientOptions, authentication = {}) {
    this._settings = settings;
    this._authentication = new ObservableState(authentication);
    this._callListeners = new Observable();
    this._cache = cacheStore ?? new Map();
  }

  /**
   * Calls the Trakt API with the given template and parameters.
   *
   * @protected
   *
   * @template P - The type of the parameters.
   * @template R - The type of the response.
   *
   * @param {TraktApiTemplate<P>} template - The template for the API endpoint.
   * @param {P} [params={}] - The parameters for the API call.
   * @param {TraktApiInit} [init] - Additional initialization options.
   *
   * @returns {Promise<TraktApiResponse<R>>} A promise that resolves to the API response.
   */
  protected async _call<P extends TraktApiParams = TraktApiParams, R = unknown>(
    template: TraktApiTemplate<P>,
    params: P = {} as P,
    init?: TraktApiInit,
  ): Promise<TraktApiResponse<R>> {
    const headers: HeadersInit = {
      [TraktApiHeaders.UserAgent]: this._settings.useragent,
      [TraktApiHeaders.ContentType]: 'application/json',
      [TraktApiHeaders.TraktApiVersion]: '2',
      [TraktApiHeaders.TraktApiKey]: this._settings.client_id,
    };

    if (template.opts?.auth && this.auth.access_token) {
      headers.Authorization = `Bearer ${this.auth.access_token}`;
    } else if (template.opts?.auth === true && !this.auth.access_token) {
      throw Error('OAuth required: access_token is missing');
    }

    const _params = template.transform?.(params) ?? params;

    template.validate?.(_params);

    const req: TraktApiRequest = {
      input: this._parse(template, _params),
      init: {
        ...template.init,
        ...init,
        method: template.method,
        headers: {
          ...template.init?.headers,
          ...headers,
          ...init?.headers,
        },
      },
    };

    if (template.method !== 'GET' && template.body) {
      req.init.body = parseBody(template.body, _params);
    }

    const query = CancellableFetch.fetch<TraktApiResponse<R>>(req.input, req.init).then(parseResponse);

    this._callListeners.update({ request: req, query });

    return query;
  }

  /**
   * Parses the parameters and constructs the URL for a Trakt API request.
   *
   * @private
   *
   * @template T - The type of the parameters.
   *
   * @param {TraktApiTemplate<T>} template - The template for the API endpoint.
   * @param {T} params - The parameters for the API call.
   *
   * @returns {RequestInfo} The URL for the Trakt API request.
   *
   * @throws {Error} Throws an error if mandatory parameters are missing or if a filter is not supported.
   */
  protected _parse<T extends TraktApiParams = TraktApiParams>(template: TraktApiTemplate<T>, params: T): RequestInfo {
    // fill query parameters i.e. ?variable
    const [pathPart, queryPart] = template.url.split('?');

    let path = pathPart;
    const queryParams: URLSearchParams = new URLSearchParams(queryPart);

    if (queryPart) {
      queryParams.forEach((value, key, parent) => {
        const _value = params[key] ?? value;

        // If a value is found we encode
        if (_value !== undefined && _value !== '') {
          queryParams.set(key, typeof _value === 'object' ? JSON.stringify(_value) : _value);
        }
        // If the parameter is required we raise error
        else if (template.opts?.parameters?.query?.[key] === true) {
          throw Error(`Missing mandatory query parameter: '${key}'`);
        }
        // else we remove the empty field from parameters
        else {
          parent.delete(key);
        }
      });
    }

    // fill query path parameter i.e :variable
    if (pathPart.includes(':')) {
      path = pathPart
        .split('/')
        .map(segment => {
          if (segment.match(/^:/)) {
            const name = segment.substring(1);
            const value = params[name];
            if ((value === undefined || value === '') && template.opts?.parameters?.path?.[name] === true) {
              throw Error(`Missing mandatory path parameter: '${name}'`);
            }
            return value ?? '';
          }
          return segment;
        })
        .filter(Boolean)
        .join('/');
    }

    // Adds Filters query parameters
    if (template.opts?.filters?.length && params.filters) {
      Object.entries(params.filters as { [s: string]: Primitive | Primitive[] }).forEach(([key, value]) => {
        if (!isFilter(key) || !template.opts?.filters?.includes(key)) {
          throw Error(`Filter is not supported: '${key}'`);
        }

        if (!TraktApiFilterValidator.validate(key, value, true)) {
          throw Error(`Filter '${key}' is invalid: '${value}'`);
        }

        queryParams.set(key, `${value}`);
      });
    }

    // Pagination
    if (template.opts?.pagination && params.pagination) {
      if (params.pagination.page) queryParams.set('page', `${params.pagination.page}`);
      if (params.pagination.limit) queryParams.set('limit', `${params.pagination.limit}`);
    }

    // Extended
    if (template.opts?.extended && params.extended) {
      if (!template.opts.extended.includes(params.extended)) {
        throw Error(`Invalid value '${params.extended}', extended should be '${template.opts.extended}'`);
      }
      queryParams.set('extended', `${params.extended}`);
    }

    const url = new URL(path, this._settings.endpoint);
    url.search = queryParams.toString();
    return url.toString();
  }
}

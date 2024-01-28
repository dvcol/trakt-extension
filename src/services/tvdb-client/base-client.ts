import type { CacheStore } from '~/utils/cache.utils';
import type { HttpMethods } from '~/utils/http.utils';
import type { RecursiveRecord } from '~/utils/typescript.utils';

import { CancellableFetch, type CancellablePromise } from '~/utils/fetch.utils';
import { Observable, ObservableState, type Observer, type Updater } from '~/utils/observable.utils';

/**
 * Parses body from a template and stringifies a {@link BodyInit}
 *
 * @private
 *
 * @template T - The type of the parameters.
 *
 * @param body - The expected body structure.
 * @param {T} params - The actual parameters.
 *
 * @returns {BodyInit} The parsed request body.
 */
export const parseBody = <T extends RecursiveRecord = RecursiveRecord>(body: Record<string, string | boolean> = {}, params: T): BodyInit => {
  const _body: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (key in body) _body[key] = value;
  });

  Object.keys(body).forEach(key => {
    if (body[key] === true && !(key in _body)) throw new Error(`Missing mandatory body parameter: '${key}'`);
  });

  return JSON.stringify(_body);
};

/**
 * Parses the parameters and constructs the URL for a  API request.
 *
 * @private
 *
 * @template P - The type of the parameters.
 *
 * @param {BaseTemplate<P>} template - The template for the API endpoint.
 * @param {P} params - The parameters for the API call.
 *
 * @returns {URL} The URL for the  API request.
 *
 * @throws {Error} Throws an error if mandatory parameters are missing or if a filter is not supported.
 */
export const parseUrl = <P extends RecursiveRecord = RecursiveRecord>(template: BaseTemplate<P>, params: P, endpoint: string): URL => {
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

  const url = new URL(path, endpoint);
  url.search = queryParams.toString();
  return url;
};

type BaseSettings = {
  /** The API endpoint. */
  endpoint: string;
};

export type BaseRequest = {
  input: RequestInfo;
  init: RequestInit & { headers: RequestInit['headers'] };
};

type BaseQuery<R extends BaseRequest = BaseRequest, Q extends Response = Response> = {
  /** The request information. */
  request: R;
  /** The query promise. */
  query: CancellablePromise<Q>;
};

type BaseAuthentication = {
  refresh_token?: string;
  access_token?: string;
  expires?: number;
};

type BaseOptions<S extends BaseSettings = BaseSettings, R extends Response = Response> = S & {
  /** Optional cache store to manage cache read/write */
  cacheStore?: CacheStore<R>;
};

type BaseTemplateOptions = {
  /** Optional parameters for the template */
  parameters?: {
    /** Optional query parameters */
    query?: Record<string, boolean>;
    /** Optional path parameters */
    path?: Record<string, boolean>;
  };
};

type BaseInit = Omit<Partial<BaseRequest['init']>, 'method'>;

type BaseTemplate<P extends RecursiveRecord = RecursiveRecord> = {
  method: HttpMethods;
  url: string;
  opts?: BaseTemplateOptions;
  /** Boolean record or required (truthy) or optional fields (falsy) */
  body?: Record<string, boolean>;
  /** Partial fetch request init */
  init?: BaseInit;
  /** Validate the parameters before performing request */
  validate?: (param: P) => boolean;
  /** Transform the parameters before performing request */
  transform?: (param: P) => P;
};

/**
 * Represents a client with common functionality.
 *
 * @class BaseClient
 */
export class BaseClient<
  Q extends BaseQuery = BaseQuery,
  R extends Response = Response,
  S extends BaseSettings = BaseSettings,
  A extends BaseAuthentication = BaseAuthentication,
> {
  protected _cache: CacheStore<R>;
  protected _settings: S;
  protected _authentication: ObservableState<A>;
  protected _callListeners: Observable<Q>;

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
  protected updateAuth(auth: Updater<A>) {
    this._authentication.update(auth);
  }

  /**
   * Subscribes to changes in authentication information.
   * Emits the current authentication information on auth related changes (oAuth calls, token revocation, token refresh, etc.).
   *
   * @param observer - The observer function.
   * @returns A function to unsubscribe from changes.
   */
  onAuthChange(observer: Observer<A | undefined>) {
    return this._authentication.subscribe(observer);
  }

  /**
   * Subscribes to  API queries.
   * Emits query information on every call to the API.
   *
   * @param observer - The observer function.
   * @returns A function to unsubscribe from queries.
   */
  onCall(observer: Observer<Q>) {
    return this._callListeners.subscribe(observer);
  }

  /**
   * Unsubscribes observers from authentication and call listeners.
   * If no observer is provided, unsubscribes all observers.
   *
   * @param observer - The observer to be removed.
   */
  unsubscribe(observer?: Observer<Q | A | undefined>) {
    return {
      auth: this._authentication.unsubscribe(observer),
      call: this._callListeners.unsubscribe(observer),
    };
  }

  constructor({ cacheStore, ...settings }: BaseOptions<S, R>, authentication: A) {
    this._settings = settings as S;
    this._authentication = new ObservableState(authentication);
    this._callListeners = new Observable();
    this._cache = cacheStore ?? new Map();
  }

  /**
   * Calls the API with the given template and parameters.
   *
   * @protected
   *
   * @template P - The type of the parameters.
   * @template R - The type of the response.
   *
   * @param {BaseTemplate<P>} template - The template for the API endpoint.
   * @param {P} [params={}] - The parameters for the API call.
   * @param {BaseInit} [init] - Additional initialization options.
   *
   * @returns {Promise<Response>} A promise that resolves to the API response.
   */
  protected async _call<P extends RecursiveRecord = RecursiveRecord>(template: BaseTemplate<P>, params: P = {} as P, init?: BaseInit): Promise<R> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const _params = template.transform?.(params) ?? params;

    template.validate?.(_params);

    const req: BaseRequest = {
      input: this._parseUrl(template, _params),
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
      req.init.body = this._parseBody(template.body, _params);
    }

    const query = CancellableFetch.fetch<R>(req.input, req.init);

    this._callListeners.update({ request: req, query } as unknown as Q);

    return query;
  }

  /**
   * Parses the parameters and constructs the URL for a API request.
   *
   * @private
   *
   * @template T - The type of the parameters.
   *
   * @param {BaseTemplate<T>} template - The template for the API endpoint.
   * @param {T} params - The parameters for the API call.
   *
   * @returns {RequestInfo} The URL for the API request.
   *
   * @throws {Error} Throws an error if mandatory parameters are missing or if a filter is not supported.
   */
  // eslint-disable-next-line class-methods-use-this -- this should be extended in child classes
  protected _parseUrl<P extends RecursiveRecord = RecursiveRecord>(template: BaseTemplate<P>, params: P): string {
    return parseUrl(template, params, this._settings.endpoint).toString();
  }

  /**
   * Parses body from a template and stringifies a {@link BodyInit}
   *
   * @private
   *
   * @template T - The type of the parameters.
   *
   * @param body - The expected body structure.
   * @param {T} params - The actual parameters.
   *
   * @returns {BodyInit} The parsed request body.
   */
  // eslint-disable-next-line class-methods-use-this -- this should be extended in child classes
  protected _parseBody<T extends RecursiveRecord = RecursiveRecord>(body: Record<string, string | boolean> = {}, params: T): BodyInit {
    return parseBody(body, params);
  }
}

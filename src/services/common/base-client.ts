import type { CacheStore, CacheStoreEntity } from '~/utils/cache.utils';

import type { RecursiveRecord } from '~/utils/typescript.utils';

import { CancellableFetch, type CancellablePromise } from '~/utils/fetch.utils';
import { HttpMethod, type HttpMethods } from '~/utils/http.utils';
import { Observable, ObservableState, type Observer, type Updater } from '~/utils/observable.utils';
import { ExactMatchRegex } from '~/utils/regex.utils';

export const BaseApiHeaders = {
  /** The authorization token bearer */
  Authorization: 'Authorization',
  /** The user agent of the consumer client */
  UserAgent: 'User-Agent',
  /** The content type of the payload  */
  ContentType: 'Content-Type',
  /** The content type accepted */
  Accept: 'accept',
} as const;

export const BaseHeaderContentType = {
  Json: 'application/json',
  Text: 'text/plain',
} as const;

export type BaseRequest = {
  input: RequestInfo;
  init: RequestInit & { headers: RequestInit['headers'] };
};

export type BaseQuery<R extends BaseRequest = BaseRequest, Q = unknown> = {
  /** The request information. */
  request: R;
  /** The query promise. */
  query: CancellablePromise<Q>;
};

export type BaseSettings<S extends RecursiveRecord = RecursiveRecord> = S & {
  /** The domain name (i.e. https://api.domain.ext) */
  endpoint: string;
  /** A cors proxy endpoint to use for requests when in a browser */
  corsProxy?: string;
  /** A cors prefix to use for requests when in a browser */
  corsPrefix?: string;
};

export type BaseOptions<S extends BaseSettings = BaseSettings, R extends Response = Response> = S & {
  /** Optional cache store to manage cache read/write */
  cacheStore?: CacheStore<R>;
};

export type BaseTemplateOptions<
  T extends string | number | symbol = string | number | symbol,
  V extends boolean | symbol | string = boolean | symbol | string,
> = {
  /**
   * Enables caching of requests (defaults to true).
   * If a number is provided, it will be used as the retention time in milliseconds.
   */
  cache?: boolean | number | { retention?: number; evictOnError?: boolean };
  /** Boolean record or required (truthy) or optional parameters (falsy) */
  parameters?: {
    /** Boolean record or required (truthy) or optional path parameters (falsy) */
    path?: Partial<Record<T, V>>;
    /** Boolean record or required (truthy) or optional query parameters (falsy) */
    query?: Partial<Record<T, V>>;
  };
};

export type BaseInit = Omit<Partial<BaseRequest['init']>, 'method'>;

export type BaseBody<
  T extends string | number | symbol = string | number | symbol,
  V extends boolean | symbol | string = boolean | symbol | string,
> = Partial<Record<T, V>>;

export type BaseTemplate<P extends RecursiveRecord = RecursiveRecord, O extends BaseTemplateOptions = BaseTemplateOptions> = {
  method: HttpMethods;
  url: string;
  opts?: O;
  /** Boolean record or required (truthy) or optional fields (falsy) */
  body?: BaseBody<string | keyof P>;
  /** Partial fetch request init */
  init?: BaseInit;
  /** Validate the parameters before performing request */
  validate?: (param: P) => boolean;
  /** Transform the parameters before performing request */
  transform?: (param: P) => P;
};

export type TypedResponse<T> = Omit<Response, 'json'> & {
  json(): Promise<T>;
  cache?: {
    previous?: CacheStoreEntity<TypedResponse<T>>;
    current?: CacheStoreEntity<TypedResponse<T>>;
    isCache?: boolean;
  };
};

export type ResponseOrTypedResponse<T = unknown> = T extends never ? Response : TypedResponse<T>;

type ClientEndpointCall<Parameter extends RecursiveRecord = Record<string, never>, Response = unknown> = (
  param?: Parameter,
  init?: BaseInit,
) => Promise<ResponseOrTypedResponse<Response>>;

export interface ClientEndpoint<Parameter extends RecursiveRecord = Record<string, never>, Response = unknown> {
  (param?: Parameter, init?: BaseInit): Promise<ResponseOrTypedResponse<Response>>;
}

export type BaseCacheOption = { force?: boolean; retention?: number; evictOnError?: boolean };

type ClientEndpointCache<Parameter extends RecursiveRecord = Record<string, never>, Response = unknown> = {
  evict: (param?: Parameter, init?: BaseInit) => Promise<string | undefined>;
} & ((param?: Parameter, init?: BaseInit, cacheOptions?: BaseCacheOption) => Promise<TypedResponse<Response>>);

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ClientEndpoint<
  Parameter extends RecursiveRecord = Record<string, never>,
  Response = unknown,
  Cache extends boolean = true,
  Option extends BaseTemplateOptions = BaseTemplateOptions,
> implements BaseTemplate<Parameter, Option>
{
  method: HttpMethods;
  url: string;
  opts: Option;
  body?: BaseBody<string | keyof Parameter>;
  init?: BaseInit;
  transform?: (param: Parameter) => Parameter;
  validate?: (param: Parameter) => boolean;
  cached: Cache extends true ? Omit<this, 'cached'> & ClientEndpointCache<Parameter, Response> : never;
  resolve: (param?: Parameter) => URL;

  get config() {
    return {
      method: this.method,
      url: this.url,
      opts: this.opts,
      init: this.init,
      body: this.body,
    };
  }

  constructor(template: BaseTemplate<Parameter, Option>) {
    this.method = template.method;
    this.url = template.url;
    this.opts = { cache: true, ...template.opts } as Option;
    this.init = template.init ?? {};
    this.body = template.body;

    this.validate = template.validate;
    this.transform = template.transform;
    this.cached = (template.opts?.cache ? this : null) as never;
    this.resolve = () => {
      throw new Error('Not implemented');
    };
  }
}

export type IApi<Parameter extends RecursiveRecord = RecursiveRecord, Response = unknown, Cache extends boolean = boolean> = {
  [key: string]: ClientEndpoint<Parameter, Response, Cache> | IApi<Parameter>;
};

/**
 * Type guard to check if the template is a ClientEndpoint
 * @param template - ClientEndpoint or IApi
 */
const isApiTemplate = <T extends RecursiveRecord = RecursiveRecord>(template: ClientEndpoint<T> | IApi<T>): template is ClientEndpoint<T> =>
  template instanceof ClientEndpoint;

/**
 * Clones a response object
 * @param response - The response to clone
 * @param cache - Optional cache data to attach to the clone
 */
const cloneResponse = <T>(response: TypedResponse<T>, cache?: TypedResponse<T>['cache']): TypedResponse<T> => {
  const clone: { -readonly [K in keyof TypedResponse<T>]: unknown } = response.clone();
  Object.entries(response).forEach(([key, value]) => {
    if (typeof value !== 'function') clone[key as keyof TypedResponse<T>] = value;
  });
  clone.cache = cache;
  return clone as TypedResponse<T>;
};

export const getCachedFunction = <
  Parameter extends RecursiveRecord = RecursiveRecord,
  ResponseBody = unknown,
  ResponseType extends Response = Response,
>(
  clientFn: ClientEndpointCall<Parameter, ResponseBody>,
  {
    key,
    evictionKey,
    cache,
    retention,
  }: {
    key: string | ((param?: Parameter, init?: BaseInit) => string);
    evictionKey?: string | ((param?: Parameter, init?: BaseInit) => string);
    cache: CacheStore<ResponseType>;
    retention?: BaseTemplateOptions['cache'];
  },
): ClientEndpointCache<Parameter, ResponseBody> => {
  const cachedFn = async (param: Parameter, init: BaseInit, cacheOptions: BaseCacheOption) => {
    const _key = typeof key === 'function' ? key(param, init) : key;
    const cached = await cache.get(_key);
    if (cached && !cacheOptions?.force) {
      let templateRetention = typeof retention === 'number' ? retention : undefined;
      if (typeof retention === 'object') templateRetention = retention.retention;
      const _retention = cacheOptions?.retention ?? templateRetention ?? cache.retention;
      if (!_retention) return cloneResponse<ResponseType>(cached.value, { previous: cached, current: cached, isCache: true });
      const expires = cached.cachedAt + _retention;
      if (expires > Date.now()) return cloneResponse(cached.value, { previous: cached, current: cached, isCache: true });
    }

    try {
      const result: TypedResponse<ResponseBody> = await clientFn(param, init);
      const cacheEntry: CacheStoreEntity<ResponseType> = {
        cachedAt: Date.now(),
        value: cloneResponse(result) as ResponseType,
      };
      await cache.set(_key, cacheEntry);
      result.cache = { previous: cached, current: cacheEntry, isCache: false };
      return result;
    } catch (error) {
      if (cacheOptions?.evictOnError ?? (typeof retention === 'object' ? retention?.evictOnError : undefined) ?? cache.evictOnError) {
        cache.delete(_key);
      }
      throw error;
    }
  };

  const evictFn = async (param?: Parameter, init?: BaseInit) => {
    const _key = evictionKey ?? key;
    if (!_key) return;
    const _resolvedKey = typeof _key === 'function' ? _key(param, init) : _key;
    if (!_resolvedKey.trim()) return;
    await cache.clear(_resolvedKey);
    return _resolvedKey;
  };

  Object.defineProperty(cachedFn, 'evict', { value: evictFn });
  return cachedFn as ClientEndpointCache<Parameter, ResponseBody>;
};

/**
 * Represents a client with common functionality.
 *
 * @class BaseClient
 */
export abstract class BaseClient<
  QueryType extends BaseQuery = BaseQuery,
  ResponseType extends Response = Response,
  SettingsType extends BaseSettings = BaseSettings,
  AuthenticationType extends RecursiveRecord = RecursiveRecord,
> {
  private readonly _settings: SettingsType;
  private _cache: CacheStore<ResponseType>;
  private _authentication: ObservableState<AuthenticationType>;
  private _callListeners: Observable<QueryType>;

  get settings() {
    if (this._settings.corsProxy) return { ...this._settings, endpoint: this._settings.corsProxy };
    return this._settings;
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
  protected updateAuth(auth: Updater<AuthenticationType>) {
    this._authentication.update(auth);
  }

  /**
   * Subscribes to changes in authentication information.
   * Emits the current authentication information on auth related changes (oAuth calls, token revocation, token refresh, etc.).
   *
   * @param observer - The observer function.
   * @returns A function to unsubscribe from changes.
   */
  onAuthChange(observer: Observer<AuthenticationType | undefined>) {
    return this._authentication.subscribe(observer);
  }

  /**
   * Subscribes to  API queries.
   * Emits query information on every call to the API.
   *
   * @param observer - The observer function.
   * @returns A function to unsubscribe from queries.
   */
  onCall(observer: Observer<QueryType>) {
    return this._callListeners.subscribe(observer);
  }

  /**
   * Unsubscribes observers from authentication and call listeners.
   * If no observer is provided, unsubscribes all observers.
   *
   * @param observer - The observer to be removed.
   */
  unsubscribe(observer?: Observer<QueryType | AuthenticationType | undefined>) {
    return {
      auth: this._authentication.unsubscribe(observer),
      call: this._callListeners.unsubscribe(observer),
    };
  }

  /**
   * Clears the cache entry for the specified key.
   * If no key is provided, clears the entire cache.
   *
   * @param key - The cache key.
   * @param exact - If the key to be evicted needs to be an exact match or a regex pattern (defaults to true).
   */
  clearCache(key?: string, exact = true) {
    if (key && exact) return this._cache?.delete(key);
    return this._cache?.clear(key);
  }

  /**
   * Binds BaseTraktClient _call instance to the endpoint instance and the call method of the endpoint
   *
   * @private
   *
   * @param api - The TraktApi to bind to
   *
   * @example client.endpoints({ request })
   */
  protected bindToEndpoint(api: IApi) {
    const client = { ...api };
    Object.entries(client).forEach(([endpoint, template]) => {
      if (isApiTemplate(template)) {
        const fn: ClientEndpointCall = (param, init) => this._call(template, param, init);

        const cachedFn: ClientEndpointCache = getCachedFunction(fn, {
          key: (param: unknown, init: unknown) => {
            const _param = template?.transform?.(param as RecursiveRecord) ?? param;
            return JSON.stringify({ template: template.config, param: _param, init });
          },
          cache: this._cache,
          retention: template.opts?.cache,
          evictionKey: `{"template":${JSON.stringify(template.config).replace(ExactMatchRegex, '\\$&')}`,
        });

        const parseUrl = (param: Record<string, unknown> = {}) => {
          const _params = template.transform?.(param) ?? param;
          template.validate?.(_params);
          return this._parseUrl(template, _params);
        };

        Object.entries(template).forEach(([key, value]) => {
          if (key === 'cached') {
            if (template.opts?.cache) Object.defineProperty(fn, 'cached', { value: cachedFn });
          } else if (key === 'resolve') {
            Object.defineProperty(fn, 'resolve', { value: parseUrl });
            if (template.opts?.cache) Object.defineProperty(cachedFn, 'resolve', { value: parseUrl });
          } else {
            Object.defineProperty(fn, key, { value });
            if (template.opts?.cache) Object.defineProperty(cachedFn, key, { value });
          }
        });

        client[endpoint] = fn as (typeof client)[typeof endpoint];
      } else {
        client[endpoint] = this.bindToEndpoint(template as IApi);
      }
    });
    return client;
  }

  /**
   * Creates an instance of BaseClient.
   *
   * @param cacheStore - An optional cache store to manage cache read/write.
   * @param settings - The client settings.
   * @param authentication - The authentication information.
   * @param api - The API endpoints.
   */
  protected constructor({ cacheStore, ...settings }: BaseOptions<SettingsType, ResponseType>, authentication: AuthenticationType, api: IApi) {
    this._settings = settings as SettingsType;
    this._authentication = new ObservableState(authentication);
    this._callListeners = new Observable();
    this._cache = cacheStore ?? new Map();

    Object.assign(this, this.bindToEndpoint(api));
  }

  /**
   * Calls the API with the given template and parameters.
   *
   * @template P - The type of the parameters.
   * @template R - The type of the response.
   *
   * @param {BaseTemplate<P>} template - The template for the API endpoint.
   * @param {P} [params={}] - The parameters for the API call.
   * @param {BaseInit} [init] - Additional initialization options.
   *
   * @returns {Promise<Response>} A promise that resolves to the API response.
   *
   * @protected
   */
  protected async _call<P extends RecursiveRecord = RecursiveRecord>(
    template: BaseTemplate<P>,
    params: P = {} as P,
    init?: BaseInit,
  ): Promise<ResponseType> {
    const _params = template.transform?.(params) ?? params;

    template.validate?.(_params);

    const req: BaseRequest = {
      input: this._parseUrl(template, _params).toString(),
      init: {
        ...template.init,
        ...init,
        method: template.method,
        headers: {
          ...template.init?.headers,
          ...this._parseHeaders?.(template, _params),
          ...init?.headers,
        },
      },
    };

    if (template.method !== HttpMethod.GET && template.body) {
      req.init.body = this._parseBody(template.body, _params);
    }

    const query = CancellableFetch.fetch<ResponseType>(req.input, req.init).then(this._parseResponse ?? (response => response));

    this._callListeners.update({ request: req, query } as QueryType);

    return query;
  }

  /**
   * Parses headers from a template and returns a {@link HeadersInit}
   *
   * @template T - The type of the parameters.
   *
   * @param {BaseTemplate<T>} template - The template for the API endpoint.
   * @param {T} params - The actual parameters.
   *
   * @returns {HeadersInit} The parsed request headers.
   *
   * @protected
   * @abstract
   */
  protected abstract _parseHeaders?<T extends RecursiveRecord = RecursiveRecord>(template: BaseTemplate<T>, params: T): HeadersInit;

  /**
   * Parses the parameters and constructs the URL for a API request.
   *
   * @template T - The type of the parameters.
   *
   * @param {BaseTemplate<T>} template - The template for the API endpoint.
   * @param {T} params - The parameters for the API call.
   *
   * @returns {URL} The URL for the API request.
   *
   * @throws {Error} Throws an error if mandatory parameters are missing or if a filter is not supported.
   *
   * @protected
   * @abstract
   */
  protected abstract _parseUrl<T extends RecursiveRecord = RecursiveRecord>(template: BaseTemplate<T>, params: T): URL;

  /**
   * Parses body from a template and stringifies a {@link BodyInit}
   *
   * @template T - The type of the parameters.
   *
   * @param body - The expected body structure.
   * @param {T} params - The actual parameters.
   *
   * @returns {BodyInit} The parsed request body.
   *
   * @protected
   * @abstract
   */
  protected abstract _parseBody<T extends RecursiveRecord = RecursiveRecord>(body: BaseBody<string | keyof T>, params: T): BodyInit;

  /**
   * Parses the response from the API before returning from the call.
   * @param response - The response from the API.
   *
   * @returns {Response} The parsed response.
   *
   * @protected
   */
  protected abstract _parseResponse?(response: Response): Response;
}

/**
 * Parses body from a template and stringifies a {@link BodyInit}
 *
 * @private
 *
 * @template T - The type of the parameters.
 *
 * @param template - The expected body structure.
 * @param {T} params - The actual parameters.
 *
 * @returns {BodyInit} The parsed request body.
 */
export const parseBody = <T extends RecursiveRecord = RecursiveRecord>(template: BaseBody<string | keyof T> = {}, params: T): BodyInit => {
  const _body: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (key in template) _body[key] = value;
  });

  Object.keys(template).forEach(key => {
    if (template[key] === true && [undefined, null, ''].includes(params[key])) throw new Error(`Missing mandatory body parameter: '${key}'`);
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
 * @param {string} endpoint - The API endpoint.
 *
 * @returns {URL} The URL for the  API request.
 *
 * @throws {Error} Throws an error if mandatory parameters are missing or if a filter is not supported.
 */
export const parseUrl = <P extends RecursiveRecord = RecursiveRecord, O extends BaseTemplateOptions = BaseTemplateOptions>(
  template: BaseTemplate<P, O>,
  params: P,
  endpoint: string,
): URL => {
  // fill query parameters i.e. ?variable
  const [pathPart, queryPart] = template.url.split('?');

  let path = pathPart;

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
      .filter(_segment => ![undefined, null, ''].includes(_segment))
      .join('/');
  }

  const url = new URL(path, endpoint);

  if (queryPart) {
    new URLSearchParams(queryPart).forEach((value, key) => {
      const _value = params[key] ?? value;

      // If a value is found we encode
      if (![undefined, null, ''].includes(_value)) {
        url.searchParams.set(key, typeof _value === 'object' ? JSON.stringify(_value) : _value);
      }
      // If the parameter is required we raise error
      else if (template.opts?.parameters?.query?.[key] === true) {
        throw Error(`Missing mandatory query parameter: '${key}'`);
      }
    });
  }
  return url;
};

/**
 * Injects the cors proxy prefix to the URL if it is not already present.
 *
 * @param template - The template for the API endpoint.
 * @param settings - The client settings.
 */
export const injectCorsProxyPrefix = <T extends { url: string }, S extends BaseSettings>(template: T, settings: S) => {
  if (!settings.corsPrefix) return template;

  const prefix = `/${settings.corsPrefix}`;
  if (template.url.startsWith(prefix)) return template;

  template.url = `${prefix}${template.url}`;
  return template;
};

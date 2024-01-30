import type { CacheStore } from '~/utils/cache.utils';

import type { RecursiveRecord } from '~/utils/typescript.utils';

import { CancellableFetch, type CancellablePromise } from '~/utils/fetch.utils';
import { HttpMethod, type HttpMethods } from '~/utils/http.utils';
import { Observable, ObservableState, type Observer, type Updater } from '~/utils/observable.utils';

export const BaseApiHeaders = {
  /** The authorization token bearer */
  Authorization: 'Authorization',
  /** The user agent of the consumer client */
  UserAgent: 'User-Agent',
  /** The content type of the payload  */
  ContentType: 'Content-Type',
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

export type BaseOptions<S extends RecursiveRecord = RecursiveRecord, R extends Response = Response> = S & {
  /** Optional cache store to manage cache read/write */
  cacheStore?: CacheStore<R>;
};

export type BaseTemplateOptions = {
  /** Boolean record or required (truthy) or optional parameters (falsy) */
  parameters?: {
    /** Boolean record or required (truthy) or optional path parameters (falsy) */
    path?: Record<string, boolean | 'vip'>;
    /** Boolean record or required (truthy) or optional query parameters (falsy) */
    query?: Record<string, boolean | 'vip'>;
  };
};

export type BaseInit = Omit<Partial<BaseRequest['init']>, 'method'>;

export type BaseTemplate<P extends RecursiveRecord = RecursiveRecord, O extends BaseTemplateOptions = BaseTemplateOptions> = {
  method: HttpMethods;
  url: string;
  opts?: O;
  /** Boolean record or required (truthy) or optional fields (falsy) */
  body?: Record<string, boolean>;
  /** Partial fetch request init */
  init?: BaseInit;
  /** Validate the parameters before performing request */
  validate?: (param: P) => boolean;
  /** Transform the parameters before performing request */
  transform?: (param: P) => P;
};

export type TypedResponse<T> = Omit<Response, 'json'> & { json(): Promise<T> };

export type ResponseOrTypedResponse<T = unknown> = T extends never ? Response : TypedResponse<T>;

type ClientEndpointCall<P extends Record<string, never> = Record<string, never>, R = unknown> = (
  param?: P,
  init?: BaseInit,
) => Promise<ResponseOrTypedResponse<R>>;

export interface ClientEndpoint<P extends RecursiveRecord = Record<string, never>> {
  (param?: P, init?: BaseInit): Promise<ResponseOrTypedResponse>;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ClientEndpoint<P extends RecursiveRecord = Record<string, never>, O extends BaseTemplateOptions = BaseTemplateOptions>
  implements BaseTemplate<P, O>
{
  method: HttpMethods;
  url: string;
  opts: O;
  body?: Record<string, boolean>;
  init?: BaseInit;
  validate?: (param: P) => boolean;
  cached: Omit<this, 'cached'> & ((param?: P, init?: BaseInit) => Promise<ResponseOrTypedResponse>);

  constructor(template: BaseTemplate<P, O>) {
    this.method = template.method;
    this.url = template.url;
    this.opts = template.opts ?? ({} as O);
    this.init = template.init ?? {};
    this.body = template.body;

    this.validate = template.validate;
    this.cached = this;
  }
}

export type IApi<T extends RecursiveRecord = RecursiveRecord> = {
  [key: string]: ClientEndpoint<T> | IApi<T>;
};

/**
 * Type guard to check if the template is a ClientEndpoint
 * @param template - ClientEndpoint or IApi
 */
const isApiTemplate = <T extends RecursiveRecord = RecursiveRecord>(template: ClientEndpoint<T> | IApi<T>): template is ClientEndpoint<T> =>
  template instanceof ClientEndpoint;

/**
 * Represents a client with common functionality.
 *
 * @class BaseClient
 */
export abstract class BaseClient<
  QueryType extends BaseQuery = BaseQuery,
  ResponseType extends Response = Response,
  SettingsType extends RecursiveRecord = RecursiveRecord,
  AuthenticationType extends RecursiveRecord = RecursiveRecord,
> {
  private readonly _settings: SettingsType;
  private _cache: CacheStore<ResponseType>;
  private _authentication: ObservableState<AuthenticationType>;
  private _callListeners: Observable<QueryType>;

  protected get settings() {
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
   */
  clearCache(key?: string) {
    if (key) return this._cache?.delete(key);
    return this._cache?.clear();
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic typing
  protected bindToEndpoint(api: IApi<any>) {
    const client = { ...api };
    Object.entries(client).forEach(([endpoint, template]) => {
      if (isApiTemplate(template) && isApiTemplate(client[endpoint])) {
        const fn: ClientEndpointCall = (param, init) => this._call(template, param, init);

        const cachedFn: ClientEndpointCall = async (param, init) => {
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
              value: result as ResponseType,
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
        client[endpoint] = this.bindToEndpoint(client[endpoint] as IApi);
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
  protected abstract _parseBody<T extends RecursiveRecord = RecursiveRecord>(body: Record<string, string | boolean>, params: T): BodyInit;

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
export const parseBody = <T extends RecursiveRecord = RecursiveRecord>(template: Record<string, string | boolean> = {}, params: T): BodyInit => {
  const _body: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (key in template) _body[key] = value;
  });

  Object.keys(template).forEach(key => {
    if (template[key] === true && !(key in _body)) throw new Error(`Missing mandatory body parameter: '${key}'`);
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
      .filter(Boolean)
      .join('/');
  }

  const url = new URL(path, endpoint);

  if (queryPart) {
    new URLSearchParams(queryPart).forEach((value, key) => {
      const _value = params[key] ?? value;

      // If a value is found we encode
      if (_value !== undefined && _value !== '') {
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

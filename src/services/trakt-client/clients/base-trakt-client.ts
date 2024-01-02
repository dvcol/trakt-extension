import type { Primitive, RecursivePrimitiveRecord } from '~/models/primitive.model';
import type {
  TraktApiExtends,
  TraktApiParams,
  TraktApiRequest,
  TraktApiResponse,
  TraktApiTemplate,
  TraktClientAuthentication,
  TraktClientSettings,
} from '~/models/trakt-client.model';

import type { TraktApiFilters } from '~/services/trakt-client/api/trakt-api.filters';

import { TraktApiHeaders } from '~/models/trakt-client.model';

import { isFilter, TraktApiFilterValidator } from '~/services/trakt-client/api/trakt-api.filters';

/**
 * Parses body from {@link TraktApiTemplate} into stringifies {@link BodyInit}
 * @param body
 * @param params
 */
const parseBody = <
  T extends RecursivePrimitiveRecord = RecursivePrimitiveRecord,
  F extends TraktApiFilters = TraktApiFilters,
  E extends TraktApiExtends = TraktApiExtends,
>(
  body: TraktApiTemplate<T, F, E>['body'] = {},
  params: TraktApiParams<T, F, E>,
): BodyInit => {
  const _body: Record<string, unknown> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (key in body) _body[key] = value;
  });

  Object.keys(body).forEach(key => {
    if (body[key] === true && !(key in _body)) throw new Error(`Required field '${key}' is missing in request boyd.`);
  });

  return JSON.stringify(_body);
};

/**
 * Throw {@link Error} when status code is not ok
 * @param response
 */
export const isResponseOk = (response: Response) => {
  if (!response.ok || response.status >= 400) throw response;
  return response;
};

/**
 * Parse fetch response to extract {@TraktClientPagination} information.
 * @param response
 */
const parseResponse = (response: Response): TraktApiResponse => {
  isResponseOk(response);

  const _response: TraktApiResponse = { ...response };

  if (response.headers.has(TraktApiHeaders.XPaginationItemCount)) {
    _response.pagination = {
      itemCount: Number(response.headers.get(TraktApiHeaders.XPaginationItemCount)),
      pageCount: Number(response.headers.get(TraktApiHeaders.XPaginationPageCount)),
      limit: Number(response.headers.get(TraktApiHeaders.XPaginationLimit)),
      page: Number(response.headers.get(TraktApiHeaders.XPaginationPage)),
    };
  }

  return _response;
};

export class BaseTraktClient {
  protected _settings: TraktClientSettings;
  protected _authentication: TraktClientAuthentication;

  constructor(settings: TraktClientSettings, authentication = {}) {
    this._authentication = authentication;
    this._settings = settings;
  }

  /**
   * Logs api request details
   * @param req
   * @protected
   */
  protected debug(req: TraktApiRequest) {
    if (this._settings.debug) {
      console.info({
        method: req.init?.method,
        input: req.input,
        req,
      });
    }
  }

  protected async _call<
    T extends RecursivePrimitiveRecord = RecursivePrimitiveRecord,
    F extends TraktApiFilters = TraktApiFilters,
    E extends TraktApiExtends = TraktApiExtends,
  >(template: TraktApiTemplate<T, F, E>, params: TraktApiParams<T, F, E>) {
    const headers: HeadersInit = {
      [TraktApiHeaders.UserAgent]: this._settings.useragent,
      [TraktApiHeaders.ContentType]: 'application/json',
      [TraktApiHeaders.TraktApiVersion]: '2',
      [TraktApiHeaders.TraktApiKey]: this._settings.client_id,
    };

    if (template.opts.auth && this._authentication.access_token) {
      headers.Authorization = `Bearer ${this._authentication.access_token}`;
    } else if (template.opts.auth === true && !this._settings.client_secret) {
      throw Error('OAuth required');
    }

    template.validate?.(params);

    const req: TraktApiRequest = {
      input: this._parse(template, params),
      init: {
        method: template.method,
        headers,
      },
    };

    if (template.method !== 'GET' && template.body) {
      req.init.body = parseBody(template.body, params);
    }

    this.debug(req);
    const response = await fetch(req.input, req.init);
    return parseResponse(response);
  }

  /**
   * Parses {@link TraktApiTemplate} into fetch {@link RequestInfo}.
   * @param template
   * @param params
   * @private
   */
  private _parse<
    T extends RecursivePrimitiveRecord = RecursivePrimitiveRecord,
    F extends TraktApiFilters = TraktApiFilters,
    E extends TraktApiExtends = TraktApiExtends,
  >(template: TraktApiTemplate<T, F, E>, params: TraktApiParams<T, F, E>): RequestInfo {
    // fill query parameters i.e. ?variable
    const [pathPart, queryPart] = template.url.split('?');

    let path = pathPart;
    const queryParams: URLSearchParams = new URLSearchParams(queryPart);

    if (queryPart) {
      queryParams.forEach((value, key, parent) => {
        const _value = params[key] ?? value;
        // If a value is found we encode
        if (_value !== undefined && value !== '') {
          queryParams.set(key, encodeURIComponent(typeof _value === 'string' ? _value : JSON.stringify(_value)));
        }
        // If the parameter is required we raise error
        else if (template.opts.parameters?.query?.[key] === true) {
          throw Error(`Missing mandatory query parameter: ${key}`);
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
            if (value === undefined && template.opts.parameters?.path?.[name] === true) {
              throw Error(`Missing mandatory path parameter: ${name}`);
            }
            return value ?? '';
          }
          return segment;
        })
        .filter(Boolean)
        .join('/');
    }

    // Adds Filters query parameters
    if (template.opts.filters?.length && params.filters) {
      Object.entries(params.filters as { [s: string]: Primitive | Primitive[] }).forEach(([key, value]) => {
        if (!isFilter(key) || !template.opts.filters?.includes(key)) {
          throw Error(`Filter is not supported: ${key}`);
        }

        if (!TraktApiFilterValidator.validate(key, value, true)) {
          throw Error(`Filter '${key}' is invalid: ${value}`);
        }

        queryParams.set(key, `${value}`);
      });
    }

    // Pagination
    if (template.opts.pagination && params.pagination) {
      if (params.pagination.page) queryParams.set('page', `${params.pagination.page}`);
      if (params.pagination.limit) queryParams.set('limit', `${params.pagination.limit}`);
    }

    // Extended
    if (template.opts.extended && params.extended) {
      if (!template.opts.extended.includes(params.extended)) {
        throw Error(`Invalid value '${params.extended}', extended should be '${template.opts.extended}'`);
      }
      queryParams.set('extended', `${params.extended}`);
    }

    const url = queryParams ? `${path}?${queryParams.toString()}` : path;
    return [this._settings.endpoint, url].join('/');
  }
}

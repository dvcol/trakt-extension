import { TraktApiFilterValues } from '../api/trakt-client.filters';

import type {
  TraktApiParams,
  TraktApiRequest,
  TraktApiResponse,
  TraktApiTemplate,
  TraktClientAuthentication,
  TraktClientSettings,
} from '~/models/trakt-client.model';

/**
 * Parses body from {@link TraktApiTemplate} into stringifies {@link BodyInit}
 * @param body
 * @param params
 */
const parseBody = (body: TraktApiTemplate['body'] = {}, params: TraktApiParams = {}): BodyInit => {
  const _body = body;

  Object.entries(params).forEach(([key, value]) => {
    if (key in _body) _body[key] = value;
  });

  Object.keys(_body).forEach(key => {
    if (!_body[key]) delete _body[key];
  });

  return JSON.stringify({ ..._body });
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

  if (response.headers.has('x-pagination-item-count')) {
    _response.pagination = {
      itemCount: response.headers.get('x-pagination-item-count'),
      pageCount: response.headers.get('x-pagination-page-count'),
      limit: response.headers.get('x-pagination-limit'),
      page: response.headers.get('x-pagination-page'),
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

  private _call(template: TraktApiTemplate, params: TraktApiParams) {
    const headers: HeadersInit = {
      'User-Agent': this._settings.useragent,
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': this._settings.client_id,
    };

    if (template.opts.auth && this._authentication.access_token) {
      headers.Authorization = `Bearer ${this._authentication.access_token}`;
    } else if (template.opts.auth && !this._settings.client_secret) {
      throw Error('OAuth required');
    }

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

    this._debug(req);
    return fetch(req.input, req.init).then(parseResponse);
  }

  /**
   * Parses {@link TraktApiTemplate} into fetch {@link RequestInfo}.
   * @param template
   * @param params
   * @private
   */
  private _parse(template: TraktApiTemplate, params: TraktApiParams = {}): RequestInfo {
    // fill query parameters i.e. ?variable
    const [pathPart, queryPart] = template.url.split('?');

    let path = pathPart;
    let queryParams: URLSearchParams;

    if (queryPart) {
      queryParams = new URLSearchParams(queryPart);

      queryParams.forEach((value, key, parent) => {
        const _value = params[key] ?? value;
        if (_value?.length) {
          queryParams.set(key, encodeURIComponent(_value));
        } else if (!template.optional?.includes(key)) {
          throw Error(`Missing mandatory query parameter: ${key}`);
        } else {
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
            if (value === undefined && !template.optional?.includes(name)) {
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
    Object.entries(params).forEach(([key, value]) => {
      if (TraktApiFilterValues.includes(key)) {
        queryParams.set(key, value);
      }
    });

    // Pagination
    if (template.opts.pagination) {
      if (params.page) queryParams.set('page', params.page);
      if (params.limit) queryParams.set('limit', params.limit);
    }

    // Extended
    if (template.opts.extended && params.extended) {
      queryParams.set('extended', params.extended);
    }

    const url = queryParams ? `${path}?${queryParams.toString()}` : path;
    return [this._settings.endpoint, url].join('/');
  }
}

import type { TraktClientAuthentication } from '~/models/trakt/trakt-authentication.model';
import type {
  ITraktApi,
  TraktApiParams,
  TraktApiQuery,
  TraktApiResponse,
  TraktApiTemplate,
  TraktClientOptions,
  TraktClientSettings,
} from '~/models/trakt/trakt-client.model';

import type { Primitive } from '~/utils/typescript.utils';

import { TraktApiHeaders } from '~/models/trakt/trakt-client.model';

import { type BaseBody, BaseClient, BaseHeaderContentType, parseBody, parseUrl } from '~/services/common/base-client';
import { minimalTraktApi, type traktApi } from '~/services/trakt-client/api/trakt-api.endpoints';
import { isFilter, TraktApiFilterValidator } from '~/services/trakt-client/api/trakt-api.filters';

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
 * The extracted type signature of the TraktApi
 */
type ITraktEndpoints = typeof traktApi;

/** Needed to type Object assignment */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging  -- To allow type extension
export interface BaseTraktClient extends ITraktEndpoints {}

/**
 * Represents a Trakt API client with common functionality.
 *
 * @class BaseTraktClient
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging  -- To allow type extension
export class BaseTraktClient
  extends BaseClient<TraktApiQuery, TraktApiResponse, TraktClientSettings, TraktClientAuthentication>
  implements ITraktEndpoints
{
  /**
   * Creates an instance of BaseTraktClient.
   * @param options - The options for the client.
   * @param authentication - The authentication for the client.
   * @param api - The API endpoints for the client.
   */
  constructor(options: TraktClientOptions, authentication: TraktClientAuthentication = {}, api: ITraktApi = minimalTraktApi) {
    super(options, authentication, api);
  }

  /**
   * Parses the template to construct the headers for a Trakt API request.
   *
   * @protected
   *
   * @template T - The type of the parameters.
   *
   * @param template - The template for the API endpoint.
   *
   * @returns {HeadersInit} The parsed request headers.
   *
   * @throws {Error} Throws an error if OAuth is required and the access token is missing.
   */
  protected _parseHeaders<T extends TraktApiParams = TraktApiParams>(template: TraktApiTemplate<T>): HeadersInit {
    const headers: HeadersInit = {
      [TraktApiHeaders.UserAgent]: this.settings.useragent,
      [TraktApiHeaders.ContentType]: BaseHeaderContentType.Json,
      [TraktApiHeaders.TraktApiVersion]: '2',
      [TraktApiHeaders.TraktApiKey]: this.settings.client_id,
    };

    if (template.opts?.auth === true && !this.auth.access_token) {
      throw Error('OAuth required: access_token is missing');
    } else if (template.opts?.auth && this.auth.access_token) {
      headers[TraktApiHeaders.Authorization] = `Bearer ${this.auth.access_token}`;
    }

    return headers;
  }

  /**
   * Parses the parameters and constructs the URL for a Trakt API request.
   *
   * @protected
   *
   * @template T - The type of the parameters.
   *
   * @param template - The template for the API endpoint.
   * @param {T} params - The parameters for the API call.
   *
   * @returns {string} The URL for the Trakt API request.
   *
   * @throws {Error} Throws an error if mandatory parameters are missing or if a filter is not supported.
   */
  protected _parseUrl<T extends TraktApiParams = TraktApiParams>(template: TraktApiTemplate<T>, params: T): URL {
    const url = parseUrl<T>(template, params, this.settings.endpoint);
    const queryParams = url.searchParams;

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

    return url;
  }

  /**
   * Parses body from a template and stringifies a {@link BodyInit}
   *
   * @protected
   *
   * @template T - The type of the parameters.
   *
   * @param template - The expected body structure.
   * @param {T} params - The actual parameters.
   *
   * @returns {BodyInit} The parsed request body.
   */
  // eslint-disable-next-line class-methods-use-this -- implemented from abstract class
  protected _parseBody<T extends TraktApiParams = TraktApiParams>(template: BaseBody<string | keyof T>, params: T): BodyInit {
    return parseBody(template, params);
  }

  /**
   * Parses the response from the API before returning from the call.
   * @param response - The response from the API.
   *
   * @returns {TraktApiResponse} The parsed response.
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this -- implemented from abstract class
  protected _parseResponse(response: Response): TraktApiResponse {
    return parseResponse<TraktApiParams>(response);
  }
}

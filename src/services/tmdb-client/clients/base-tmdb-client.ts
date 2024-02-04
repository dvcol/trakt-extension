import type {
  ITmdbApi,
  TmdbApiParam,
  TmdbApiQuery,
  TmdbApiResponse,
  TmdbApiResponseData,
  TmdbApiResponsePageData,
  TmdbApiTemplate,
  TmdbClientAuthentication,
  TmdbClientOptions,
  TmdbClientSettings,
  TmdbPaginatedData,
} from '~/models/tmdb/tmdb-client.model';

import { TraktApiHeaders } from '~/models/trakt/trakt-client.model';
import { BaseApiHeaders, BaseClient, BaseHeaderContentType, parseBody, parseUrl } from '~/services/common/base-client';
import { tmdbApi } from '~/services/tmdb-client/api/tmdb-api.endpoint';

/**
 * The extracted type signature of the TmdbApi
 */
type ITmdbEndpoints = typeof tmdbApi;

/** Needed to type Object assignment */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging  -- To allow type extension
export interface BaseTmdbClient extends ITmdbEndpoints {}

const isPageResponse = (response: TmdbApiResponseData | TmdbApiResponsePageData): response is TmdbApiResponsePageData =>
  'page' in response && 'total_pages' in response && 'total_results' in response;

const parsePageResponse = ({ page, total_pages, total_results, results, ...common }: TmdbApiResponsePageData): TmdbPaginatedData => {
  const response: TmdbPaginatedData = { data: results, pagination: { page, total_pages, total_results } };
  if (Object.keys(common).length) response.common = common;
  return response;
};

const parseResponse = (response: TmdbApiResponseData | TmdbApiResponsePageData) => {
  if ('success' in response && !response.success) throw response;

  let _result: Record<string, unknown> = { ...response };

  delete _result.status_code;
  delete _result.status_message;
  delete _result.success;

  if (isPageResponse(response)) _result = parsePageResponse(response);
  if ('results' in _result && Object.keys(_result).length === 1) return _result.results;

  return _result;
};

/**
 * Represents a Tmdb API client with common functionality.
 *
 * @class BaseTmdbClient
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging  -- To allow type extension
export class BaseTmdbClient
  extends BaseClient<TmdbApiQuery, TmdbApiResponse, TmdbClientSettings, TmdbClientAuthentication>
  implements ITmdbEndpoints
{
  /**
   * Creates an instance of BaseTmdbClient.
   * @param options - The options for the client.
   * @param authentication - The authentication for the client.
   * @param api - The API endpoints for the client.
   */
  constructor(options: TmdbClientOptions, authentication: TmdbClientAuthentication = {}, api: ITmdbApi = tmdbApi) {
    super(options, { readToken: options.readToken, ...authentication }, api);
  }

  /**
   * Parses the template to construct the headers for a Tmdb API request.
   *
   * @protected
   *
   * @template T - The type of the parameters.
   **
   * @returns {HeadersInit} The parsed request headers.
   *
   * @throws {Error} Throws an error if auth is required and the access token is missing.
   */
  protected _parseHeaders<T extends TmdbApiParam = TmdbApiParam>(template: TmdbApiTemplate<T>): HeadersInit {
    const headers: HeadersInit = {
      [BaseApiHeaders.UserAgent]: this.settings.useragent,
      [BaseApiHeaders.Accept]: BaseHeaderContentType.Json,
      [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
    };

    if (template.opts?.auth && !this.auth.accessToken) {
      throw Error('User auth required: access_token is missing');
    } else if (template.opts?.auth) {
      headers[TraktApiHeaders.Authorization] = `Bearer ${this.auth.accessToken}`;
    } else {
      headers[TraktApiHeaders.Authorization] = `Bearer ${this.auth.readToken ?? this.settings.readToken}`;
    }

    return headers;
  }

  /**
   * Parses the parameters and constructs the URL for a Tmdb API request.
   *
   * @protected
   *
   * @template T - The type of the parameters.
   *
   * @param template - The template for the API endpoint.
   * @param {T} params - The parameters for the API call.
   *
   * @returns {string} The URL for the Tmdb API request.
   *
   * @throws {Error} Throws an error if mandatory parameters are missing or if a filter is not supported.
   */
  protected _parseUrl<T extends TmdbApiParam = TmdbApiParam>(template: TmdbApiTemplate<T>, params: T): URL {
    if (template.opts?.version && !template.url.startsWith(`/${template.opts.version}`)) template.url = `/${template.opts.version}${template.url}`;
    return parseUrl<T>(template, params, this.settings.endpoint);
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
  protected _parseBody<T extends TmdbApiParam = TmdbApiParam>(template: Record<string, string | boolean>, params: T): BodyInit {
    return parseBody(template, params);
  }

  /**
   * Parses the response from the API before returning from the call.
   * @param response - The response from the API.
   *
   * @returns {TmdbApiResponse} The parsed response.
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this -- implemented from abstract class
  protected _parseResponse(response: TmdbApiResponse<TmdbApiResponseData | TmdbApiResponsePageData>): TmdbApiResponse {
    if (!response.ok || response.status >= 400) throw response;

    const parsed: TmdbApiResponse = response;
    const _json = parsed.json as TmdbApiResponse<TmdbApiResponseData>['json'];
    parsed.json = async () => {
      const result = await _json.bind(parsed)();
      return parseResponse(result);
    };
    return response;
  }
}

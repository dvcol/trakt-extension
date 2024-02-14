import type {
  ITvdbApi,
  TvdbApiParam,
  TvdbApiQuery,
  TvdbApiResponse,
  TvdbApiResponseData,
  TvdbApiTemplate,
  TvdbClientAuthentication,
  TvdbClientOptions,
  TvdbClientSettings,
} from '~/models/tvdb/tvdb-client.model';

import type { TvdbApi } from '~/services/tvdb-client/api/tvdb-api.endpoints';

import { TraktApiHeaders } from '~/models/trakt/trakt-client.model';
import { BaseApiHeaders, type BaseBody, BaseClient, BaseHeaderContentType, parseBody, parseUrl } from '~/services/common/base-client';

/** Needed to type Object assignment */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging  -- To allow type extension
export interface BaseTvdbClient extends TvdbApi {}

/**
 * Represents a Tvdb API client with common functionality.
 *
 * @class BaseTvdbClient
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging  -- To allow type extension
export class BaseTvdbClient extends BaseClient<TvdbApiQuery, TvdbApiResponse, TvdbClientSettings, TvdbClientAuthentication> implements TvdbApi {
  /**
   * Creates an instance of BaseTvdbClient.
   * @param options - The options for the client.
   * @param authentication - The authentication for the client.
   * @param api - The API endpoints for the client.
   */
  constructor(options: TvdbClientOptions, authentication: TvdbClientAuthentication = {}, api: ITvdbApi = {}) {
    super(options, authentication, api);
  }

  /**
   * Parses the template to construct the headers for a Tvdb API request.
   *
   * @protected
   *
   * @template T - The type of the parameters.
   *
   * @param {TvdbApiTemplate<T>} template - The template for the API endpoint.
   *
   * @returns {HeadersInit} The parsed request headers.
   *
   * @throws {Error} Throws an error if OAuth is required and the access token is missing.
   */
  protected _parseHeaders<T extends TvdbApiParam = TvdbApiParam>(template: TvdbApiTemplate<T>): HeadersInit {
    const headers: HeadersInit = {
      [BaseApiHeaders.UserAgent]: this.settings.useragent,
      [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
    };

    if (!template.opts?.auth) return headers;

    if (!this.auth.accessToken) throw Error('OAuth required: access_token is missing');

    headers[TraktApiHeaders.Authorization] = `Bearer ${this.auth.accessToken}`;

    return headers;
  }

  /**
   * Parses the parameters and constructs the URL for a Tvdb API request.
   *
   * @protected
   *
   * @template T - The type of the parameters.
   *
   * @param template - The template for the API endpoint.
   * @param {T} params - The parameters for the API call.
   *
   * @returns {string} The URL for the Tvdb API request.
   *
   * @throws {Error} Throws an error if mandatory parameters are missing or if a filter is not supported.
   */
  protected _parseUrl<T extends TvdbApiParam = TvdbApiParam>(template: TvdbApiTemplate<T>, params: T): URL {
    if (this.settings.version && !template.url.startsWith(`/${this.settings.version}`)) template.url = `/${this.settings.version}${template.url}`;
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
  protected _parseBody<T extends TvdbApiParam = TvdbApiParam>(template: BaseBody<string | keyof T>, params: T): BodyInit {
    return parseBody(template, params);
  }

  /**
   * Parses the response from the API before returning from the call.
   * @param response - The response from the API.
   *
   * @returns {TvdbApiResponse} The parsed response.
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this -- implemented from abstract class
  protected _parseResponse(response: TvdbApiResponse<TvdbApiResponseData>): TvdbApiResponse {
    if (!response.ok || response.status >= 400) throw response;

    const parsed: TvdbApiResponse = response;
    const _json = parsed.json as TvdbApiResponse<TvdbApiResponseData>['json'];
    parsed.json = async () => {
      const result = await _json.bind(parsed)();
      if (result.status !== 'success') throw result;
      return result.links ? { data: result.data, pagination: result.links } : result.data;
    };
    return response;
  }
}

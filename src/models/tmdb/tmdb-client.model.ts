import type { RecursiveRecord } from '~/utils/typescript.utils';

import {
  type BaseOptions,
  type BaseQuery,
  type BaseRequest,
  type BaseTemplate,
  type BaseTemplateOptions,
  ClientEndpoint,
  type ResponseOrTypedResponse,
} from '~/services/common/base-client';

export type TmdbClientSettings = {
  /** The domain name (e.g. https://api4.thetmdb.com) */
  endpoint: string;
  /** The consumer client identifier */
  useragent: string;
  /** The app read-only api key  */
  readToken: string;
  /** token time-to-live (15 minutes) */
  requestTokenTTL: number;
};

export type TmdbClientAuthentication = {
  /** User access token if there is an active session */
  accessToken?: string;
  /** The app read-only api key  */
  readToken?: string;
};

export type TmdbParamPagination = {
  page?: number;
};

export type TmdbApiParam = RecursiveRecord;
export type TmdbClientOptions = BaseOptions<TmdbClientSettings, TmdbApiResponse>;

export type TmdbApiResponseData<T = unknown> = T & {
  status_code: number;
  status_message: string;
  success: boolean;
};

export type TmdbApiPagination = {
  page?: number;
  total_pages?: number;
  total_results?: number;
};

export type TmdbApiResponsePageData<T = unknown> = TmdbApiPagination & {
  results: T[];
};

export type TmdbPaginatedData<T = unknown> = {
  data: T[];
  pagination: TmdbApiPagination;
};

export type TmdbApiResponse<T = unknown> = ResponseOrTypedResponse<T>;

export type TmdbApiQuery<T = unknown> = BaseQuery<BaseRequest, T>;
export type TmdbApiTemplateOptions = BaseTemplateOptions & {
  /** If the method requires user authentication */
  auth?: boolean;
};

export type TmdbApiTemplate<Parameter extends TmdbApiParam = TmdbApiParam> = BaseTemplate<Parameter, TmdbApiTemplateOptions>;

export interface TmdbClientEndpoint<Parameter extends TmdbApiParam = Record<string, never>, Response = unknown> {
  (param?: Parameter, init?: BodyInit): Promise<TmdbApiResponse<Response>>;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class TmdbClientEndpoint<
  Parameter extends TmdbApiParam = Record<string, never>,
  Response = unknown,
  Cache extends boolean = true,
> extends ClientEndpoint<Parameter, Response, Cache, TmdbApiTemplateOptions> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is a recursive type
export type ITmdbApi<Parameter extends TmdbApiParam = any, Response = unknown, Cache extends boolean = boolean> = {
  [key: string]: TmdbClientEndpoint<Parameter, Response, Cache> | ITmdbApi<Parameter>;
};

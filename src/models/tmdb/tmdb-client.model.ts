import { ClientEndpoint } from '@dvcol/base-http-client';

import type {
  BaseOptions,
  BaseQuery,
  BaseRequest,
  BaseSettings,
  BaseTemplate,
  BaseTemplateOptions,
  ResponseOrTypedResponse,
} from '@dvcol/base-http-client';

import type { RecursiveRecord } from '~/utils/typescript.utils';

export type TmdbClientSettings = BaseSettings<{
  /** The consumer client identifier */
  useragent: string;
  /** The app api key  */
  apiKey: string;
  /** The app read-only api key  */
  readToken: string;
  /** token time-to-live (15 minutes) */
  requestTokenTTL: number;
}>;

export type TmdbClientAuthentication = {
  /** User access token if there is an active session */
  accessToken?: string;
  /** If the session id is for a guest session */
  isGuest?: boolean;
  /** The user session id  */
  sessionId?: string;
  /** The user sessionId expire date */
  expiresAt?: string;
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

export type TmdbApiResponsePageData<T = unknown, C = Record<string, string>> = Partial<TmdbApiResponseData> &
  TmdbApiPagination & {
    results: T[];
  } & C;

export type TmdbPaginatedData<T = unknown, C = unknown> = {
  common?: C;
  data: T[];
  pagination: TmdbApiPagination;
};

export type TmdbApiResponse<T = unknown> = ResponseOrTypedResponse<T>;

export type TmdbApiQuery<T = unknown> = BaseQuery<BaseRequest, T>;
export type TmdbApiTemplateOptions<T extends string | number | symbol = string> = BaseTemplateOptions<T, boolean> & {
  /** If the method requires user authentication */
  auth?: 'session' | 'token' | false;
  /** If the method is authorized for a guest session id */
  guest?: boolean;
  /** The api version (3 or 4) */
  version: number | string;
};

export type TmdbApiTemplate<Parameter extends TmdbApiParam = TmdbApiParam> = BaseTemplate<Parameter, TmdbApiTemplateOptions<keyof Parameter>>;

export interface TmdbClientEndpoint<Parameter extends TmdbApiParam = Record<string, never>, Response = unknown> {
  (param?: Parameter, init?: BodyInit): Promise<TmdbApiResponse<Response>>;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class TmdbClientEndpoint<
  Parameter extends TmdbApiParam = Record<string, never>,
  Response = unknown,
  Cache extends boolean = true,
> extends ClientEndpoint<Parameter, Response, Cache, TmdbApiTemplateOptions<keyof Parameter>> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is a recursive type
export type ITmdbApi<Parameter extends TmdbApiParam = any, Response = unknown, Cache extends boolean = boolean> = {
  [key: string]: TmdbClientEndpoint<Parameter, Response, Cache> | ITmdbApi<Parameter>;
};

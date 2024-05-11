import {
  type BaseOptions,
  type BaseQuery,
  type BaseRequest,
  type BaseSettings,
  type BaseTemplate,
  type BaseTemplateOptions,
  ClientEndpoint,
  type ResponseOrTypedResponse,
} from '@dvcol/base-http-client';

import type { RecursiveRecord } from '~/utils/typescript.utils';

/**
 * @see [documentation]{@link https://thetvdb.github.io/v4-api/#/Login/post_login}
 */
export type TvdbClientSettings = BaseSettings<{
  /** The api version (e.g. v4) */
  version: string;
  /** The consumer client identifier */
  useragent: string;
  /** The app api key  */
  apiKey: string;
  /** token time-to-live (28 days) */
  tokenTTL: number;
}>;

export type TvdbClientOptions = BaseOptions<TvdbClientSettings, TvdbApiResponse>;

export type TvdbClientAuthentication = {
  accessToken?: string;
  userPin?: string;
  expires?: number;
};

export type TvdbApiParam = RecursiveRecord;
export type TvdbParamPagination = {
  page?: number;
};

export type TvdbApiPagination = {
  prev?: string;
  next?: string;
  self?: string;
  total_items?: number;
  page_size?: number;
};

export type TvdbApiResponseData<T = unknown> = {
  data: T;
  message?: string;
  status: string;
  links?: TvdbApiPagination;
};

export type TvdbApiResponse<T = unknown> = ResponseOrTypedResponse<T>;

export type TvdbPaginatedData<T = unknown> = {
  data: T[];
  pagination: TvdbApiPagination;
};

export type TvdbApiQuery<T = unknown> = BaseQuery<BaseRequest, T>;

/**
 * Represents options that can be used in a tvdb API template.
 */
export type TvdbApiTemplateOptions<T extends string | number | symbol = string> = BaseTemplateOptions<T, boolean> & {
  /** If the method requires authentication */
  auth?: boolean;
};

export type TvdbApiTemplate<Parameter extends TvdbApiParam = TvdbApiParam> = BaseTemplate<Parameter, TvdbApiTemplateOptions<keyof Parameter>>;

export interface TvdbClientEndpoint<Parameter extends TvdbApiParam = Record<string, never>, Response = unknown> {
  (param?: Parameter, init?: BodyInit): Promise<TvdbApiResponse<Response>>;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class TvdbClientEndpoint<
  Parameter extends TvdbApiParam = Record<string, never>,
  Response = unknown,
  Cache extends boolean = true,
> extends ClientEndpoint<Parameter, Response, Cache, TvdbApiTemplateOptions<keyof Parameter>> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is a recursive type
export type ITvdbApi<Parameter extends TvdbApiParam = any, Response = unknown, Cache extends boolean = boolean> = {
  [key: string]: TvdbClientEndpoint<Parameter, Response, Cache> | ITvdbApi<Parameter>;
};

import { BaseApiHeaders, ClientEndpoint } from '@dvcol/base-http-client';

import type {
  BaseCacheOption,
  BaseInit,
  BaseOptions,
  BaseQuery,
  BaseRequest,
  BaseSettings,
  BaseTemplate,
  BaseTemplateOptions,
  ResponseOrTypedResponse,
} from '@dvcol/base-http-client';

import type { TraktApiFilters } from '~/services/trakt-client/api/trakt-api.filters';

import type { Primitive, RecursiveRecord } from '~/utils/typescript.utils';

/**
 * Pagination data parsed from {@link TraktApiResponse} headers.
 *
 * @see [pagination]{@link https://trakt.docs.apiary.io/#introduction/pagination}
 */
export type TraktClientPagination = {
  itemCount: number;
  pageCount: number;
  limit: number;
  page: number;
};

/**
 * Trakt.tv API client settings.
 */
export type TraktClientSettings = BaseSettings<{
  /** Get this from your app settings. */
  client_id: string;
  /** Get this from your app settings. */
  client_secret: string;
  /** URI specified in your app settings. */
  redirect_uri: string;
  /** The consumer client identifier */
  useragent: string;
}>;

/**
 * Trakt.tv API client options.
 */
export type TraktClientOptions = BaseOptions<TraktClientSettings, TraktApiResponse>;

/**
 * By default, all methods will return minimal info for movies, shows, episodes, people, and users.
 * Minimal info is typically all you need to match locally cached items and includes the title, year, and ids.
 * However, you can request different extended levels of information by adding ?extended={level} to the URL.
 * Send a comma separated string to get multiple types of extended info.
 *
 * node: This returns a lot of extra data, so please only use extended parameters if you actually need them!
 * @see [extended-info]{@link https://trakt.docs.apiary.io/#introduction/extended-info}
 */
export const TraktApiExtended = {
  Full: 'full',
  Metadata: 'metadata',
  GuestStars: 'guest_stars',
  Episodes: 'episodes',
  NoSeasons: 'noseasons',
  Vip: 'vip',
  Comments: 'comments',
} as const;

/**
 * Represents the supported extensions for the Trakt API.
 * @see {TraktApiExtended}
 * @see [extended-info]{@link https://trakt.docs.apiary.io/#introduction/extended-info}
 */
export type TraktApiExtends = (typeof TraktApiExtended)[keyof typeof TraktApiExtended];

/**
 * Represents options that can be used in a Trakt API template.
 */
export type TraktApiTemplateOptions<T extends string | number | symbol = string> = BaseTemplateOptions<T, boolean | 'vip'> & {
  /** If the method supports or requires vip status */
  vip?: boolean | 'enhanced';
  /** If the method supports or requires authentication */
  auth?: boolean | 'optional';
  /** If the method supports or requires pagination */
  pagination?: boolean | 'optional';
  /** If the method receive or return emoji codes */
  emoji?: boolean;
  /** If the method supports extended information */
  extended?: TraktApiExtends[];
  /** If the method supports filtering */
  filters?: TraktApiFilters[];
};

export type TraktApiInit = BaseInit;

export type TraktApiTemplate<Parameter extends TraktApiParams = TraktApiParams> = BaseTemplate<Parameter, TraktApiTemplateOptions<keyof Parameter>>;

export interface TraktClientEndpoint<Parameter extends TraktApiParams = Record<string, never>, Response = unknown> {
  (param?: Parameter, init?: TraktApiInit): Promise<TraktApiResponse<Response>>;
}

export type TraktClientCachedEndpoint<Parameter extends TraktApiParams = Record<string, never>, Response = unknown> = {
  evict: (param?: Parameter, init?: BaseInit) => Promise<string | undefined>;
} & ((param?: Parameter, init?: BaseInit, cacheOptions?: BaseCacheOption) => Promise<TraktApiResponse<Response>>);

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging  -- To allow type extension
export class TraktClientEndpoint<
  Parameter extends TraktApiParams = Record<string, never>,
  Response = unknown,
  Cache extends boolean = true,
> extends ClientEndpoint<Parameter, Response, Cache, TraktApiTemplateOptions<keyof Parameter>> {
  declare cached: Cache extends true ? Omit<this, 'cached'> & TraktClientCachedEndpoint<Parameter, Response> : never;
}

export type TraktApiRequest = BaseRequest;

export type TraktApiQuery<T = unknown> = BaseQuery<TraktApiRequest, T>;

export type TraktApiResponse<T = unknown> = ResponseOrTypedResponse<T> & {
  pagination?: TraktClientPagination;
  interval?: {
    start?: string | null;
    end?: string | null;
  };
  sort?: {
    by?: string | null;
    how?: string | null;
  };
  appliedSort?: {
    by?: string | null;
    how?: string | null;
  };
  vip?: {
    url?: string | null;
    user?: string | null;
    limit?: string | null;
  };
};

/**
 * Page defaults to 1 and limit to 10.
 *
 * @see [pagination]{@link https://trakt.docs.apiary.io/#introduction/pagination}
 */
export type TraktApiPagination = {
  /** Number of page of results to be returned. (defaults to 1) */
  page?: number;
  /** Number of results to return per page. (defaults to 10) */
  limit?: number;
};

/**
 * Filters are optional parameters you can send to filter the data returned.
 *
 * @see [filters]{@link https://trakt.docs.apiary.io/#introduction/filters}
 */
export type TraktApiParamsFilter<F extends TraktApiFilters | void = TraktApiFilters, V extends Primitive = Primitive> = F extends TraktApiFilters
  ? {
      /**
       * An optional filter to refine query
       *
       * @see [filters]{@link https://trakt.docs.apiary.io/#introduction/filters}
       */
      filters?: Partial<Record<F, V | V[]>>;
    }
  : Record<string, never>;

export type TraktApiParamsExtended<E extends TraktApiExtends | void = TraktApiExtends> = E extends TraktApiExtends
  ? {
      /**
       * Increases the verbosity of the response.
       *
       * Note: This returns a lot of extra data, so please only use extended parameters if you actually need them!
       *
       * @see [extended-info]{@link https://trakt.docs.apiary.io/#introduction/extended-info}
       */
      extended?: E;
    }
  : Record<string, never>;

export type TraktApiParamsPagination = {
  /**
   * An empty pagination will load 1 page of 10 items by default on paginated endpoints.
   * An empty pagination on optionally paginated endpoints will return the full response.
   *
   * @see [pagination]{@link https://trakt.docs.apiary.io/#introduction/pagination}
   */
  pagination?: TraktApiPagination;
};

export type TraktApiParams<
  T extends RecursiveRecord = RecursiveRecord,
  E extends TraktApiExtends = TraktApiExtends,
  F extends TraktApiFilters = TraktApiFilters,
  P extends true | false = true,
> = TraktApiParamsExtended<E> & TraktApiParamsFilter<F> & (P extends true ? T & TraktApiParamsPagination : T);

export type PartialTraktApiParams<
  T extends RecursiveRecord | void = void,
  E extends TraktApiExtends | void = void,
  F extends TraktApiFilters | void = void,
  P extends true | false = false,
> = (T extends void ? Record<string, never> : T) &
  (E extends void ? Record<string, never> : TraktApiParamsExtended<E>) &
  (F extends void ? Record<string, never> : TraktApiParamsFilter<F>) &
  (P extends false ? Record<string, never> : TraktApiParamsPagination);

export type ITraktApi<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is a recursive type
  Parameter extends TraktApiParams = any,
  Response = unknown,
  Cache extends boolean = boolean,
> = {
  [key: string]: TraktClientEndpoint<Parameter, Response, Cache> | ITraktApi<Parameter>;
};

export const TraktApiHeaders = {
  /** Interval to wait after rate limit is reached */
  RetryAfter: 'Retry-After',
  /** {"name":"UNAUTHED_API_GET_LIMIT","period":300,"limit":1000,"remaining":0,"until":"2020-10-10T00:24:00Z"} */
  XRatelimit: 'X-Ratelimit',
  /** https://trakt.tv/vip */
  XUpgradeURL: 'X-Upgrade-URL',
  /** true or false */
  XVipUser: 'X-VIP-User',
  /** Limit allowed. */
  XAccountLimit: 'X-Account-Limit',
  /** Current page */
  XPaginationPage: 'X-Pagination-Page',
  /** Items per page. */
  XPaginationLimit: 'X-Pagination-Limit',
  /** Total number of pages. */
  XPaginationPageCount: 'X-Pagination-Page-Count',
  /** Total number of items. */
  XPaginationItemCount: 'X-Pagination-Item-Count',
  /** Version of the Trakt.tv api */
  TraktApiVersion: 'trakt-api-version',
  /** Client id for the trakt app */
  TraktApiKey: 'trakt-api-key',
  /** Start of the queried interval */
  XStartDate: 'X-Start-Date',
  /** End of the queried interval */
  XEndDate: 'X-End-Date',
  /** Desired sort by within possible values: rank, added, title, released, runtime, popularity, percentage, votes, my_rating, random, watched, and collected. */
  XSortBy: 'X-Sort-By',
  /** Desired sort order: asc or desc. */
  XSortHow: 'X-Sort-How',
  /** Actual sort by within possible values: rank, added, title, released, runtime, popularity, percentage, and votes */
  XAppliedSortBy: 'X-Applied-Sort-By',
  /** Actual sort order asc or desc. */
  XAppliedSortHow: 'X-Applied-Sort-How',
  /** The user agent of the consumer client */
  UserAgent: BaseApiHeaders.UserAgent,
  /** The content type of the payload  */
  ContentType: BaseApiHeaders.ContentType,
  /** The authorization token bearer */
  Authorization: BaseApiHeaders.Authorization,
} as const;

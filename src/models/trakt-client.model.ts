import type { Primitive, RecursiveRecord } from '~/models/primitive.model';
import type { TraktApiFilters } from '~/services/trakt-client/api/trakt-api.filters';
import type { HttpMethods } from '~/utils/http.utils';

export type TraktClientPagination = {
  itemCount: number;
  pageCount: number;
  limit: number;
  page: number;
};

export type TraktClientSettings = {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  endpoint: string;
  useragent: string;
  pagination?: boolean;
  debug?: boolean;
};

type TraktClientBaseAuthenticationRequest = {
  client_id: string;
  client_secret: string;
  redirect_uri?: string;
};

export type TraktClientCodeAuthenticationRequest = TraktClientBaseAuthenticationRequest & {
  code: string;
  grant_type?: 'authorization_code';
};

export type TraktClientRefreshAuthenticationRequest = TraktClientBaseAuthenticationRequest & {
  refresh_token: string;
  grant_type?: 'refresh_token';
};

export type TraktClientAuthenticationRequest = TraktClientCodeAuthenticationRequest | TraktClientRefreshAuthenticationRequest;

export type TraktClientAuthentication = {
  refresh_token?: string;
  access_token?: string;
  expires?: number;
  state?: string;
};

/**
 * By default, all methods will return minimal info for movies, shows, episodes, people, and users.
 * Minimal info is typically all you need to match locally cached items and includes the title, year, and ids.
 * However, you can request different extended levels of information by adding ?extended={level} to the URL.
 * Send a comma separated string to get multiple types of extended info.
 *
 * node: This returns a lot of extra data, so please only use extended parameters if you actually need them!
 * @see {@link https://trakt.docs.apiary.io/#introduction/extended-info}
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

export type TraktApiExtends = (typeof TraktApiExtended)[keyof typeof TraktApiExtended];

export type TraktApiTemplateOptions = {
  /** If the method supports or requires vip status */
  vip?: boolean | 'enhanced';
  /** If the method supports or requires authentication */
  auth?: boolean | 'optional';
  /** If the method supports or requires pagination */
  pagination?: boolean | 'optional';
  /** If the method receive or return emoji codes */
  emoji?: boolean;
  /** Boolean record or required (truthy) or optional parameters (falsy) */
  parameters?: {
    /** Boolean record or required (truthy) or optional path parameters (falsy) */
    path?: Record<string, boolean | 'vip'>;
    /** Boolean record or required (truthy) or optional query parameters (falsy) */
    query?: Record<string, boolean | 'vip'>;
  };
  /** If the method supports extended information */
  extended?: TraktApiExtends[];
  /** If the method supports filtering */
  filters?: TraktApiFilters[];
};

export type TraktApiTemplate<T extends TraktApiParams = TraktApiParams> = {
  method: HttpMethods;
  url: string;
  opts?: TraktApiTemplateOptions;
  /** Boolean record or required (truthy) or optional fields (falsy) */
  body?: Record<string, boolean>;
  /** Execute the request */
  call?: (param: T) => Promise<TraktApiResponse>;
  /** Validate the parameters before performing request */
  validate?: (param: T) => boolean;
};

const stubCall = <T extends TraktApiParams = TraktApiParams>(param: T): Promise<TraktApiResponse> => {
  console.error('Endpoint call function not implemented', param);
  throw new Error('Endpoint call function not implemented');
};

export class TraktClientEndpoint<T extends TraktApiParams = TraktApiParams> implements TraktApiTemplate<T> {
  method: HttpMethods;
  url: string;
  opts: TraktApiTemplateOptions;
  body?: Record<string, boolean>;
  validate?: (param: T) => boolean;
  call: (param: T) => Promise<TraktApiResponse>;

  constructor(template: TraktApiTemplate<T>) {
    this.method = template.method;
    this.url = template.url;
    this.opts = template.opts ?? {};
    this.body = template.body;
    this.validate = template.validate;
    this.call = template.call ?? stubCall;
  }
}

export type TraktApiRequest = {
  input: RequestInfo;
  init: RequestInit & { headers: RequestInit['headers'] };
};

export type TraktApiResponse = Response & {
  pagination?: TraktClientPagination;
};

/**
 * Page defaults to 1 and limit to 10.
 *
 * @see {@link https://trakt.docs.apiary.io/#introduction/pagination}
 */
export type TraktApiPagination = {
  /** Number of page of results to be returned. (defaults to 1) */
  page?: number;
  /** Number of results to return per page. (defaults to 10) */
  limit?: number;
};

export type TraktApiParamsFilter<F extends TraktApiFilters = TraktApiFilters, V extends Primitive = Primitive> = {
  /**
   * An optional filter to refine query
   *
   * @see {@link https://trakt.docs.apiary.io/#introduction/filters}
   */
  filters?: Partial<Record<F, V | V[]>>;
};

export type TraktApiParamsExtended<E extends TraktApiExtends = TraktApiExtends> = {
  /**
   * Increases the verbosity of the response.
   *
   * note: This returns a lot of extra data, so please only use extended parameters if you actually need them!
   *
   * @see {@link https://trakt.docs.apiary.io/#introduction/extended-info}
   */
  extended?: E;
};

export type TraktApiParamsPagination = {
  /**
   * An empty pagination will load 1 page of 10 items by default on paginated endpoints.
   * An empty pagination on optionally paginated endpoints will return the full response.
   *
   * @see {@link https://trakt.docs.apiary.io/#introduction/pagination}
   */
  pagination?: TraktApiPagination;
};

export type TraktApiParams<
  T extends RecursiveRecord = RecursiveRecord,
  E extends TraktApiExtends = TraktApiExtends,
  F extends TraktApiFilters = TraktApiFilters,
> = T & TraktApiParamsExtended<E> & TraktApiParamsFilter<F> & TraktApiParamsPagination;

export type ITraktApi<T extends TraktApiParams = TraktApiParams> = {
  [key: string]: TraktClientEndpoint<T> | ITraktApi<T>;
};

export const TraktApiHeaders = {
  /** Interval to wait after rate limit is reached */
  RetryAfter: 'Retry-After',
  /** {"name":"UNAUTHED_API_GET_LIMIT","period":300,"limit":1000,"remaining":0,"until":"2020-10-10T00:24:00Z"} */
  XRatelimit: 'X-Ratelimit',
  /** https://trakt.tv/vip */
  XUpgradeURL: 'X-Upgrade-URL',
  /** true or false */
  XVIPUser: 'X-VIP-User',
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
  /** The user agent of the consumer client */
  UserAgent: 'User-Agent',
  /** The content type of the payload  */
  ContentType: 'Content-Type',
} as const;

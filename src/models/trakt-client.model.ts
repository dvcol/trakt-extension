import type { Primitive, RecursivePrimitiveRecord } from '~/models/primitive.model';
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

export type TraktApiTemplate<
  T extends RecursivePrimitiveRecord = RecursivePrimitiveRecord,
  F extends TraktApiFilters = TraktApiFilters,
  E extends TraktApiExtends = TraktApiExtends,
> = {
  method: HttpMethods;
  url: string;
  opts: TraktApiTemplateOptions;
  /** Boolean record or required (truthy) or optional fields (falsy) */
  body?: Record<string, boolean>;
  /** Execute the request */
  call?: (param: TraktApiParams<T, F, E>) => Promise<TraktApiResponse>;
  /** Validate the parameters before performing request */
  validate?: (param: TraktApiParams<T, F, E>) => boolean;
};

const stubCall = <
  T extends RecursivePrimitiveRecord = RecursivePrimitiveRecord,
  F extends TraktApiFilters = TraktApiFilters,
  E extends TraktApiExtends = TraktApiExtends,
>(
  param: TraktApiParams<T, F, E>,
): Promise<TraktApiResponse> => {
  console.error('Endpoint call function not implemented', param);
  throw new Error('Endpoint call function not implemented');
};

export class TraktClientEndpoint<
  T extends RecursivePrimitiveRecord = RecursivePrimitiveRecord,
  F extends TraktApiFilters = TraktApiFilters,
  E extends TraktApiExtends = TraktApiExtends,
> implements TraktApiTemplate<T, F, E>
{
  method: HttpMethods;
  url: string;
  opts: TraktApiTemplateOptions;
  body?: Record<string, boolean>;
  validate?: (param: TraktApiParams<T, F, E>) => boolean;
  call: (param: TraktApiParams<T, F, E>) => Promise<TraktApiResponse>;

  constructor(template: TraktApiTemplate<T, F, E>) {
    this.method = template.method;
    this.url = template.url;
    this.opts = template.opts;
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

export type TraktApiParams<
  T extends RecursivePrimitiveRecord = RecursivePrimitiveRecord,
  F extends TraktApiFilters = TraktApiFilters,
  E extends TraktApiExtends = TraktApiExtends,
> = T & {
  filters?: Partial<Record<F, Primitive | Primitive[]>>;
  extended?: E;
  pagination?: {
    page?: number;
    limit?: number;
  };
};

export type ITraktApi<
  T extends RecursivePrimitiveRecord = RecursivePrimitiveRecord,
  F extends TraktApiFilters = TraktApiFilters,
  E extends TraktApiExtends = TraktApiExtends,
> = {
  [key: string]: TraktClientEndpoint<T, F, E> | ITraktApi<T, F, E>;
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

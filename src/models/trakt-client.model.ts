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

export type TraktApiTemplate = {
  method: HttpMethods;
  url: string;
  opts: {
    auth?: boolean | 'optional';
    pagination?: boolean | 'optional';
    extended?: string[];
  };
  body?: Record<string, unknown>;
  optional?: string[];
};

export type TraktApiRequest = {
  input: RequestInfo;
  init: RequestInit & { headers: RequestInit['headers'] };
};

export type TraktApiResponse = Response & {
  pagination?: TraktClientPagination;
};

export type TraktApiParams = Record<string, string | boolean | number> & {
  page?: number;
  limit?: number;
};

export type ITraktApi = { [key: string]: TraktApiTemplate | ITraktApi };

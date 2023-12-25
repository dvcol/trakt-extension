import type { HttpMethod } from '~/utils/http.utils';

export type TraktClientSettings = {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  endpoint: string;
  useragent: string;
  pagination?: string;
  debug?: boolean;
};

export type TraktClientAuthentication = {
  refresh_token?: string;
  access_token?: string;
  expires?: number;
  state?: string;
};

export type TraktApiTemplate = {
  method: keyof typeof HttpMethod;
  url: string;
  opts: {
    auth?: boolean | 'optional';
    pagination?: boolean | 'optional';
    extended?: string[];
  };
  body?: Record<string, unknown>;
  optional?: string[];
};

export type TraktApi = { [key: string]: TraktApiTemplate | TraktApi };

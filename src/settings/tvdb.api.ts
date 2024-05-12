import { Config as TvdbConfig } from '@dvcol/tvdb-http-client/config';

import type { TvdbClientSettings } from '@dvcol/tvdb-http-client/models';

export const Config = {
  UserAgent: `${import.meta.env.PKG_NAME}/${import.meta.env.PKG_VERSION}`,
  endpoint: TvdbConfig.endpoint,
  version: 'v4',
  apiKey: import.meta.env.VITE_TVDB_API_KEY,
  /** token time-to-live (28 days) @see [documentation]{@link https://thetvdb.github.io/v4-api/#/Login/post_login} */
  tokenTTL: TvdbConfig.tokenTTL,
} as const;

export const tvdbClientSettings: TvdbClientSettings = {
  apiKey: Config.apiKey,
  tokenTTL: Config.tokenTTL,
  endpoint: Config.endpoint,
  version: Config.version,

  useragent: Config.UserAgent,
};

import { Config as TmdbConfig } from '@dvcol/tmdb-http-client/config';

import type { TmdbClientSettings } from '@dvcol/tmdb-http-client/models';

export const Config = {
  endpoint: TmdbConfig.endpoint,
  requestTokenTTL: TmdbConfig.requestTokenTTL,
  requestTokenUrl: TmdbConfig.requestTokenUrl,
  UserAgent: `${import.meta.env.PKG_NAME}/${import.meta.env.PKG_VERSION}`,
  apiKey: import.meta.env.VITE_TMDB_API_KEY,
  readToken: import.meta.env.VITE_TMDB_READ_TOKEN,
} as const;

export const tmdbClientSettings: TmdbClientSettings = {
  endpoint: Config.endpoint,
  useragent: Config.UserAgent,
  apiKey: Config.apiKey,
  readToken: Config.readToken,
  requestTokenTTL: Config.requestTokenTTL,
};

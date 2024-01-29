import type { TvdbClientSettings } from '~/models/tvdb/tvdb-client.model';

export const Config = {
  UserAgent: `${import.meta.env.PKG_NAME}/${import.meta.env.PKG_VERSION}`,
  endpoint: 'https://api4.thetvdb.com/v4',
  apiKey: '7633408c-e021-43a5-a04a-9f057ab68880',
  /** token time-to-live (28 days) @see [documentation]{@link https://thetvdb.github.io/v4-api/#/Login/post_login} */
  tokenTTL: 28 * 24 * 60 * 60 * 1000,
} as const;

export const tvdbClientSettings: TvdbClientSettings = {
  endpoint: Config.endpoint,
  apiKey: Config.apiKey,
  tokenTTL: Config.tokenTTL,

  useragent: Config.UserAgent,
};

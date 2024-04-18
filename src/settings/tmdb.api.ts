import type { TmdbClientSettings } from '~/models/tmdb/tmdb-client.model';

export const Config = {
  UserAgent: `${import.meta.env.PKG_NAME}/${import.meta.env.PKG_VERSION}`,
  endpoint: 'https://api.themoviedb.org',
  apiKey: import.meta.env.VITE_TMDB_API_KEY,
  readToken: import.meta.env.VITE_TMDB_READ_TOKEN,
  requestTokenTTL: 15 * 60 * 1000,
  requestTokenUrl: 'https://www.themoviedb.org/auth/access?request_token=',
} as const;

export const tmdbClientSettings: TmdbClientSettings = {
  endpoint: Config.endpoint,
  useragent: Config.UserAgent,
  apiKey: Config.apiKey,
  readToken: Config.readToken,
  requestTokenTTL: Config.requestTokenTTL,
};

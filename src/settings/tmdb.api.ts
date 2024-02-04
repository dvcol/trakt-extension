import type { TmdbClientSettings } from '~/models/tmdb/tmdb-client.model';

export const Config = {
  UserAgent: `${import.meta.env.PKG_NAME}/${import.meta.env.PKG_VERSION}`,
  endpoint: 'https://api.themoviedb.org',
  apiKey: '2f64f68acda6dd1135dffb9e60c2e7de',
  readToken:
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZjY0ZjY4YWNkYTZkZDExMzVkZmZiOWU2MGMyZTdkZSIsInN1YiI6IjY1YjY3MzUwMWM2MzViMDE2MjE0MGRkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G1RvU3PhmDct7bYlnuKC7JetCG8GItHrWoOzoiZomxk',
  requestTokenTTL: 15 * 60 * 1000,
  requestTokenUrl: 'https://www.themoviedb.org/auth/access?request_token=',
} as const;

export const tmdbClientSettings: TmdbClientSettings = {
  endpoint: Config.endpoint,
  useragent: Config.UserAgent,
  readToken: Config.readToken,
  requestTokenTTL: Config.requestTokenTTL,
};

import type { TmdbClientSettings } from '~/models/tmdb/tmdb-client.model';

export const Config = {
  UserAgent: `${import.meta.env.PKG_NAME}/${import.meta.env.PKG_VERSION}`,
  endpoint: 'https://api.themoviedb.org',
  apiKey: '2ba5f96dda8c09e647721c23b69a3533',
  readToken:
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYmE1Zjk2ZGRhOGMwOWU2NDc3MjFjMjNiNjlhMzUzMyIsInN1YiI6IjY1YjY3MzUwMWM2MzViMDE2MjE0MGRkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lcJ-RqF9ELLotwyrPze7Q-fRyTJhDxrxad1LxHpYdwY',
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

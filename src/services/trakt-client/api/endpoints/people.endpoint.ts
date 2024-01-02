import type { ITraktApi } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

export const people = {
  summary: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/people/:id',
    optional: [],
    call,
  },
  movies: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/people/:id/movies',
    optional: [],
    call,
  },
  shows: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/people/:id/shows',
    optional: [],
    call,
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/people/:id/lists/:type/:sort',
    optional: ['type', 'sort'],
    call,
  },
  updates: {
    get: {
      opts: {
        pagination: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/people/updates/:start_date?limit=',
      optional: ['limit'],
      call,
    },
    id: {
      opts: {
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/people/updates/id/:start_date?limit=',
      optional: ['limit'],
      call,
    },
  },
} satisfies ITraktApi;

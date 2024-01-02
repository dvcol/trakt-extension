import type { ITraktApi } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

export const seasons = {
  summary: {
    opts: {
      extended: ['full', 'episodes'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons',
    optional: [],
    call,
  },
  season: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season?translations=',
    optional: ['translations'],
    call,
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/comments/:sort',
    optional: ['sort'],
    call,
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/lists/:type/:sort',
    optional: ['type', 'sort'],
    call,
  },
  people: {
    opts: {
      extended: ['guest_stars'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/people',
    optional: [],
    call,
  },
  ratings: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/ratings',
    optional: [],
    call,
  },
  stats: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/stats',
    optional: [],
    call,
  },
  watching: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/watching',
    optional: [],
    call,
  },
} satisfies ITraktApi;

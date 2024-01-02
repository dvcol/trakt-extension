import type { ITraktApi } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

export const episodes = {
  summary: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode',
    optional: [],
    call,
  },
  translations: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/translations/:language',
    optional: ['language'],
    call,
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/comments/:sort',
    optional: ['sort'],
    call,
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/lists/:type/:sort',
    optional: ['type', 'sort'],
    call,
  },
  people: {
    opts: {
      extended: ['guest_stars'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/people',
    optional: [],
    call,
  },
  ratings: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/ratings',
    optional: [],
    call,
  },
  stats: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/stats',
    optional: [],
    call,
  },
  watching: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/watching',
    optional: [],
    call,
  },
} satisfies ITraktApi;

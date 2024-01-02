import type { ITraktApi } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

export const movies = {
  trending: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/trending',
    optional: [],
    call,
  },
  popular: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/popular',
    optional: [],
    call,
  },
  recommended: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/recommended/:period',
    optional: ['period'],
    call,
  },
  played: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/played/:period',
    optional: ['period'],
    call,
  },
  watched: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/watched/:period',
    optional: ['period'],
    call,
  },
  collected: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/collected/:period',
    optional: ['period'],
    call,
  },
  anticipated: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/anticipated',
    optional: [],
    call,
  },
  boxoffice: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/boxoffice',
    optional: [],
    call,
  },
  updates: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/updates/:start_date',
    optional: ['start_date'],
    call,
  },
  updated_ids: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/movies/updates/id/:start_date',
    optional: ['start_date'],
    call,
  },
  summary: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/:id',
    optional: [],
    call,
  },
  aliases: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/aliases',
    optional: [],
    call,
  },
  releases: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/releases/:country',
    optional: ['country'],
    call,
  },
  translations: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/translations/:language',
    optional: ['language'],
    call,
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/movies/:id/comments/:sort',
    optional: ['sort'],
    call,
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/movies/:id/lists/:type/:sort',
    optional: ['type', 'sort'],
    call,
  },
  people: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/:id/people',
    optional: [],
    call,
  },
  ratings: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/ratings',
    optional: [],
    call,
  },
  related: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/:id/related?limit=',
    optional: ['limit'],
    call,
  },
  stats: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/stats',
    optional: [],
    call,
  },
  studios: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/studios',
    optional: [],
    call,
  },
  watching: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/:id/watching',
    optional: [],
    call,
  },
} satisfies ITraktApi;

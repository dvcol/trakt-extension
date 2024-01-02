import type { ITraktApi } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

export const lists = {
  trending: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/lists/trending',
    optional: [],
    call,
  },
  popular: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/lists/popular',
    optional: [],
    call,
  },
  get: {
    opts: {},
    method: HttpMethod.GET,
    url: '/lists/:id',
    optional: [],
    call,
  },
  likes: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/lists/:id/likes',
    optional: [],
    call,
  },
  items: {
    opts: {
      pagination: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/lists/:id/items/:type',
    optional: [],
    call,
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/lists/:id/comments/:sort',
    optional: ['sort'],
    call,
  },
} satisfies ITraktApi;

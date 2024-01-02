import type { ITraktApi } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

export const recommendations = {
  movies: {
    get: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/recommendations/movies/?limit=&ignore_collected=',
      optional: ['limit', 'ignore_collected'],
      call,
    },
    hide: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/recommendations/movies/:id',
      optional: [],
      call,
    },
  },
  shows: {
    get: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/recommendations/shows/?limit=&ignore_collected=',
      optional: ['limit', 'ignore_collected'],
      call,
    },
    hide: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/recommendations/shows/:id',
      optional: [],
      call,
    },
  },
} satisfies ITraktApi;

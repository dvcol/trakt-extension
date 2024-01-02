import type { ITraktApi } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

export const search = {
  text: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/search/:type?query=&fields=',
    optional: ['fields'],
    call,
  },
  id: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/search/:id_type/:id?type=&fields=',
    optional: ['type', 'fields'],
    call,
  },
} satisfies ITraktApi;

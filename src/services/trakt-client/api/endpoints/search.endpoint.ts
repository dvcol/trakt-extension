import { HttpMethod } from '~/utils/http.utils';

export const search = {
  text: {
    opts: {
      pagination: true,
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/search/:type?query=&fields=',
    // optional: ['fields'],
  },
  id: {
    opts: {
      pagination: true,
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/search/:id_type/:id?type=&fields=',
    // optional: ['type', 'fields'],
  },
};

import { HttpMethod } from '~/utils/http.utils';

export const recommendations = {
  movies: {
    get: {
      opts: {
        auth: true,
        extended: [TraktApiExtended.Full],
      },
      method: HttpMethod.GET,
      url: '/recommendations/movies/?limit=&ignore_collected=',
      // optional: ['limit', 'ignore_collected'],
    },
    hide: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/recommendations/movies/:id',
    },
  },
  shows: {
    get: {
      opts: {
        auth: true,
        extended: [TraktApiExtended.Full],
      },
      method: HttpMethod.GET,
      url: '/recommendations/shows/?limit=&ignore_collected=',
      // optional: ['limit', 'ignore_collected'],
    },
    hide: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/recommendations/shows/:id',
    },
  },
};

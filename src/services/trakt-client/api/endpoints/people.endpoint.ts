import { HttpMethod } from '~/utils/http.utils';

export const people = {
  summary: {
    opts: {
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/people/:id',
  },
  movies: {
    opts: {
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/people/:id/movies',
  },
  shows: {
    opts: {
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/people/:id/shows',
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/people/:id/lists/:type/:sort',
    // optional: ['type', 'sort'],
  },
  updates: {
    get: {
      opts: {
        pagination: true,
        extended: [TraktApiExtended.Full],
      },
      method: HttpMethod.GET,
      url: '/people/updates/:start_date?limit=',
      // optional: ['limit'],
    },
    id: {
      opts: {
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/people/updates/id/:start_date?limit=',
      // optional: ['limit'],
    },
  },
};

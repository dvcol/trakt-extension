import { HttpMethod } from '~/utils/http.utils';

export const episodes = {
  summary: {
    opts: {
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode',
  },
  translations: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/translations/:language',
    // optional: ['language'],
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/comments/:sort',
    // optional: ['sort'],
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/lists/:type/:sort',
    // optional: ['type', 'sort'],
  },
  people: {
    opts: {
      extended: ['guest_stars'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/people',
  },
  ratings: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/ratings',
  },
  stats: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/stats',
  },
  watching: {
    opts: {
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/watching',
  },
};

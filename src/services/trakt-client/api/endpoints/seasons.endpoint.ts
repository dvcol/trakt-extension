import { HttpMethod } from '~/utils/http.utils';

export const seasons = {
  summary: {
    opts: {
      extended: ['full', 'episodes'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons',
  },
  season: {
    opts: {
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season?translations=',
    // optional: ['translations'],
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/comments/:sort',
    // optional: ['sort'],
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/lists/:type/:sort',
    // optional: ['type', 'sort'],
  },
  people: {
    opts: {
      extended: ['guest_stars'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/people',
  },
  ratings: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/ratings',
  },
  stats: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/stats',
  },
  watching: {
    opts: {
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/watching',
  },
};

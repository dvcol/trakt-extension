import type { ITraktApi } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

export const shows = {
  trending: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/trending',
    optional: [],
    call,
  },
  popular: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/popular',
    optional: [],
    call,
  },
  recommended: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/recommended/:period',
    optional: ['period'],
    call,
  },
  played: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/played/:period',
    optional: ['period'],
    call,
  },
  watched: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/watched/:period',
    optional: ['period'],
    call,
  },
  collected: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/collected',
    optional: ['period'],
    call,
  },
  anticipated: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/anticipated',
    optional: [],
    call,
  },
  updates: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/updates/:start_date',
    optional: ['start_date'],
    call,
  },
  updated_ids: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/updates/id/:start_date',
    optional: ['start_date'],
    call,
  },
  summary: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id',
    optional: [],
    call,
  },
  aliases: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/aliases',
    optional: [],
    call,
  },
  certifications: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/certifications',
    optional: [],
    call,
  },
  translations: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/translations/:language',
    optional: ['language'],
    call,
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/comments/:sort',
    optional: ['sort'],
    call,
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/lists/:type/:sort',
    optional: ['type', 'sort'],
    call,
  },
  progress: {
    collection: {
      opts: {
        auth: true,
      },
      method: HttpMethod.GET,
      url: '/shows/:id/progress/collection?hidden=&specials=&count_specials=&last_activity=',
      optional: ['hidden', 'specials', 'count_specials', 'last_activity'],
      call,
    },
    watched: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/shows/:id/progress/watched?hidden=&specials=&count_specials=&last_activity=',
      optional: ['hidden', 'specials', 'count_specials', 'last_activity'],
      call,
    },
    reset: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/shows/:id/progress/watched/reset',
      optional: [],
      call,
    },
    undo_reset: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/shows/:id/progress/watched/reset',
      optional: [],
      call,
    },
  },
  people: {
    opts: {
      extended: ['full', 'guest_stars'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/people',
    optional: [],
    call,
  },
  ratings: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/ratings',
    optional: [],
    call,
  },
  related: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/related',
    optional: [],
    call,
  },
  stats: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/stats',
    optional: [],
    call,
  },
  studios: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/studios',
    optional: [],
    call,
  },
  watching: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/watching',
    optional: [],
    call,
  },
  next_episode: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/next_episode',
    optional: [],
    call,
  },
  last_episode: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/last_episode',
    optional: [],
    call,
  },
} satisfies ITraktApi;

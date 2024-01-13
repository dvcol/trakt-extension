import { HttpMethod } from '~/utils/http.utils';

export const shows = {
  trending: {
    opts: {
      pagination: true,
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/trending',
  },
  popular: {
    opts: {
      pagination: true,
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/popular',
  },
  recommended: {
    opts: {
      pagination: true,
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/recommended/:period',
    // optional: ['period'],
  },
  played: {
    opts: {
      pagination: true,
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/played/:period',
    // optional: ['period'],
  },
  watched: {
    opts: {
      pagination: true,
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/watched/:period',
    // optional: ['period'],
  },
  collected: {
    opts: {
      pagination: true,
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/collected',
    // optional: ['period'],
  },
  anticipated: {
    opts: {
      pagination: true,
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/anticipated',
  },
  updates: {
    opts: {
      pagination: true,
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/updates/:start_date',
    // optional: ['start_date'],
  },
  updated_ids: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/updates/id/:start_date',
    // optional: ['start_date'],
  },
  summary: {
    opts: {
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/:id',
  },
  aliases: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/aliases',
  },
  certifications: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/certifications',
  },
  translations: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/translations/:language',
    // optional: ['language'],
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/comments/:sort',
    // optional: ['sort'],
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/lists/:type/:sort',
    // optional: ['type', 'sort'],
  },
  progress: {
    collection: {
      opts: {
        auth: true,
      },
      method: HttpMethod.GET,
      url: '/shows/:id/progress/collection?hidden=&specials=&count_specials=&last_activity=',
      // optional: ['hidden', 'specials', 'count_specials', 'last_activity'],
    },
    watched: {
      opts: {
        auth: true,
        extended: [TraktApiExtended.Full],
      },
      method: HttpMethod.GET,
      url: '/shows/:id/progress/watched?hidden=&specials=&count_specials=&last_activity=',
      // optional: ['hidden', 'specials', 'count_specials', 'last_activity'],
    },
    reset: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/shows/:id/progress/watched/reset',
    },
    undo_reset: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/shows/:id/progress/watched/reset',
    },
  },
  people: {
    opts: {
      extended: ['full', 'guest_stars'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/people',
  },
  ratings: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/ratings',
  },
  related: {
    opts: {
      pagination: true,
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/related',
  },
  stats: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/stats',
  },
  studios: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/studios',
  },
  watching: {
    opts: {
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/watching',
  },
  next_episode: {
    opts: {
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/next_episode',
  },
  last_episode: {
    opts: {
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/last_episode',
  },
};

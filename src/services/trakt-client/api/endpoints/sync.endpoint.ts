import type { ITraktApi } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

export const sync = {
  last_activities: {
    opts: {
      auth: true,
    },
    method: HttpMethod.GET,
    url: '/sync/last_activities',
    optional: [],
    call,
  },
  playback: {
    get: {
      opts: {
        auth: true,
      },
      method: HttpMethod.GET,
      url: '/sync/playback/:type?limit=',
      optional: ['type', 'limit'],
      call,
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/sync/playback/:id',
      optional: [],
      call,
    },
  },
  collection: {
    get: {
      opts: {
        auth: true,
        extended: ['full', 'metadata'],
      },
      method: HttpMethod.GET,
      url: '/sync/collection/:type',
      optional: [],
      call,
    },
    add: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/sync/collection',
      body: {
        movies: null,
        shows: null,
        seasons: null,
        episodes: null,
      },
      optional: [],
      call,
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/sync/collection/remove',
      body: {
        movies: null,
        shows: null,
        seasons: null,
        episodes: null,
      },
      optional: [],
      call,
    },
  },
  watched: {
    opts: {
      auth: true,
      extended: ['full', 'noseasons'],
    },
    method: HttpMethod.GET,
    url: '/sync/watched/:type',
    optional: [],
    call,
  },
  history: {
    get: {
      opts: {
        auth: true,
        pagination: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/sync/history/:type/:id?start_at=&end_at=',
      optional: ['type', 'id', 'start_at', 'end_at'],
      call,
    },
    add: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/sync/history',
      body: {
        movies: null,
        shows: null,
        seasons: null,
        episodes: null,
      },
      optional: [],
      call,
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/sync/history/remove',
      body: {
        movies: null,
        shows: null,
        episodes: null,
        ids: null,
      },
      optional: [],
      call,
    },
  },
  ratings: {
    get: {
      opts: {
        auth: true,
        pagination: 'optional',
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/sync/ratings/:type/:rating',
      optional: ['rating', 'type'],
      call,
    },
    add: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/sync/ratings',
      body: {
        movies: null,
        shows: null,
        seasons: null,
        episodes: null,
      },
      optional: [],
      call,
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/sync/ratings/remove',
      body: {
        movies: null,
        shows: null,
        episodes: null,
      },
      optional: [],
      call,
    },
    watchlist: {
      get: {
        opts: {
          auth: true,
          pagination: 'optional',
          extended: ['full'],
        },
        method: HttpMethod.GET,
        url: '/sync/watchlist/:type',
        optional: ['type'],
        call,
      },
      add: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/sync/watchlist',
        body: {
          movies: null,
          shows: null,
          episodes: null,
        },
        optional: [],
        call,
      },
      remove: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/sync/watchlist/remove',
        body: {
          movies: null,
          shows: null,
          episodes: null,
        },
        optional: [],
        call,
      },
      reorder: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/sync/watchlist/reorder',
        body: {
          rank: null,
        },
        optional: [],
        call,
      },
    },
    recommendations: {
      get: {
        opts: {
          auth: true,
          pagination: 'optional',
          extended: ['full'],
        },
        method: HttpMethod.GET,
        url: '/sync/recommendations/:type/:sort',
        optional: [],
        call,
      },
      add: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/sync/recommendations',
        body: {
          movies: null,
          shows: null,
        },
        optional: [],
        call,
      },
      remove: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/sync/recommendations/remove',
        body: {
          movies: null,
          shows: null,
        },
        optional: [],
        call,
      },
      reorder: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/sync/recommendations/reorder',
        body: {
          rank: null,
        },
        optional: [],
        call,
      },
    },
  },
} satisfies ITraktApi;

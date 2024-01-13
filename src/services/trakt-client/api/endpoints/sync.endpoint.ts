import { HttpMethod } from '~/utils/http.utils';

export const sync = {
  last_activities: {
    opts: {
      auth: true,
    },
    method: HttpMethod.GET,
    url: '/sync/last_activities',
  },
  playback: {
    get: {
      opts: {
        auth: true,
      },
      method: HttpMethod.GET,
      url: '/sync/playback/:type?limit=',
      // optional: ['type', 'limit'],
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/sync/playback/:id',
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
    },
  },
  watched: {
    opts: {
      auth: true,
      extended: ['full', 'noseasons'],
    },
    method: HttpMethod.GET,
    url: '/sync/watched/:type',
  },
  history: {
    get: {
      opts: {
        auth: true,
        pagination: true,
        extended: [TraktApiExtended.Full],
      },
      method: HttpMethod.GET,
      url: '/sync/history/:type/:id?start_at=&end_at=',
      // optional: ['type', 'id', 'start_at', 'end_at'],
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
    },
  },
  ratings: {
    get: {
      opts: {
        auth: true,
        pagination: 'optional',
        extended: [TraktApiExtended.Full],
      },
      method: HttpMethod.GET,
      url: '/sync/ratings/:type/:rating',
      // optional: ['rating', 'type'],
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
    },
    watchlist: {
      get: {
        opts: {
          auth: true,
          pagination: 'optional',
          extended: [TraktApiExtended.Full],
        },
        method: HttpMethod.GET,
        url: '/sync/watchlist/:type',
        // optional: ['type'],
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
      },
    },
    recommendations: {
      get: {
        opts: {
          auth: true,
          pagination: 'optional',
          extended: [TraktApiExtended.Full],
        },
        method: HttpMethod.GET,
        url: '/sync/recommendations/:type/:sort',
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
      },
    },
  },
};

import { HttpMethod } from '~/utils/http.utils';

export const users = {
  settings: {
    opts: {
      auth: true,
    },
    method: HttpMethod.GET,
    url: '/users/settings',
  },
  requests: {
    get: {
      opts: {
        auth: true,
        extended: [TraktApiExtended.Full],
      },
      method: HttpMethod.GET,
      url: '/users/requests',
    },
    following: {
      opts: {
        auth: true,
        extended: [TraktApiExtended.Full],
      },
      method: HttpMethod.GET,
      url: '/users/requests/following',
    },
    approve: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/users/requests/:id',
    },
    deny: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/users/requests/:id',
    },
    hidden: {
      get: {
        opts: {
          auth: true,
          pagination: true,
          extended: [TraktApiExtended.Full],
        },
        method: HttpMethod.GET,
        url: '/users/hidden/:section?type=',
        // optional: ['type'],
      },
      add: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/users/hidden/:section',
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
        url: '/users/hidden/:section/remove',
        body: {
          movies: null,
          shows: null,
          episodes: null,
        },
      },
    },
    likes: {
      opts: {
        auth: 'optional',
        extended: ['comments'],
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/users/:username/likes/:type',
      // optional: ['type'],
    },
    saved_filters: {
      opts: {
        auth: true,
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/users/saved_filters/:section',
    },
    profile: {
      opts: {
        auth: 'optional',
        extended: ['full', 'vip'],
      },
      method: HttpMethod.GET,
      url: '/users/:username',
    },
    collection: {
      opts: {
        auth: 'optional',
        extended: ['full', 'metadata'],
      },
      method: HttpMethod.GET,
      url: '/users/:username/collection/:type',
    },
    comments: {
      opts: {
        auth: 'optional',
        pagination: true,
        extended: [TraktApiExtended.Full],
      },
      method: HttpMethod.GET,
      url: '/users/:username/comments/:comment_type/:type?include_replies=',
      // optional: ['comment_type', 'type', 'include_replies'],
    },
  },
  lists: {
    get: {
      opts: {
        auth: 'optional',
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists',
    },
    collaborations: {
      opts: {
        auth: 'optional',
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists/collaborations',
    },
    create: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/users/:username/lists',
      body: {
        name: null,
        description: null,
        privacy: null,
        display_numbers: null,
        allow_comments: null,
      },
    },
    reorder: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/users/:username/lists/reorder',
      body: {
        rank: null,
      },
    },
  },
  list: {
    get: {
      opts: {
        auth: 'optional',
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists/:id',
    },
    update: {
      opts: {
        auth: true,
      },
      method: HttpMethod.PUT,
      url: '/users/:username/lists/:id',
      body: {
        name: null,
        description: null,
        privacy: null,
        display_numbers: null,
        allow_comments: null,
      },
    },
    delete: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/users/:username/lists/:id',
    },
    likes: {
      opts: {
        auth: 'optional',
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists/:id/likes',
    },
    like: {
      add: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/users/:username/lists/:id/like',
      },
      remove: {
        opts: {
          auth: true,
        },
        method: HttpMethod.DELETE,
        url: '/users/:username/lists/:id/like',
      },
    },
    items: {
      get: {
        opts: {
          auth: 'optional',
          pagination: 'optional',
          extended: [TraktApiExtended.Full],
        },
        method: HttpMethod.GET,
        url: '/users/:username/lists/:id/items?type=',
        // optional: ['type'],
      },
      add: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/users/:username/lists/:id/items',
        body: {
          movies: null,
          shows: null,
          people: null,
        },
      },
      remove: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/users/:username/lists/:id/items/remove',
        body: {
          movies: null,
          shows: null,
          people: null,
        },
      },
      reorder: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/users/:username/lists/:id/items/reorder',
        body: {
          rank: null,
        },
      },
    },
    comments: {
      opts: {
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists/:id/comments/:sort',
      // optional: ['sort'],
    },
  },
  follow: {
    add: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/users/:username/follow',
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/users/:username/follow',
    },
  },
  followers: {
    opts: {
      auth: 'optional',
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/users/:username/followers',
  },
  following: {
    opts: {
      auth: 'optional',
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/users/:username/following',
  },
  friends: {
    opts: {
      auth: 'optional',
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/users/:username/friends',
  },
  history: {
    opts: {
      auth: 'optional',
      pagination: true,
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/users/:username/history/:type/:item_id?start_at=&end_at=',
    // optional: ['type', 'item_id', 'start_at', 'end_at'],
  },
  ratings: {
    opts: {
      auth: 'optional',
      pagination: 'optional',
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/users/:username/ratings/:type/:rating',
    // optional: ['rating', 'type'],
  },
  watchlist: {
    opts: {
      auth: 'optional',
      pagination: 'optional',
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/users/:username/watchlist/:type',
    // optional: ['type'],
  },
  recommendations: {
    opts: {
      auth: true,
      pagination: 'optional',
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/users/:username/recommendations/:type/:sort',
    // optional: ['type', 'sort'],
  },
  watching: {
    opts: {
      auth: 'optional',
    },
    method: HttpMethod.GET,
    url: '/users/:username/watching',
  },
  watched: {
    opts: {
      auth: 'optional',
      extended: ['full', 'noseasons'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/watched/:type',
  },
  stats: {
    opts: {
      auth: 'optional',
    },
    method: HttpMethod.GET,
    url: '/users/:username/stats',
  },
};

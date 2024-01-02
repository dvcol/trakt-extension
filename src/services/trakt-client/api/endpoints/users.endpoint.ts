import type { ITraktApi } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

export const users = {
  settings: {
    opts: {
      auth: true,
    },
    method: HttpMethod.GET,
    url: '/users/settings',
    optional: [],
    call,
  },
  requests: {
    get: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/users/requests',
      optional: [],
      call,
    },
    following: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/users/requests/following',
      optional: [],
      call,
    },
    approve: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/users/requests/:id',
      optional: [],
      call,
    },
    deny: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/users/requests/:id',
      optional: [],
      call,
    },
    hidden: {
      get: {
        opts: {
          auth: true,
          pagination: true,
          extended: ['full'],
        },
        method: HttpMethod.GET,
        url: '/users/hidden/:section?type=',
        optional: ['type'],
        call,
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
        optional: [],
        call,
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
        optional: [],
        call,
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
      optional: ['type'],
      call,
    },
    saved_filters: {
      opts: {
        auth: true,
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/users/saved_filters/:section',
      optional: [],
      call,
    },
    profile: {
      opts: {
        auth: 'optional',
        extended: ['full', 'vip'],
      },
      method: HttpMethod.GET,
      url: '/users/:username',
      optional: [],
      call,
    },
    collection: {
      opts: {
        auth: 'optional',
        extended: ['full', 'metadata'],
      },
      method: HttpMethod.GET,
      url: '/users/:username/collection/:type',
      optional: [],
      call,
    },
    comments: {
      opts: {
        auth: 'optional',
        pagination: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/users/:username/comments/:comment_type/:type?include_replies=',
      optional: ['comment_type', 'type', 'include_replies'],
      call,
    },
  },
  lists: {
    get: {
      opts: {
        auth: 'optional',
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists',
      optional: [],
      call,
    },
    collaborations: {
      opts: {
        auth: 'optional',
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists/collaborations',
      optional: [],
      call,
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
      optional: [],
      call,
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
      optional: [],
      call,
    },
  },
  list: {
    get: {
      opts: {
        auth: 'optional',
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists/:id',
      optional: [],
      call,
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
      optional: [],
      call,
    },
    delete: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/users/:username/lists/:id',
      optional: [],
      call,
    },
    likes: {
      opts: {
        auth: 'optional',
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists/:id/likes',
      optional: [],
      call,
    },
    like: {
      add: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/users/:username/lists/:id/like',
        optional: [],
        call,
      },
      remove: {
        opts: {
          auth: true,
        },
        method: HttpMethod.DELETE,
        url: '/users/:username/lists/:id/like',
        optional: [],
        call,
      },
    },
    items: {
      get: {
        opts: {
          auth: 'optional',
          pagination: 'optional',
          extended: ['full'],
        },
        method: HttpMethod.GET,
        url: '/users/:username/lists/:id/items?type=',
        optional: ['type'],
        call,
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
        optional: [],
        call,
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
        optional: [],
        call,
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
        optional: [],
        call,
      },
    },
    comments: {
      opts: {
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists/:id/comments/:sort',
      optional: ['sort'],
      call,
    },
  },
  follow: {
    add: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/users/:username/follow',
      optional: [],
      call,
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/users/:username/follow',
      optional: [],
      call,
    },
  },
  followers: {
    opts: {
      auth: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/followers',
    optional: [],
    call,
  },
  following: {
    opts: {
      auth: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/following',
    optional: [],
    call,
  },
  friends: {
    opts: {
      auth: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/friends',
    optional: [],
    call,
  },
  history: {
    opts: {
      auth: 'optional',
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/history/:type/:item_id?start_at=&end_at=',
    optional: ['type', 'item_id', 'start_at', 'end_at'],
    call,
  },
  ratings: {
    opts: {
      auth: 'optional',
      pagination: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/ratings/:type/:rating',
    optional: ['rating', 'type'],
    call,
  },
  watchlist: {
    opts: {
      auth: 'optional',
      pagination: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/watchlist/:type',
    optional: ['type'],
    call,
  },
  recommendations: {
    opts: {
      auth: true,
      pagination: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/recommendations/:type/:sort',
    optional: ['type', 'sort'],
    call,
  },
  watching: {
    opts: {
      auth: 'optional',
    },
    method: HttpMethod.GET,
    url: '/users/:username/watching',
    optional: [],
    call,
  },
  watched: {
    opts: {
      auth: 'optional',
      extended: ['full', 'noseasons'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/watched/:type',
    optional: [],
    call,
  },
  stats: {
    opts: {
      auth: 'optional',
    },
    method: HttpMethod.GET,
    url: '/users/:username/stats',
    optional: [],
    call,
  },
} satisfies ITraktApi;

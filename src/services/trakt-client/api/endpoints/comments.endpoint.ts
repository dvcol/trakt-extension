import type { ITraktApi } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

export const comments = {
  comment: {
    add: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/comments',
      body: {
        movie: null,
        show: null,
        season: null,
        episode: null,
        list: null,
        comment: null,
        spoiler: null,
        review: null,
      },
      optional: [],
      call,
    },
    get: {
      opts: {},
      method: HttpMethod.GET,
      url: '/comments/:id',
      optional: [],
      call,
    },
    update: {
      opts: {
        auth: true,
      },
      method: HttpMethod.PUT,
      url: '/comments/:id',
      body: {
        comment: null,
        spoiler: null,
        review: null,
      },
      optional: [],
      call,
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/comments/:id',
      optional: [],
      call,
    },
  },
  replies: {
    get: {
      opts: {
        auth: true,
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/comments/:id/replies',
      optional: [],
      call,
    },
    add: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/comments/:id/replies',
      body: {
        comment: null,
        spoiler: null,
      },
      optional: [],
      call,
    },
  },
  item: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/comments/:id/item',
    optional: [],
    call,
  },
  likes: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/comments/:id/likes',
    optional: [],
    call,
  },
  like: {
    add: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/comments/:id/like',
      optional: [],
      call,
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/comments/:id/like',
      optional: [],
      call,
    },
  },
  trending: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/comments/trending/:comment_type/:type?include_replies=',
    optional: ['comment_type', 'type', 'include_replies'],
    call,
  },
  recent: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/comments/recent/:comment_type/:type?include_replies=',
    optional: ['comment_type', 'type', 'include_replies'],
    call,
  },
  updates: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/comments/updates/:comment_type/:type?include_replies=',
    optional: ['comment_type', 'type', 'include_replies'],
    call,
  },
} satisfies ITraktApi;

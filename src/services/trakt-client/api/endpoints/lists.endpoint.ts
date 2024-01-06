import type { ITraktApi, TraktApiParamsPagination } from '~/models/trakt-client.model';

import { TraktClientEndpoint } from '~/models/trakt-client.model';
import { HttpMethod } from '~/utils/http.utils';

export const lists = {
  /**
   * Returns all lists with the most likes and comments over the last 7 days.
   *
   * @pagination true
   * @emoji true
   *
   * @see {@link https://trakt.docs.apiary.io/#reference/languages/list}
   */
  trending: new TraktClientEndpoint<TraktApiParamsPagination>({
    method: HttpMethod.GET,
    url: '/lists/trending',
    opts: {
      pagination: true,
      emoji: true,
    },
  }),
  /**
   * @see {@link https://trakt.docs.apiary.io/#reference/lists/popular}
   */
  popular: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/lists/popular',
    optional: [],
    call,
  },
  /**
   * @see {@link https://trakt.docs.apiary.io/#reference/lists/list}
   */
  list: {
    opts: {},
    method: HttpMethod.GET,
    url: '/lists/:id',
    optional: [],
    call,
  },
  /**
   * @see {@link https://trakt.docs.apiary.io/#reference/lists/list-likes}
   */
  likes: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/lists/:id/likes',
    optional: [],
    call,
  },
  like: {
    /**
     * @see {@link https://trakt.docs.apiary.io/#reference/lists/list-like/like-a-list}
     */
    add: {
      opts: {
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/lists/:id/like',
      optional: [],
      call,
    },
    /**
     * @see {@link https://trakt.docs.apiary.io/#reference/lists/list-like/remove-like-on-a-list}
     */
    remove: {
      opts: {
        pagination: true,
      },
      method: HttpMethod.DELETE,
      url: '/lists/:id/like',
      optional: [],
      call,
    },
  },
  /**
   * @see {@link https://trakt.docs.apiary.io/#reference/lists/list-items}
   */
  items: {
    opts: {
      pagination: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/lists/:id/items/:type',
    optional: [],
    call,
  },
  /**
   * @see {@link https://trakt.docs.apiary.io/#reference/lists/list-comments}
   */
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/lists/:id/comments/:sort',
    optional: ['sort'],
    call,
  },
} satisfies ITraktApi;

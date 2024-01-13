import type { TraktApiParamsExtended, TraktApiParamsPagination } from '~/models/trakt-client.model';

import type { TraktComment } from '~/models/trakt-comment.model';
import type { TraktLike } from '~/models/trakt-like.model';
import type { TraktList, TraktListItem, TraktListList } from '~/models/trakt-list.model';

import { TraktApiExtended, TraktClientEndpoint } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

export const lists = {
  /**
   * Returns all lists with the most likes and comments over the last 7 days.
   *
   * @pagination true - {@link TraktApiPagination}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   *
   * @see [apiary]{@link https://trakt.docs.apiary.io/#reference/lists/trending}
   */
  trending: new TraktClientEndpoint<TraktApiParamsPagination, TraktListList[]>({
    method: HttpMethod.GET,
    url: '/lists/trending',
    opts: {
      pagination: true,
      emoji: true,
    },
  }),
  /**
   * Returns the most popular lists. Popularity is calculated using total number of likes and comments.
   *
   * @pagination true - {@link TraktApiPagination}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   *
   * @see [apiary]{@link https://trakt.docs.apiary.io/#reference/lists/popular}
   */
  popular: new TraktClientEndpoint<TraktApiParamsPagination, TraktListList[]>({
    method: HttpMethod.GET,
    url: '/lists/popular',
    opts: {
      pagination: true,
      emoji: true,
    },
  }),
  /**
   * Returns a single list. Use the /lists/:id/items method to get the actual items this list contains.
   *
   * Note: You must use an integer id, and only public lists will return data.
   *
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   *
   * @see [list]{@link https://trakt.docs.apiary.io/#reference/lists/list}
   */
  list: new TraktClientEndpoint<
    {
      /** Trakt ID (i.e. 15) */
      id: number;
    },
    TraktList
  >({
    method: HttpMethod.GET,
    url: '/lists/:id',
    opts: {
      emoji: true,
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns all users who liked a list.
   *
   * @pagination true - {@link TraktApiPagination}
   *
   * @see [list-likes]{@link https://trakt.docs.apiary.io/#reference/lists/list-likes}
   */
  likes: new TraktClientEndpoint<
    {
      /** Trakt ID (i.e. 15) */
      id: number;
    } & TraktApiParamsPagination,
    TraktLike[]
  >({
    method: HttpMethod.GET,
    url: '/lists/:id/likes',
    opts: {
      pagination: true,
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  like: {
    /**
     * Votes help determine popular lists. Only one like is allowed per list per user.
     *
     * @auth required
     *
     * @see [like-a-list]{@link https://trakt.docs.apiary.io/#reference/lists/list-like/like-a-list}
     */
    add: new TraktClientEndpoint<{
      /** Trakt ID (i.e. 15) */
      id: number;
    }>({
      method: HttpMethod.GET,
      url: '/lists/:id/like',
      opts: {
        auth: true,
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
    /**
     * Remove a like on a list.
     *
     * @auth required
     *
     * @see [remove-like-on-a-list]{@link https://trakt.docs.apiary.io/#reference/lists/list-like/remove-like-on-a-list}
     */
    remove: new TraktClientEndpoint<{
      /** Trakt ID (i.e. 15) */
      id: number;
    }>({
      method: HttpMethod.DELETE,
      url: '/lists/:id/like',
      opts: {
        auth: true,
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
  },
  /**
   * Get all items on a personal list.
   * Items can be a movie, show, season, episode, or person.
   * You can optionally specify the type parameter with a single value or comma delimited string for multiple item types.
   *
   * * Notes
   *
   * Each list item contains a notes field with text entered by the user.
   *
   * * Sorting HeadersAll
   *
   * All list items are sorted by ascending rank. We also send X-Sort-By and X-Sort-How headers which can be used to custom sort the list in your app based on the user's preference.
   * Values for X-Sort-By include rank, added, title, released, runtime, popularity, percentage, votes, my_rating, random, watched, and collected.
   * Values for X-Sort-How include asc and desc.
   *
   * @pagination optional - {@link TraktApiPagination}
   * @extended full - {@link TraktApiExtended.Full}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   *
   * @see [list-items]{@link https://trakt.docs.apiary.io/#reference/lists/list-items}
   */
  items: new TraktClientEndpoint<
    {
      /** Trakt ID (i.e. 15) */
      id: number;
      /** Filter for a specific item type */
      type?: 'movie' | 'show' | 'season' | 'episode' | 'perso';
    } & TraktApiParamsPagination &
      TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktListItem[]
  >({
    method: HttpMethod.GET,
    url: '/lists/:id/items/:type',
    opts: {
      pagination: 'optional',
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          id: true,
          type: false,
        },
      },
    },
  }),
  /**
   * Returns all top level comments for a list.
   * By default, the newest comments are returned first.
   * Other sorting options include oldest, most likes, and most replies.
   *
   * Note: If you send OAuth, comments from blocked users will be automatically filtered out.
   *
   * @pagination true - {@link TraktApiPagination}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   * @auth optional
   *
   * @see [list-comments]{@link https://trakt.docs.apiary.io/#reference/lists/list-comments}
   */
  comments: new TraktClientEndpoint<
    {
      /** Trakt ID (i.e. 15) */
      id: number;
      /** How to sort  */
      sort: 'newest' | 'oldest' | 'likes' | 'replies';
    } & TraktApiParamsPagination,
    TraktComment[]
  >({
    method: HttpMethod.GET,
    url: '/lists/:id/comments/:sort',
    opts: {
      pagination: true,
      emoji: true,
      auth: 'optional',
      parameters: {
        path: {
          id: true,
          sort: false,
        },
      },
    },
  }),
};

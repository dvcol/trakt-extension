import type { TraktCollection } from '~/models/trakt/trakt-collection.model';
import type { TraktComment, TraktCommentItem } from '~/models/trakt/trakt-comment.model';
import type { TraktFavoriteItem } from '~/models/trakt/trakt-favorite.model';
import type { TraktHistory } from '~/models/trakt/trakt-history.model';
import type { TraktLike } from '~/models/trakt/trakt-like.model';
import type {
  TraktList,
  TraktListItem,
  TraktListReordered,
  TraktUserListItemAdded,
  TraktUserListItemRemoved,
  TraktUserListItemRemoveRequest,
  TraktUserListItemRequest,
} from '~/models/trakt/trakt-list.model';
import type { TraktNoteItem, TraktNoteTypes } from '~/models/trakt/trakt-note.model';
import type { TraktRating } from '~/models/trakt/trakt-rating.model';
import type { TraktStats } from '~/models/trakt/trakt-stats.model';
import type {
  TraktUser,
  TraktUserFilter,
  TraktUserFollow,
  TraktUserFollower,
  TraktUserFollowing,
  TraktUserFollowRequest,
  TraktUserFriend,
  TraktUserHiddenAdded,
  TraktUserHiddenDeleted,
  TraktUserHiddenItem,
  TraktUserHiddenRequest,
  TraktUserLikeComment,
  TraktUserSettings,
} from '~/models/trakt/trakt-user.model';

import type { TraktWatched, TraktWatching } from '~/models/trakt/trakt-watched.model';
import type { TraktWatchlist } from '~/models/trakt/trakt-watchlist.model';

import { TraktApiExtended, type TraktApiParamsExtended, type TraktApiParamsPagination, TraktClientEndpoint } from '~/models/trakt/trakt-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * User's with public data will return info with all GET methods.
 * Private user's (including yourself) require valid OAuth and a friend relationship to return data.
 *
 * * <b>Username vs. Slug</b>
 *
 * All users methods should use the slug to identify the user.
 * The slug is a URL safe and globally unique version of the username.
 *
 * * <b>Special ID for the OAuth user<+b>
 *
 * If you send valid OAuth, you can use me to identify the OAuth user instead of needing their actual slug.
 * You can of course still use their actual slug, it's up to you.
 *
 * * <b>Extra Headers</b>
 *
 * If valid OAuth is sent, additional headers will be sent to better determine it is a data permissions issue (they aren't friends) and not bad OAuth.
 * For example, you might try and access a private user's list you aren't friends with. This will return a 401 HTTP status code and the additional headers.
 * This means the OAuth is valid, but authorization ultimately failed because there is no friend relationship.
 *
 * - X-Private-User	- true or false
 *
 * * <b>Creating New Users</b>
 *
 * Since the API uses OAuth, users can create a new account during that flow if they need to. As far as your app is concerned, you'll still receive OAuth tokens no matter if they sign in with an existing account or create a new one.
 *
 * @see [users]{@link https://trakt.docs.apiary.io/#reference/users}
 */
export const users = {
  /**
   * Get the user's settings so you can align your app's experience with what they're used to on the trakt website. A globally unique uuid is also returned, which can be used to identify the user locally in your app if needed. However, the uuid can't be used to retrieve data from the Trakt API.
   *
   * @auth required
   *
   * @see [retrieve-settings]{@link https://trakt.docs.apiary.io/#reference/users/settings/retrieve-settings}
   */
  settings: new TraktClientEndpoint<TraktApiParamsExtended<typeof TraktApiExtended.Full>, TraktUserSettings>({
    method: HttpMethod.GET,
    url: '/users/settings',
    opts: {
      auth: true,
    },
  }),
  requests: {
    /**
     * List a user's pending following requests that they're waiting for the other user's to approve.
     *
     * @extended true - {@link TraktApiExtended.Full}
     * @auth required
     *
     * @see [get-pending-following-requests]{@link https://trakt.docs.apiary.io/#reference/users/following-requests/get-pending-following-requests}
     */
    following: new TraktClientEndpoint<TraktApiParamsExtended<typeof TraktApiExtended.Full>, TraktUserFollowRequest>({
      method: HttpMethod.GET,
      url: '/users/requests/following',
      opts: {
        auth: true,
        extended: [TraktApiExtended.Full],
      },
    }),
    /**
     * List a user's pending follow requests so they can either approve or deny them.
     *
     * @extended true - {@link TraktApiExtended.Full}
     * @auth required
     *
     * @see [get-follow-requests]{@link https://trakt.docs.apiary.io/#reference/users/follower-requests/get-follow-requests}
     */
    follower: new TraktClientEndpoint<TraktApiParamsExtended<typeof TraktApiExtended.Full>, TraktUserFollowRequest>({
      method: HttpMethod.GET,
      url: '/users/requests',
      opts: {
        auth: true,
        extended: [TraktApiExtended.Full],
      },
    }),
    /**
     * List a user's pending follow requests so they can either approve or deny them.
     *
     * @auth required
     *
     * @see [approve-follow-request]{@link https://trakt.docs.apiary.io/#reference/users/approve-or-deny-follower-requests/approve-follow-request}
     */
    approve: new TraktClientEndpoint<
      {
        /** ID of the follower request. */
        id: number;
      },
      TraktUserFollower,
      false
    >({
      method: HttpMethod.POST,
      url: '/users/requests/:id',
      opts: {
        auth: true,
        cache: false,
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
    /**
     * Deny a follower using the id of the request. If the id is not found, was already approved, or was already denied, a 404 error will be returned.
     *
     * @auth required
     *
     * @see [deny-follow-request]{@link https://trakt.docs.apiary.io/#reference/users/approve-or-deny-follower-requests/deny-follow-request}
     */
    deny: new TraktClientEndpoint<
      {
        /** ID of the follower request. */
        id: number;
      },
      unknown,
      false
    >({
      method: HttpMethod.DELETE,
      url: '/users/requests/:id',
      opts: {
        auth: true,
        cache: false,
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
    /**
     * Get all saved filters a user has created.
     * The path and query can be used to construct an API path to retrieve the saved data.
     * Think of this like a dynamically updated list.
     *
     * @pagination true - {@link TraktApiPagination}
     * @vip required - [Requires a paid VIP subscription]{@link https://trakt.docs.apiary.io/#introduction/vip-methods}
     * @auth required
     *
     * @see [get-saved-filters]{@link https://trakt.docs.apiary.io/#reference/users/saved-filters/get-saved-filters}
     */
    savedFilters: new TraktClientEndpoint<
      {
        section?: 'movies' | 'shows' | 'calendar' | 'search';
      } & TraktApiParamsPagination,
      TraktUserFilter[]
    >({
      method: HttpMethod.GET,
      url: '/users/saved_filters/:section',
      opts: {
        vip: true,
        auth: true,
        pagination: true,
        parameters: {
          path: {
            section: false,
          },
        },
      },
    }),
    hidden: {
      /**
       * Get hidden items for a section.
       * This will return an array of standard media objects.
       * You can optionally limit the type of results to return.
       *
       * @pagination true - {@link TraktApiPagination}
       * @extended true - {@link TraktApiExtended.Full}
       * @auth required
       *
       * @see [get-hidden-items]{@link https://trakt.docs.apiary.io/#reference/users/hidden-items/get-hidden-items}
       */
      get: new TraktClientEndpoint<
        {
          /** Mandatory section name */
          section: 'calendar' | 'progress_watched' | 'progress_watched_reset' | 'progress_collected' | 'recommendations' | 'comments';
          /** Narrow down by element type. */
          type?: 'movie' | 'show' | 'season' | 'user';
        } & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
          TraktApiParamsPagination,
        TraktUserHiddenItem[]
      >({
        method: HttpMethod.GET,
        url: '/users/hidden/:section?type=',
        opts: {
          auth: true,
          pagination: true,
          extended: [TraktApiExtended.Full],
          parameters: {
            path: {
              section: true,
            },
            query: {
              type: false,
            },
          },
        },
      }),
      /**
       * Hide items for a specific section. Here's what type of items can hidden for each section.
       *
       * @auth required
       *
       * @see [add-hidden-items]{@link https://trakt.docs.apiary.io/#reference/users/add-hidden-items/add-hidden-items}
       */
      add: new TraktClientEndpoint<TraktUserHiddenRequest, TraktUserHiddenAdded, false>({
        method: HttpMethod.POST,
        url: '/users/hidden/:section',
        opts: {
          auth: true,
          cache: false,
          parameters: {
            path: {
              section: true,
            },
          },
        },
        body: {
          movies: false,
          shows: false,
          seasons: false,
          users: false,
        },
      }),
      /**
       * Un-hide items for a specific section. Here's what type of items can unhidden for each section.
       *
       * @auth required
       *
       * @see [remove-hidden-items]{@link https://trakt.docs.apiary.io/#reference/users/remove-hidden-items/remove-hidden-items}
       */
      remove: new TraktClientEndpoint<TraktUserHiddenRequest, TraktUserHiddenDeleted, false>({
        method: HttpMethod.POST,
        url: '/users/hidden/:section/remove',
        opts: {
          auth: true,
          cache: false,
          parameters: {
            path: {
              section: true,
            },
          },
        },
        body: {
          movies: false,
          shows: false,
          seasons: false,
          users: false,
        },
      }),
    },
    /**
     * Get a user's profile information. If the user is private, info will only be returned if you send OAuth and are either that user or an approved follower.
     * Adding ?extended=vip will return some additional VIP related fields so you can display the user's Trakt VIP status and year count.
     *
     * @extended true - {@link TraktApiExtended.Vip}, {@link TraktApiExtended.Full}
     * @auth optional
     *
     * @see [get-user-profile]{@link https://trakt.docs.apiary.io/#reference/users/profile/get-user-profile}
     */
    profile: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
      } & TraktApiParamsExtended<typeof TraktApiExtended.Vip | typeof TraktApiExtended.Full>,
      TraktUser<'any'>
    >({
      method: HttpMethod.GET,
      url: '/users/:id',
      opts: {
        auth: 'optional',
        extended: [TraktApiExtended.Full, TraktApiExtended.Vip],
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
    /**
     * Get items a user likes.
     * This will return an array of standard media objects.
     * You can optionally limit the type of results to return.
     *
     * * <b>Comment Media Objects</b>
     *
     * If you add ?extended=comments to the URL, it will return media objects for each comment like.
     *
     * * <b>Note</b>
     *
     * This returns a lot of data, so please only use this extended parameter if you actually need it!
     *
     * @extended true - {@link TraktApiExtended.Comments}
     * @pagination true - {@link TraktApiPagination}
     * @auth optional
     *
     * @see [get-likes]{@link https://trakt.docs.apiary.io/#reference/users/likes/get-likes}
     */
    likes: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
        type?: 'comments' | 'lists';
      } & TraktApiParamsExtended<typeof TraktApiExtended.Comments>,
      TraktUserLikeComment
    >({
      method: HttpMethod.GET,
      url: '/users/:id/likes/:type',
      opts: {
        auth: 'optional',
        extended: [TraktApiExtended.Comments],
        pagination: true,
        parameters: {
          path: {
            username: true,
            type: false,
          },
        },
      },
    }),
    /**
     * Get all collected items in a user's collection. A collected item indicates availability to watch digitally or on physical media.
     *
     * Each movie object contains collected_at and updated_at timestamps.
     * Since users can set custom dates when they collected movies, it is possible for collected_at to be in the past.
     * We also include updated_at to help sync Trakt data with your app.
     * Cache this timestamp locally and only re-process the movie if you see a newer timestamp.
     *
     * Each show object contains last_collected_at and last_updated_at timestamps.
     * Since users can set custom dates when they collected episodes, it is possible for last_collected_at to be in the past. We also include last_updated_at to help sync Trakt data with your app.
     * Cache this timestamp locally and only re-process the show if you see a newer timestamp.
     *
     * If you add ?extended=metadata to the URL, it will return the additional media_type, resolution, hdr, audio, audio_channels and '3d' metadata.
     * It will use null if the metadata isn't set for an item.
     *
     * @extended true - {@link TraktApiExtended.Full}, {@link TraktApiExtended.Metadata}
     * @auth optional
     *
     * @see [get-collection]{@link https://trakt.docs.apiary.io/#reference/users/collection/get-collection}
     */
    collection: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
        type: 'movies' | 'shows';
      } & TraktApiParamsExtended<typeof TraktApiExtended.Full | typeof TraktApiExtended.Metadata>,
      TraktCollection[]
    >({
      method: HttpMethod.GET,
      url: '/users/:id/collection/:type',
      opts: {
        auth: 'optional',
        extended: [TraktApiExtended.Full, TraktApiExtended.Metadata],
        parameters: {
          path: {
            username: true,
            type: true,
          },
        },
      },
    }),
    /**
     * Returns the most recently written comments for the user.
     * You can optionally filter by the comment_type and media type to limit what gets returned.
     *
     * By default, only top level comments are returned. Set ?include_replies=true to return replies in addition to top level comments.
     * Set ?include_replies=only to return only replies and no top level comments.
     *
     * @pagination true - {@link TraktApiPagination}
     * @extended true - {@link TraktApiExtended.Full}
     *
     * @see [get-comments]{@link https://trakt.docs.apiary.io/#reference/users/comments/get-comments}
     */
    comments: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
        comment_type?: 'all' | 'reviews' | 'shouts';
        type?: 'all' | 'movies' | 'shows' | 'seasons' | 'episodes' | 'lists';
        include_replies?: boolean | 'only';
      } & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
        TraktApiParamsPagination,
      TraktCommentItem[]
    >({
      method: HttpMethod.GET,
      url: '/users/:id/comments/:comment_type/:type?include_replies=false',
      opts: {
        auth: 'optional',
        pagination: true,
        extended: [TraktApiExtended.Full],
        parameters: {
          path: {
            id: true,
            comment_type: false,
            type: false,
          },
          query: {
            include_replies: false,
          },
        },
      },
    }),
  },
  /**
   * Returns the most recently notes for the user.
   * You can optionally filter by media type to limit what gets returned.
   * Use the attached_to info to know what the note is actually added to.
   * Media items like movie, show, season, episode, or person are straightforward, but history will need to be mapped to that specific play in their watched history since they might have multiple plays.
   * Since collection and rating is a 1:1 association, you can assume the note is attached to the media item in the type field that has been collected or rated.
   *
   * @vip required - [Requires a paid VIP subscription]{@link https://trakt.docs.apiary.io/#introduction/vip-methods}
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @auth optional
   *
   * @see [get-notes]{@link https://trakt.docs.apiary.io/#reference/users/notes/get-notes}
   */
  notes: new TraktClientEndpoint<
    {
      /** User slug */
      id: string;
      type?: 'all' | TraktNoteTypes;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
      TraktApiParamsPagination,
    TraktNoteItem[]
  >({
    method: HttpMethod.GET,
    url: '/users/:id/notes/:type',
    opts: {
      vip: true,
      auth: 'optional',
      pagination: true,
      extended: [TraktApiExtended.Full],
    },
  }),
  lists: {
    /**
     * Returns all personal lists for a user.
     * Use the [/users/:id/lists/:list_id/items]{@link https://trakt.docs.apiary.io/#reference/users/list-items} method to get the actual items a specific list contains.
     *
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     * @auth optional
     *
     * @see [get-a-user's-personal-lists]{@link https://trakt.docs.apiary.io/#reference/users/lists/get-a-user's-personal-lists}
     */
    get: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
      },
      TraktList[]
    >({
      method: HttpMethod.GET,
      url: '/users/:id/lists',
      opts: {
        auth: 'optional',
        emoji: true,
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
    /**
     * Create a new personal list. The name is the only required field, but the other info is recommended to ask for.
     *
     * * <b>Limits</b>
     *
     * If the user's list limit is exceeded, a 420 HTTP error code is returned.
     * Use the [/users/settings]{@link https://trakt.docs.apiary.io/reference/users/settings} method to get all limits for a user account.
     * In most cases, upgrading to [Trakt VIP]{@link https://trakt.tv/vip} will increase the limits.
     *
     * * <b>Privacy</b>
     *
     * Lists will be private by default. Here is what each value means.
     *
     * * private - Only you can see the list.
     * * link - Anyone with the share_link can see the list.
     * * friends - Only your friends can see the list.
     * * public - Anyone can see the list.
     *
     * @vip enhanced - [Enhanced by a paid VIP subscription]{@link https://trakt.docs.apiary.io/#introduction/vip-methods}
     * @auth required
     *
     * @see [create-personal-list]{@link https://trakt.docs.apiary.io/#reference/users/lists/create-personal-list}
     */
    create: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
        /** Name of the list. */
        name: string;
        /** Description for this list. */
        description?: string;
        /**
         * Privacy setting for this list:
         *
         * * private - Only you can see the list.
         * * link - Anyone with the share_link can see the list.
         * * friends - Only your friends can see the list.
         * * public - Anyone can see the list.
         */
        privacy?: 'private' | 'link' | 'friends' | 'public';
        /** Should each item be numbered? */
        display_numbers?: boolean;
        /** Are comments allowed? */
        allow_comments?: boolean;
        sort_by?:
          | 'rank'
          | 'added'
          | 'title'
          | 'released'
          | 'runtime'
          | 'popularity'
          | 'percentage'
          | 'votes'
          | 'my_rating'
          | 'random'
          | 'watched'
          | 'collected';
        sort_how?: 'asc' | 'desc';
      },
      TraktList,
      false
    >({
      method: HttpMethod.POST,
      url: '/users/:id/lists',
      opts: {
        auth: true,
        cache: false,
        vip: 'enhanced',
        parameters: {
          path: {
            id: true,
          },
        },
      },
      body: {
        name: true,
        description: false,
        privacy: false,
        display_numbers: false,
        allow_comments: false,
      },
    }),
    /**
     * Reorder all lists by sending the updated rank of list ids. Use the [/users/:id/lists]{@link https://trakt.docs.apiary.io/#reference/users/lists} method to get all list ids.
     *
     * @auth required
     *
     * @see [reorder-a-user's-lists]{@link https://trakt.docs.apiary.io/#reference/users/reorder-lists/reorder-a-user's-lists}
     */
    reorder: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
        /** Array of list ids in the new order. */
        rank: number[];
      },
      Omit<TraktListReordered, 'list'>,
      false
    >({
      method: HttpMethod.POST,
      url: '/users/:id/lists/reorder',
      opts: {
        auth: true,
        cache: false,
      },
      body: {
        rank: true,
      },
    }),
    /**
     * Returns all lists a user can collaborate on.
     * This gives full access to add, remove, and re-order list items.
     * It essentially works just like a list owned by the user, just make sure to use the correct list owner user when building the API URLs.
     *
     * @auth optional
     *
     * @see [get-all-lists-a-user-can-collaborate-on]{@link https://trakt.docs.apiary.io/#reference/users/collaborations/get-all-lists-a-user-can-collaborate-on}
     */
    collaborations: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
      },
      TraktList[]
    >({
      method: HttpMethod.GET,
      url: '/users/:id/lists/collaborations',
      opts: {
        auth: 'optional',
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
  },
  list: {
    /**
     * Returns a single personal list. Use the [/users/:id/lists/:list_id/items]{@link https://trakt.docs.apiary.io/#reference/users/list-items} method to get the actual items this list contains.
     *
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     * @auth optional
     *
     * @see [get-personal-list]{@link https://trakt.docs.apiary.io/#reference/users/list/get-personal-list}
     */
    get: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
        /** List Trakt ID or Trakt slug */
        list_id: string;
      },
      TraktList[]
    >({
      method: HttpMethod.GET,
      url: '/users/:id/lists/:list_id',
      opts: {
        auth: 'optional',
        emoji: true,
        parameters: {
          path: {
            id: true,
            list_id: true,
          },
        },
      },
    }),
    /**
     * Update a personal list by sending 1 or more parameters.
     * If you update the list name, the original slug will still be retained so existing references to this list won't break.
     *
     * * <b>Privacy</b>
     *
     * Lists will be private by default. Here is what each value means.
     *
     * * private - Only you can see the list.
     * * link - Anyone with the share_link can see the list.
     * * friends - Only your friends can see the list.
     * * public - Anyone can see the list.
     *
     * @auth required
     *
     * @see [update-personal-list]{@link https://trakt.docs.apiary.io/#reference/users/list/update-personal-list}
     */
    update: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
        /** List Trakt ID or Trakt slug */
        list_id: string;
        /** Name of the list. */
        name?: string /**
         * Privacy setting for this list:
         *
         * * private - Only you can see the list.
         * * link - Anyone with the share_link can see the list.
         * * friends - Only your friends can see the list.
         * * public - Anyone can see the list.
         */;
        privacy?: 'private' | 'link' | 'friends' | 'public';
        /** Should each item be numbered? */
        display_numbers?: boolean;
        sort_by?:
          | 'rank'
          | 'added'
          | 'title'
          | 'released'
          | 'runtime'
          | 'popularity'
          | 'percentage'
          | 'votes'
          | 'my_rating'
          | 'random'
          | 'watched'
          | 'collected';
        sort_how?: 'asc' | 'desc';
      },
      TraktList,
      false
    >({
      method: HttpMethod.PUT,
      url: '/users/:id/lists/:list_id',
      opts: {
        auth: true,
        cache: false,
        parameters: {
          path: {
            id: true,
            list_id: true,
          },
        },
      },
      body: {
        name: false,
        description: false,
        privacy: false,
        display_numbers: false,
        allow_comments: false,
      },
    }),
    /**
     * Remove a personal list and all items it contains.
     *
     * @auth required
     *
     * @see [delete-a-user's-personal-list]{@link https://trakt.docs.apiary.io/#reference/users/list/delete-a-user's-personal-list}
     */
    delete: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
        /** List Trakt ID or Trakt slug */
        list_id: string;
      },
      unknown,
      false
    >({
      method: HttpMethod.DELETE,
      url: '/users/:id/lists/:list_id',
      opts: {
        auth: true,
        cache: false,
        parameters: {
          path: {
            id: true,
            list_id: true,
          },
        },
      },
    }),
    /**
     * Returns all users who liked a list.
     *
     * @pagination true - {@link TraktApiPagination}
     * @auth optional
     *
     * @see [get-all-users-who-liked-a-list]{@link https://trakt.docs.apiary.io/#reference/users/list-likes/get-all-users-who-liked-a-list}
     */
    likes: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
        /** List Trakt ID or Trakt slug */
        list_id: string;
      },
      TraktLike[]
    >({
      method: HttpMethod.GET,
      url: '/users/:id/lists/:list_id/likes',
      opts: {
        auth: 'optional',
        pagination: true,
        parameters: {
          path: {
            id: true,
            list_id: true,
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
       * @see [like-a-list]{@link https://trakt.docs.apiary.io/#reference/users/list-like/like-a-list}
       */
      add: new TraktClientEndpoint<
        {
          /** User slug */
          id: string;
          /** List Trakt ID or Trakt slug */
          list_id: string;
        },
        unknown,
        false
      >({
        method: HttpMethod.POST,
        url: '/users/:id/lists/:list_id/like',
        opts: {
          auth: true,
          cache: false,
          parameters: {
            path: {
              id: true,
              list_id: true,
            },
          },
        },
      }),
      /**
       * Remove a like on a list.
       *
       * @auth required
       *
       * @see [remove-like-on-a-list]{@link https://trakt.docs.apiary.io/#reference/users/list-like/remove-like-on-a-list}
       */
      remove: new TraktClientEndpoint<
        {
          /** User slug */
          id: string;
          /** List Trakt ID or Trakt slug */
          list_id: string;
        },
        unknown,
        false
      >({
        method: HttpMethod.DELETE,
        url: '/users/:id/lists/:list_id/like',
        opts: {
          auth: true,
          cache: false,
          parameters: {
            path: {
              id: true,
              list_id: true,
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
     * * <b>Notes</b>
     *
     * Each list item contains a notes field with text entered by the user.
     *
     * *<b>Sorting Headers</b>
     *
     * All list items are sorted by ascending rank. We also send X-Sort-By and X-Sort-How headers which can be used to custom sort the list <b>in your app</b> based on the user's preference.
     * Values for X-Sort-By include rank, added, title, released, runtime, popularity, percentage, votes, my_rating, random, watched, and collected.
     * Values for X-Sort-How include asc and desc.
     *
     * @pagination optional - {@link TraktApiPagination}
     * @extended true - {@link TraktApiExtended.Full}
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     * @auth optional
     *
     * @see [get-items-on-a-personal-list]{@link https://trakt.docs.apiary.io/#reference/users/list-items/get-items-on-a-personal-list}
     */
    items: {
      get: new TraktClientEndpoint<
        {
          /** User slug */
          id: string;
          /** List Trakt ID or Trakt slug */
          list_id: string;
          /** Type of list items */
          type?: 'movies' | 'shows' | 'seasons' | 'episodes' | 'person';
        } & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
          TraktApiParamsPagination,
        TraktListItem[]
      >({
        method: HttpMethod.GET,
        url: '/users/:id/lists/:list_id/items?type=',
        opts: {
          emoji: true,
          auth: 'optional',
          pagination: 'optional',
          extended: [TraktApiExtended.Full],
          parameters: {
            path: {
              id: true,
              list_id: true,
            },
            query: {
              type: false,
            },
          },
        },
      }),
      /**
       * Add one or more items to a personal list. Items can be movies, shows, seasons, episodes, or people.
       *
       * * <b>Notes</b>
       *
       * Each list item can optionally accept a notes (500 maximum characters) field with custom text.
       * The user must be a [Trakt VIP]{@https://trakt.tv/vip} to send notes.
       *
       * * <b>Limits</b>
       *
       * If the user's list item limit is exceeded, a 420 HTTP error code is returned. Use the [/users/settings]{@link https://trakt.docs.apiary.io/reference/users/settings} method to get all limits for a user account.
       * In most cases, upgrading to [Trakt VIP]{@https://trakt.tv/vip}  will increase the limits.
       *
       * @vip enhanced - [Enhanced by a paid VIP subscription]{@link https://trakt.docs.apiary.io/#introduction/vip-methods}
       * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
       * @auth required
       *
       * @see [add-items-to-personal-list]{@link https://trakt.docs.apiary.io/#reference/users/add-list-items/add-items-to-personal-list}
       */
      add: new TraktClientEndpoint<
        {
          /** User slug */
          id: string;
          /** List Trakt ID or Trakt slug */
          list_id: string;
        } & TraktUserListItemRequest,
        TraktUserListItemAdded,
        false
      >({
        method: HttpMethod.POST,
        url: '/users/:id/lists/:list_id/items',
        opts: {
          auth: true,
          cache: false,
          vip: 'enhanced',
          emoji: true,
          parameters: {
            path: {
              id: true,
              list_id: true,
            },
          },
        },
        body: {
          movies: false,
          shows: false,
          seasons: false,
          episodes: false,
          people: false,
        },
      }),
      /**
       * Remove one or more items from a personal list.
       *
       * @auth required
       *
       * @see [remove-items-from-personal-list]{@link https://trakt.docs.apiary.io/#reference/users/remove-list-items/remove-items-from-personal-list}
       */
      remove: new TraktClientEndpoint<
        {
          /** User slug */
          id: string;
          /** List Trakt ID or Trakt slug */
          list_id: string;
        } & TraktUserListItemRemoveRequest,
        TraktUserListItemRemoved,
        false
      >({
        method: HttpMethod.POST,
        url: '/users/:id/lists/:list_id/items/remove',
        opts: {
          auth: true,
          cache: false,
          parameters: {
            path: {
              id: true,
              list_id: true,
            },
          },
        },
        body: {
          movies: false,
          shows: false,
          seasons: false,
          episodes: false,
          people: false,
        },
      }),
      /**
       * Reorder all items on a list by sending the updated rank of list item ids. Use the [/users/:id/lists/:list_id/items]{@link https://trakt.docs.apiary.io/#reference/users/list-items} method to get all list item ids.
       *
       * @auth required
       *
       * @see [reorder-items-on-a-list]{@link https://trakt.docs.apiary.io/#reference/users/reorder-list-items/reorder-items-on-a-list}
       */
      reorder: new TraktClientEndpoint<
        {
          /** User slug */
          id: string;
          /** List Trakt ID or Trakt slug */
          list_id: string;
          /** Array of list item ids in the new order. */
          rank: number[];
        },
        TraktListReordered,
        false
      >({
        method: HttpMethod.POST,
        url: '/users/:id/lists/:list_id/items/reorder',
        opts: {
          auth: true,
          cache: false,
          parameters: {
            path: {
              id: true,
              list_id: true,
            },
          },
        },
        body: {
          rank: true,
        },
      }),
      /**
       * Update the notes on a single list item.
       *
       * @vip required - [Requires a paid VIP subscription]{@link https://trakt.docs.apiary.io/#introduction/vip-methods}
       * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
       * @auth required
       *
       * @see [update-list-item/update-a-list-item]{@link https://trakt.docs.apiary.io/#reference/users/update-list-item/update-a-list-item}
       */
      update: new TraktClientEndpoint<
        {
          /** User slug */
          id: string;
          /** List Trakt ID or Trakt slug */
          list_id: string;
          /** List item ID */
          list_item_id: string;
          /** List item notes */
          notes: string;
        },
        unknown,
        false
      >({
        method: HttpMethod.PUT,
        url: 'users/:id/lists/:list_id/items/:list_item_id',
        opts: {
          auth: true,
          vip: true,
          emoji: true,
          cache: false,
          parameters: {
            path: {
              id: true,
              list_id: true,
              list_item_id: true,
            },
          },
        },
        body: {
          notes: true,
        },
      }),
    },
    /**
     * Returns all top level comments for a list. By default, the newest comments are returned first.
     * Other sorting options include oldest, most likes, and most replies.
     *
     * * <b>Notes</b>
     *
     * If you send OAuth, comments from blocked users will be automatically filtered out.
     *
     * @pagination true - {@link TraktApiPagination}
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     * @auth optional
     *
     * @see [get-all-list-comments]{@link https://trakt.docs.apiary.io/#reference/users/list-comments/get-all-list-comments}
     */
    comments: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
        /** List Trakt ID or Trakt slug */
        list_id: string;
        /** How to sort the comments */
        sort?: 'newest' | 'oldest' | 'likes' | 'replies';
      } & TraktApiParamsPagination,
      TraktComment[]
    >({
      method: HttpMethod.GET,
      url: '/users/:id/lists/:list_id/comments/:sort',
      opts: {
        pagination: true,
        emoji: true,
        auth: 'optional',
        parameters: {
          path: {
            id: true,
            list_id: true,
            sort: false,
          },
        },
      },
    }),
  },
  follow: {
    /**
     * If the user has a private profile, the follow request will require approval (approved_at will be null).
     * If a user is public, they will be followed immediately (approved_at will have a date).
     *
     * * <b>Notes</b>
     *
     * If this user is already being followed, a 409 HTTP status code will returned.
     *
     * @auth required
     *
     * @see [follow-this-user]{@link https://trakt.docs.apiary.io/#reference/users/follow/follow-this-user}
     */
    add: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
      },
      TraktUserFollow,
      false
    >({
      method: HttpMethod.POST,
      url: '/users/:id/follow',
      opts: {
        auth: true,
        cache: false,
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
    /**
     * Unfollow someone you already follow.
     *
     * @auth required
     *
     * @see [unfollow-this-user]{@link https://trakt.docs.apiary.io/#reference/users/follow/unfollow-this-user}
     */
    remove: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
      },
      unknown,
      false
    >({
      method: HttpMethod.DELETE,
      url: '/users/:id/follow',
      opts: {
        auth: true,
        cache: false,
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
  },
  /**
   * Returns all followers including when the relationship began.
   *
   * @extended true - {@link TraktApiExtended.Full}
   * @auth optional
   *
   * @see [get-followers]{@link https://trakt.docs.apiary.io/#reference/users/followers/get-followers}
   */
  followers: new TraktClientEndpoint<
    {
      /** User slug */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktUserFollower[]
  >({
    method: HttpMethod.GET,
    url: '/users/:id/followers',
    opts: {
      auth: 'optional',
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns all user's they follow including when the relationship began.
   *
   * @extended true - {@link TraktApiExtended.Full}
   * @auth optional
   *
   * @see [get-following]{@link https://trakt.docs.apiary.io/#reference/users/following/get-following}
   */
  following: new TraktClientEndpoint<
    {
      /** User slug */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktUserFollowing[]
  >({
    method: HttpMethod.GET,
    url: '/users/:id/following',
    opts: {
      auth: 'optional',
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns all friends for a user including when the relationship began. Friendship is a 2 way relationship where each user follows the other.
   *
   * @extended true - {@link TraktApiExtended.Full}
   * @auth optional
   *
   * @see [get-friends]{@link https://trakt.docs.apiary.io/#reference/users/friends/get-friends}
   */
  friends: new TraktClientEndpoint<
    {
      /** User slug */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktUserFriend[]
  >({
    method: HttpMethod.GET,
    url: '/users/:id/friends',
    opts: {
      auth: 'optional',
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns movies and episodes that a user has watched, sorted by most recent.
   * You can optionally limit the type to movies or episodes.
   * The id (64-bit integer) in each history item uniquely identifies the event and can be used to remove individual events by using the [/sync/history/remove]{@link https://trakt.docs.apiary.io/#reference/sync/remove-from-history/get-watched-history} method.
   * The action will be set to scrobble, checkin, or watch.
   *
   * Specify a type and trakt item_id to limit the history for just that item.
   * If the item_id is valid, but there is no history, an empty array will be returned.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @auth optional
   *
   * @see [get-watched-history]{@link https://trakt.docs.apiary.io/#reference/users/history/get-watched-history}
   */
  history: new TraktClientEndpoint<
    {
      /** User slug */
      id: string;
      /** Type of history items */
      type?: 'movies' | 'shows' | 'seasons' | 'episodes';
      /** Trakt ID for a specific item. */
      item_id?: string;
      /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
      start_at?: string;
      /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
      end_at?: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
      TraktApiParamsPagination,
    TraktHistory[]
  >({
    method: HttpMethod.GET,
    url: '/users/:id/history/:type/:item_id?start_at=&end_at=',
    opts: {
      auth: 'optional',
      pagination: true,
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          id: true,
          type: false,
          item_id: false,
        },
        query: {
          start_at: false,
          end_at: false,
        },
      },
    },
  }),
  /**
   * Get a user's ratings filtered by type.
   * You can optionally filter for a specific rating between 1 and 10.
   * Send a comma separated string for rating if you need multiple ratings.
   *
   * @pagination optional - {@link TraktApiPagination}
   * @auth optional
   *
   * @see [get-ratings]{@link https://trakt.docs.apiary.io/#reference/users/ratings/get-ratings}
   */
  ratings: new TraktClientEndpoint<
    {
      /** User slug */
      id: string;
      /** Type of ratings */
      type?: 'movies' | 'shows' | 'seasons' | 'episodes' | 'all';
      /** Rating between 1 and 10 */
      rating?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    } & TraktApiParamsPagination,
    TraktRating[]
  >({
    method: HttpMethod.GET,
    url: '/users/:id/ratings/:type/:rating',
    opts: {
      auth: 'optional',
      pagination: 'optional',
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          id: true,
          type: false,
          rating: false,
        },
      },
    },
  }),
  watchlist: {
    /**
     * Returns all items in a user's watchlist filtered by type.
     *
     * * <b>Notes</b>
     *
     * Each watchlist item contains a notes field with text entered by the user.
     *
     * * <b>Sorting Headers</b>
     *
     * By default, all list items are sorted by rank asc.
     * We send X-Applied-Sort-By and X-Applied-Sort-How headers to indicate how the results are actually being sorted.
     *
     * We also send X-Sort-By and X-Sort-How headers which indicate the user's sort preference.
     * Use these to to custom sort the watchlist <b>in your app</b> for more advanced sort abilities we can't do in the API.
     * Values for X-Sort-By include rank, added, title, released, runtime, popularity, percentage, and votes.
     * Values for X-Sort-How include asc and desc.
     *
     * * <b>Auto Removal</b>
     *
     * When an item is watched, it will be automatically removed from the watchlist.
     * For shows and seasons, watching 1 episode will remove the entire show or season.
     *
     * <b>The watchlist should not be used as a list of what the user is actively watching.</b>
     *
     * Use a combination of the [/sync/watched]{@link https://trakt.docs.apiary.io/reference/sync/get-watched} and [/shows/:id/progress]{@link https://trakt.docs.apiary.io/reference/shows/watched-progress} methods to get what the user is actively watching.
     *
     * @pagination optional - {@link TraktApiPagination}
     * @extended true - {@link TraktApiExtended.Full}
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     * @auth optional
     *
     * @see [get-watchlist]{@link https://trakt.docs.apiary.io/#reference/users/watchlist/get-watchlist}
     */
    get: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
        /** Filter for a specific item type */
        type?: 'movies' | 'shows' | 'seasons' | 'episodes';
        /** How to sort the watchlist (only if type is also sent) */
        sort?: 'rank' | 'added' | 'released' | 'title';
      } & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
        TraktApiParamsPagination,
      TraktWatchlist[]
    >({
      method: HttpMethod.GET,
      url: '/users/:id/watchlist/:type/:sort',
      opts: {
        auth: 'optional',
        pagination: 'optional',
        extended: [TraktApiExtended.Full],
        parameters: {
          path: {
            id: true,
            type: false,
            sort: false,
          },
        },
      },
    }),
    /**
     * Returns all top level comments for the watchlist. By default, the newest comments are returned first.
     * Other sorting options include oldest, most likes, and most replies.
     *
     * * <b>Notes</b>
     *
     * If you send OAuth, comments from blocked users will be automatically filtered out.
     *
     * @pagination true - {@link TraktApiPagination}
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     * @auth optional
     *
     * @see [get-all-favorites-comments]{@link https://trakt.docs.apiary.io/#reference/users/watchlist-comments/get-all-favorites-comments}
     */
    comments: new TraktClientEndpoint<
      {
        /** User slug */
        id: string;
        /** How to sort the comments */
        sort?: 'newest' | 'oldest' | 'likes' | 'replies';
      } & TraktApiParamsPagination,
      TraktComment[]
    >({
      method: HttpMethod.GET,
      url: '/users/:id/watchlist/comments/:sort',
      opts: {
        auth: 'optional',
        pagination: true,
        emoji: true,
        parameters: {
          path: {
            id: true,
            sort: false,
          },
        },
      },
    }),
  },
  /**
   * Returns the top 50 items a user has favorited.
   * These favorites are used to enchance Trakt's social recommendation algorithm.
   * Apps should encourage user's to add favorites so the algorithm keeps getting better.
   *
   * * <b>Notes</b>
   *
   * Each favorite contains a notes field explaining why the user favorited the item.
   *
   * @pagination optional - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   * @auth required
   *
   * @see [get-favorites]{@link https://trakt.docs.apiary.io/#reference/users/favorites/get-favorites}
   */
  favorites: new TraktClientEndpoint<
    {
      /** User slug */
      id: string;
      /** Type of favorites */
      type?: 'movies' | 'shows';
      /** How to sort the favorites (only if type is also sent) */
      sort?: 'rank' | 'added' | 'released' | 'title';
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
      TraktApiParamsPagination,
    TraktFavoriteItem[]
  >({
    method: HttpMethod.GET,
    url: '/users/:id/recommendations/:type/:sort',
    opts: {
      auth: true,
      pagination: 'optional',
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          id: true,
          type: false,
          sort: false,
        },
      },
    },
  }),
  /**
   * Returns a movie or episode if the user is currently watching something.
   * If they are not, it returns no data and a 204 HTTP status code.
   *
   * @extended true - {@link TraktApiExtended.Full}
   * @auth optional
   *
   * @see [get-watching]{@link https://trakt.docs.apiary.io/#reference/users/watching/get-watching}
   */
  watching: new TraktClientEndpoint<
    {
      /** User slug */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktWatching
  >({
    method: HttpMethod.GET,
    url: '/users/:id/watching',
    opts: {
      auth: 'optional',
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns all movies or shows a user has watched sorted by most plays.
   *
   * If type is set to shows and you add ?extended=noseasons to the URL, it won't return season or episode info.
   *
   * Each movie and show object contains last_watched_at and last_updated_at timestamps.
   * Since users can set custom dates when they watched movies and episodes, it is possible for last_watched_at to be in the past. We also include last_updated_at to help sync Trakt data with your app.
   * Cache this timestamp locally and only re-process the movies and shows if you see a newer timestamp.
   *
   * Each show object contains a reset_at timestamp. If not null, this is when the user started re-watching the show.
   * Your app can adjust the progress by ignoring episodes with a last_watched_at prior to the reset_at.
   *
   * @extended true - {@link TraktApiExtended.Full}, {@link TraktApiExtended.NoSeasons}
   * @auth optional
   *
   * @see [get-watched]{@link https://trakt.docs.apiary.io/#reference/users/watched/get-watched}
   */
  watched: new TraktClientEndpoint<
    {
      /** User slug */
      id: string;
      /** Type of watched items */
      type?: 'movies' | 'shows';
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full | typeof TraktApiExtended.NoSeasons>,
    TraktWatched[]
  >({
    opts: {
      auth: 'optional',
      extended: [TraktApiExtended.Full, TraktApiExtended.NoSeasons],
      parameters: {
        path: {
          id: true,
          type: false,
        },
      },
    },
    method: HttpMethod.GET,
    url: '/users/:id/watched/:type',
  }),
  /**
   * Returns stats about the movies, shows, and episodes a user has watched, collected, and rated.
   *
   * @auth optional
   *
   * @see [get-stats]{@link https://trakt.docs.apiary.io/#reference/users/stats/get-stats}
   */
  stats: new TraktClientEndpoint<
    {
      /** User slug */
      id: string;
    },
    TraktStats
  >({
    method: HttpMethod.GET,
    url: '/users/:id/stats',
    opts: {
      auth: 'optional',
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
};

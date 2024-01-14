import type { TraktApiParamsExtended, TraktApiParamsPagination } from '~/models/trakt-client.model';

import type { TraktComment, TraktCommentItem, TraktCommentMedia, TraktCommentRequest } from '~/models/trakt-comment.model';
import type { TraktLike } from '~/models/trakt-like.model';

import { TraktApiExtended, TraktClientEndpoint } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

/**
 * Comments are attached to any movie, show, season, episode, or list and can be a quick shout or a more detailed review.
 * Each comment can have replies and can be liked. These likes are used to determine popular comments.
 * Comments must follow these rules and your app should indicate these to the user.
 * Failure to adhere to these rules could suspend the user's commenting abilities.
 *
 * * Comments must be at least 5 words.
 * * Comments 200 words or longer will be automatically marked as a review.
 * * Correctly indicate if the comment contains spoilers.
 * * Only write comments in English - <b>This is important!</b>
 * * <b>Do not include</b> app specific text like (via App Name) or #apphashtag. This clutters up the comments and failure to clean the comment text could get your app blacklisted from commenting.
 *
 * Possible Error Responses:
 * * 401	Invalid user
 * * 401	User banned from commenting
 * * 404	Item not found or doesn't allow comments
 * * 409	Comment can't be deleted
 * * 422	Validation errors
 *
 * If a comment doesn't pass validation, it returns a 422 HTTP error code and an array of validation errors in the response.
 *
 * The validation errors could include:
 * * must be at least 5 words
 * * must be written in English
 *
 * Comments support markdown formatting so you'll want to render this in your app so it matches what the website does.
 * In addition, we support inline spoiler tags like [spoiler]text[/spoiler] which you should also handle independent of the top level spoiler attribute.
 *
 * @see [comments]{@link https://trakt.docs.apiary.io/#reference/comments}
 */
export const comments = {
  comment: {
    /**
     * Add a new comment to a movie, show, season, episode, or list.
     * Make sure to allow and encourage spoilers to be indicated in your app and follow the rules listed above.
     *
     * The sharing object is optional and will apply the user's settings if not sent.
     * If sharing is sent, each key will override the user's setting for that social network.
     * Send true to post or false to not post on the indicated social network.
     * You can see which social networks a user has connected with the /users/settings method.
     *
     * @auth required
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     *
     * @see [post-a-comment]{@link https://trakt.docs.apiary.io/#reference/comments/comments/post-a-comment}
     */
    add: new TraktClientEndpoint<TraktCommentRequest, TraktComment>({
      method: HttpMethod.POST,
      url: '/comments',
      opts: {
        auth: true,
        emoji: true,
      },
      body: {
        comment: true,
        spoiler: false,
        sharing: false,

        movie: false,
        show: false,
        season: false,
        episode: false,
        list: false,
      },
    }),
    /**
     * Returns a single comment and indicates how many replies it has. Use [/comments/:id/replies]{@link https://trakt.docs.apiary.io/reference/comments/replies/} to get the actual replies.
     *
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     *
     * @see [get-a-comment-or-reply]{@link https://trakt.docs.apiary.io/#reference/comments/get-a-comment-or-reply}
     */
    get: new TraktClientEndpoint<
      {
        /** A specific comment ID. */
        id: number;
      },
      TraktComment
    >({
      method: HttpMethod.GET,
      url: '/comments/:id',
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
     * Update a single comment. The OAuth user must match the author of the comment in order to update it. If not, a 401 HTTP status is returned.
     *
     * @auth required
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     *
     * @see [update-a-comment-or-reply]{@link https://trakt.docs.apiary.io/#reference/comments/comment/update-a-comment-or-reply}
     */
    update: new TraktClientEndpoint<
      {
        /** A specific comment ID. */
        id: number;
      },
      TraktComment
    >({
      method: HttpMethod.PUT,
      url: '/comments/:id',
      opts: {
        auth: true,
        emoji: true,
        parameters: {
          path: {
            id: true,
          },
        },
      },
      body: {
        /** Text for the comment. */
        comment: true,
        /** Is this a spoiler? Defaults to false */
        spoiler: false,
      },
    }),
    /**
     * 🔒 OAuth RequiredDelete a single comment. The OAuth user must match the author of the comment in order to delete it. If not, a 401 HTTP status code is returned.
     * The comment must also be less than 2 weeks old or have 0 replies. If not, a 409 HTTP status is returned.
     *
     * @auth required
     *
     * @see [delete-a-comment-or-reply]{@link https://trakt.docs.apiary.io/#reference/comments/comment/delete-a-comment-or-reply}
     */
    remove: new TraktClientEndpoint<{
      /** A specific comment ID. */
      id: number;
    }>({
      method: HttpMethod.DELETE,
      url: '/comments/:id',
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
     * Returns all replies for a comment.
     * It is possible these replies could have replies themselves, so in that case you would just call [/comments/:id/replies]{@link https://trakt.docs.apiary.io/reference/comments/replies/} again with the new comment id.
     *
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     * @pagination true - {@link TraktApiPagination}
     *
     * @see [get-replies-for-a-comment]{@link https://trakt.docs.apiary.io/#reference/comments/replies/get-replies-for-a-comment}
     */
    replies: {
      get: new TraktClientEndpoint<
        {
          /** A specific comment ID. */
          id: number;
        } & TraktApiParamsPagination,
        TraktComment[]
      >({
        method: HttpMethod.GET,
        url: '/comments/:id/replies',
        opts: {
          emoji: true,
          pagination: true,
          parameters: {
            path: {
              id: true,
            },
          },
        },
      }),
      /**
       * Add a new reply to an existing comment. Make sure to allow and encourage spoilers to be indicated in your app and follow the rules listed above.
       *
       * @see [post-a-reply-for-a-comment]{@link https://trakt.docs.apiary.io/#reference/comments/comment/post-a-reply-for-a-comment}
       */
      add: new TraktClientEndpoint<
        {
          /** A specific comment ID. */
          id: number;
          /** Text for the comment. */
          comment: string;
          /** Is this a spoiler? Defaults to false */
          spoiler?: boolean;
        },
        TraktComment
      >({
        method: HttpMethod.POST,
        url: '/comments/:id/replies',
        opts: {
          auth: true,
          emoji: true,
          parameters: {
            path: {
              id: true,
            },
          },
        },
        body: {
          comment: true,
          spoiler: false,
        },
      }),
    },
    /**
     * Returns the media item this comment is attached to. The media type can be movie, show, season, episode, or list and it also returns the standard media object for that media type.
     *
     * @extended true - {@link TraktApiExtended.Full}
     *
     * @see [get-the-attached-media-item]{@link https://trakt.docs.apiary.io/#reference/comments/replies/get-the-attached-media-item}
     */
    item: new TraktClientEndpoint<
      {
        /** A specific comment ID. */
        id: number;
      } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
      TraktCommentMedia
    >({
      method: HttpMethod.GET,
      url: '/comments/:id/item',
      opts: {
        extended: [TraktApiExtended.Full],
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
    /**
     * Returns all users who liked a comment. If you only need the replies count, the main comment object already has that, so no need to use this method.
     *
     * @pagination true - {@link TraktApiPagination}
     *
     * @see [get-all-users-who-liked-a-comment]{@link https://trakt.docs.apiary.io/#reference/comments/likes/get-all-users-who-liked-a-comment}
     */
    likes: new TraktClientEndpoint<
      {
        /** A specific comment ID. */
        id: number;
      } & TraktApiParamsPagination,
      TraktLike[]
    >({
      method: HttpMethod.GET,
      url: '/comments/:id/likes',
      opts: {
        pagination: true,
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
    /**
     * Votes help determine popular comments. Only one like is allowed per comment per user.
     *
     * @auth required
     *
     * @see [like-a-comment]{@link https://trakt.docs.apiary.io/#reference/comments/replies/like-a-comment}
     */
    like: {
      add: new TraktClientEndpoint<{
        /** A specific comment ID. */
        id: number;
      }>({
        method: HttpMethod.POST,
        url: '/comments/:id/like',
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
       * Remove a like on a comment.
       *
       * @auth required
       *
       * @see [remove-like-on-a-comment]{@link https://trakt.docs.apiary.io/#reference/comments/like/remove-like-on-a-comment}
       */
      remove: new TraktClientEndpoint<{
        /** A specific comment ID. */
        id: number;
      }>({
        method: HttpMethod.DELETE,
        url: '/comments/:id/like',
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
     * Returns all comments with the most likes and replies over the last 7 days.
     * You can optionally filter by the comment_type and media type to limit what gets returned.
     * If you want to include_replies that will return replies in place alongside top level comments.
     *
     * @extended true - {@link TraktApiExtended.Full}
     * @pagination true - {@link TraktApiPagination}
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     *
     * @see [get-trending-comments]{@link https://trakt.docs.apiary.io/#reference/comments/trending/get-trending-comments}
     */
    trending: new TraktClientEndpoint<
      {
        /** The type of the comment: all, reviews or shouts */
        comment_type?: 'all' | 'reviews' | 'shouts';
        /** The type of entity: all, movies , shows, seasons, episodes or lists */
        type?: 'all' | 'movies' | 'shows' | 'seasons' | 'episodes' | 'lists';
        /** To include comment replies or not. */
        include_replies?: boolean;
      } & TraktApiParamsPagination &
        TraktApiParamsExtended<typeof TraktApiExtended.Full>,
      TraktCommentItem[]
    >({
      method: HttpMethod.GET,
      url: '/comments/trending/:comment_type/:type?include_replies=false',
      opts: {
        emoji: true,
        pagination: true,
        extended: [TraktApiExtended.Full],
        parameters: {
          path: {
            comment_type: false,
            type: false,
          },
          query: {
            include_replies: false,
          },
        },
      },
    }),
    /**
     * Returns the most recently written comments across all of Trakt.
     * You can optionally filter by the comment_type and media type to limit what gets returned.
     * If you want to include_replies that will return replies in place alongside top level comments.
     *
     * @extended true - {@link TraktApiExtended.Full}
     * @pagination true - {@link TraktApiPagination}
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     *
     * @see [get-recently-created-comments]{@link https://trakt.docs.apiary.io/#reference/comments/recent/get-recently-created-comments}
     */
    recent: new TraktClientEndpoint<
      {
        /** The type of the comment: all, reviews or shouts */
        comment_type?: 'all' | 'reviews' | 'shouts';
        /** The type of entity: all, movies , shows, seasons, episodes or lists */
        type?: 'all' | 'movies' | 'shows' | 'seasons' | 'episodes' | 'lists';
        /** To include comment replies or not. */
        include_replies?: boolean;
      } & TraktApiParamsPagination &
        TraktApiParamsExtended<typeof TraktApiExtended.Full>,
      TraktCommentItem[]
    >({
      method: HttpMethod.GET,
      url: '/comments/recent/:comment_type/:type?include_replies=false',
      opts: {
        emoji: true,
        pagination: true,
        extended: [TraktApiExtended.Full],
        parameters: {
          path: {
            comment_type: false,
            type: false,
          },
          query: {
            include_replies: false,
          },
        },
      },
    }),
    /**
     * Returns the most recently updated comments across all of Trakt.
     * You can optionally filter by the comment_type and media type to limit what gets returned.
     * If you want to include_replies that will return replies in place alongside top level comments.
     *
     * @extended true - {@link TraktApiExtended.Full}
     * @pagination true - {@link TraktApiPagination}
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     *
     * @see [get-recently-updated-comments]{@link https://trakt.docs.apiary.io/#reference/comments/updates/get-recently-updated-comments}
     */
    updates: new TraktClientEndpoint<
      {
        /** The type of the comment: all, reviews or shouts */
        comment_type?: 'all' | 'reviews' | 'shouts';
        /** The type of entity: all, movies , shows, seasons, episodes or lists */
        type?: 'all' | 'movies' | 'shows' | 'seasons' | 'episodes' | 'lists';
        /** To include comment replies or not. */
        include_replies?: boolean;
      } & TraktApiParamsPagination &
        TraktApiParamsExtended<typeof TraktApiExtended.Full>,
      TraktCommentItem[]
    >({
      method: HttpMethod.GET,
      url: '/comments/updates/:comment_type/:type?include_replies=false',
      opts: {
        emoji: true,
        pagination: true,
        extended: [TraktApiExtended.Full],
        parameters: {
          path: {
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
};

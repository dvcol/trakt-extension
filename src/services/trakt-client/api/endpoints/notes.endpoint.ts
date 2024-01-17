import type { TraktNote, TraktNoteItem, TraktNoteRequest } from '~/models/trakt-note.model';

import { TraktApiExtended, type TraktApiParamsExtended, TraktClientEndpoint } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

/**
 * Notes (500 maximum characters) attached to any movie, show, season, episode, or person and are only visible to the user who created them.
 * They are also set to private and can't be marked as a spoiler. Notes attached to any history, collection, or rating can have their privacy and spoiler set.
 *
 * <b>Possible Error Responses</b>
 *
 * * 401	-	Invalid user
 * * 404	-	Item not found or doesn't allow notes
 * * 409	-	Note can't be deleted
 * * 422	-	Validation errors
 *
 * @see [notes](https://trakt.docs.apiary.io/#reference/notes)
 */
export const notes = {
  /**
   * Notes (500 maximum characters) added to a movie, show, season, episode, or person will automatically be set to private. You can send just the media item.
   *
   * Notes (500 maximum characters) added to a history, collection, or rating can have their privacy and spoiler set. You need to send the attached_to object so we know where to attach the note.
   *
   * @vip required - [Requires a paid VIP subscription]{@link https://trakt.docs.apiary.io/#introduction/vip-methods}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   * @auth required
   */
  add: new TraktClientEndpoint<TraktNoteRequest, TraktNote>({
    method: HttpMethod.POST,
    url: '/notes',
    opts: {
      auth: true,
      vip: true,
      emoji: true,
    },
    body: {
      note: true,

      spoiler: false,
      privacy: false,

      movie: false,
      show: false,
      season: false,
      episode: false,
      person: false,
      history: false,
      collection: false,
      rating: false,
    },
  }),
  /**
   * Returns a single note.
   *
   * @vip required - [Requires a paid VIP subscription]{@link https://trakt.docs.apiary.io/#introduction/vip-methods}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   * @auth required
   *
   * @see [get-a-note]{@link https://trakt.docs.apiary.io/#reference/notes/note/get-a-note}
   */
  get: new TraktClientEndpoint<
    {
      /** A specific note ID */
      id: number;
    },
    TraktNote
  >({
    method: HttpMethod.GET,
    url: '/notes/:id',
    opts: {
      auth: true,
      vip: true,
      emoji: true,
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Update a single note (500 maximum characters). The OAuth user must match the author of the note in order to update it. If not, a 401 HTTP status is returned.
   *
   * @vip required - [Requires a paid VIP subscription]{@link https://trakt.docs.apiary.io/#introduction/vip-methods}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   * @auth required
   *
   * @see [update-a-note]{@link https://trakt.docs.apiary.io/#reference/notes/note/update-a-note}
   */
  update: new TraktClientEndpoint<
    {
      /** A specific note ID */
      id: number;
    },
    TraktNote
  >({
    method: HttpMethod.PUT,
    url: '/notes/:id',
    opts: {
      auth: true,
      vip: true,
      emoji: true,
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Delete a single note. The OAuth user must match the author of the comment in order to delete it. If not, a 401 HTTP status code is returned.
   *
   * @vip required - [Requires a paid VIP subscription]{@link https://trakt.docs.apiary.io/#introduction/vip-methods}
   * @auth required
   *
   * @see [delete-a-note]{@link https://trakt.docs.apiary.io/#reference/notes/note/delete-a-note}
   */
  delete: new TraktClientEndpoint<{
    /** A specific note ID */
    id: number;
  }>({
    method: HttpMethod.DELETE,
    url: '/notes/:id',
    opts: {
      auth: true,
      vip: true,
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns the item this note is attached_to.
   * Media items like movie, show, season, episode, or person are straightforward, but history will need to be mapped to that specific play in their watched history since they might have multiple plays.
   * Since collection and rating is a 1:1 association, you can assume the note is attached to the media item in the type field that has been collected or rated.
   *
   * @vip required - [Requires a paid VIP subscription]{@link https://trakt.docs.apiary.io/#introduction/vip-methods}
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-the-attached-item]{@link https://trakt.docs.apiary.io/#reference/notes/item/get-the-attached-item}
   */
  items: new TraktClientEndpoint<
    {
      /** A specific note ID */
      id: number;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktNoteItem
  >({
    method: HttpMethod.GET,
    url: '/notes/:id/item',
    opts: {
      vip: true,
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
};

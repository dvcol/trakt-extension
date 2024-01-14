import type { TraktScrobble, TraktScrobbleRequest } from '~/models/trakt-scrobble.model';

import { TraktClientEndpoint } from '~/models/trakt-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Scrobbling is an automatic way to track what a user is watching in a media center.
 * The media center should send events that correspond to starting, pausing, and stopping (or finishing) watching a movie or episode.
 */
export const scrobble = {
  /**
   * Use this method when the video initially starts playing or is unpaused. This will remove any playback progress if it exists.
   *
   * * <b>Note</b>
   * A watching status will auto expire after the remaining runtime has elapsed. There is no need to call this method again while continuing to watch the same item.
   *
   * @auth required
   *
   * @see [start-watching-in-a-media-center]{@link https://trakt.docs.apiary.io/#reference/scrobble/start/start-watching-in-a-media-center}
   */
  start: new TraktClientEndpoint<TraktScrobbleRequest, TraktScrobble<'start'>>({
    method: HttpMethod.POST,
    url: '/scrobble/start',
    opts: {
      auth: true,
    },
    body: {
      progress: true,

      movie: false,
      episode: false,
    },
  }),
  /**
   * Use this method when the video is paused. The playback progress will be saved and [/sync/playback]{@link https://trakt.docs.apiary.io/reference/sync/playback/} can be used to resume the video from this exact position.
   * Unpause a video by calling the [/scrobble/start]{@link https://trakt.docs.apiary.io/reference/scrobble/start/} method again.
   *
   * @auth required
   *
   * @see [pause-watching-in-a-media-center]{@link https://trakt.docs.apiary.io/#reference/scrobble/pause/pause-watching-in-a-media-center}
   */
  pause: new TraktClientEndpoint<TraktScrobbleRequest, TraktScrobble<'pause'>>({
    method: HttpMethod.POST,
    url: '/scrobble/pause',
    opts: {
      auth: true,
    },
    body: {
      progress: true,

      movie: false,
      episode: false,
    },
  }),
  /**
   * Use this method when the video is stopped or finishes playing on its own. If the progress is above 80%, the video will be scrobbled and the action will be set to scrobble.
   * A unique history id (64-bit integer) will be returned and can be used to reference this scrobble directly.
   *
   * If the progress is less than 80%, it will be treated as a pause and the action will be set to pause.
   * The playback progress will be saved and [/sync/playback]{@link https://trakt.docs.apiary.io/reference/sync/playback/} can be used to resume the video from this exact position.
   *
   * * <b>Note</b>
   * If you prefer to use a threshold higher than 80%, you should use [/scrobble/pause]{@link https://trakt.docs.apiary.io/reference/scrobble/pause/} yourself so it doesn't create duplicate scrobbles.
   *
   * * <b>Note</b>
   * If the same item was just scrobbled, a 409 HTTP status code will returned to avoid scrobbling a duplicate.
   * The response will contain a watched_at timestamp when the item was last scrobbled and a expires_at timestamp when the item can be scrobbled again.
   *
   *
   * @throws TraktScrobbleError
   *
   * @auth required
   *
   * @see [stop-or-finish-watching-in-a-media-center]{@link https://trakt.docs.apiary.io/#reference/scrobble/stop/stop-or-finish-watching-in-a-media-center}
   */
  stop: new TraktClientEndpoint<TraktScrobbleRequest, TraktScrobble<'stop'>>({
    method: HttpMethod.POST,
    url: '/scrobble/stop',
    opts: {
      auth: true,
    },
    body: {
      progress: true,

      movie: false,
      episode: false,
    },
  }),
};

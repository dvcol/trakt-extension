import { TraktClientEndpoint } from '~/models/trakt-client.model';
import { calendars } from '~/services/trakt-client/api/endpoints/calendar.endpoint';
import { checkin } from '~/services/trakt-client/api/endpoints/checkin.endpoint';
import { comments } from '~/services/trakt-client/api/endpoints/comments.endpoint';
import { HttpMethod } from '~/utils/http.utils';

// TODO: add filter, required and jsdoc

export const traktApi = {
  calendars,
  checkin,
  /**
   * Most TV shows and movies have a certification to indicate the content rating. Some API methods allow filtering by certification, so it's good to cache this list in your app.
   *
   * note: Only us certifications are currently returned.
   *
   * @see {@link https://trakt.docs.apiary.io/#reference/certifications/list/get-certifications}
   */
  certifications: new TraktClientEndpoint<{
    /** Certification type : shows or movies */
    type: 'movies' | 'shows';
  }>({
    method: HttpMethod.GET,
    url: '/certifications/:type',
    opts: {
      parameters: {
        path: {
          type: true,
        },
      },
    },
  }),
  comments,
  // lists,
  // movies,
  // people,
  // recommendations,
  // scrobble,
  // search,
  // shows,
  // seasons,
  // episodes,
  // sync,
  // users,
  // genres: {
  //   opts: {},
  //   method: HttpMethod.GET,
  //   url: '/genres/:type',
  //   optional: [],
  //   call,
  // },
  // networks: {
  //   opts: {},
  //   method: HttpMethod.GET,
  //   url: '/networks',
  //   optional: [],
  //   call,
  // },
  // languages: {
  //   opts: {},
  //   method: HttpMethod.GET,
  //   url: '/languages/:type',
  //   optional: [],
  //   call,
  // },
  // countries: {
  //   opts: {},
  //   method: HttpMethod.GET,
  //   url: '/countries/:type',
  //   optional: [],
  //   call,
  // },
};

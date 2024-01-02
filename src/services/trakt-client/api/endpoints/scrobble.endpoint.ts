import type { ITraktApi } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

export const scrobble = {
  start: {
    opts: {
      auth: true,
    },
    method: HttpMethod.POST,
    url: '/scrobble/start',
    body: {
      movie: null,
      episode: null,
      progress: null,
      app_version: null,
      app_date: null,
    },
    optional: [],
    call,
  },
  pause: {
    opts: {
      auth: true,
    },
    method: HttpMethod.POST,
    url: '/scrobble/pause',
    body: {
      movie: null,
      episode: null,
      progress: null,
      app_version: null,
      app_date: null,
    },
    optional: [],
    call,
  },
  stop: {
    opts: {
      auth: true,
    },
    method: HttpMethod.POST,
    url: '/scrobble/stop',
    body: {
      movie: null,
      episode: null,
      progress: null,
      app_version: null,
      app_date: null,
    },
    optional: [],
    call,
  },
} satisfies ITraktApi;

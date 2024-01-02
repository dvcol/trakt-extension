import type { ITraktApi } from '~/models/trakt-client.model';

import { calendars } from '~/services/trakt-client/api/endpoints/calendar.endpoint';
import { HttpMethod } from '~/utils/http.utils';

// TODO: add filter, required and jsdoc

export const traktApi = {
  calendars,
  checkin,
  comments,
  lists,
  movies,
  people,
  recommendations,
  scrobble,
  search,
  shows,
  seasons,
  episodes,
  sync,
  users,
  genres: {
    opts: {},
    method: HttpMethod.GET,
    url: '/genres/:type',
    optional: [],
    call,
  },
  networks: {
    opts: {},
    method: HttpMethod.GET,
    url: '/networks',
    optional: [],
    call,
  },
  languages: {
    opts: {},
    method: HttpMethod.GET,
    url: '/languages/:type',
    optional: [],
    call,
  },
  countries: {
    opts: {},
    method: HttpMethod.GET,
    url: '/countries/:type',
    optional: [],
    call,
  },
  certifications: {
    opts: {},
    method: HttpMethod.GET,
    url: '/certifications/:type',
    optional: [],
    call,
  },
} satisfies ITraktApi;

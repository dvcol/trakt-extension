import type { ITraktApi, TraktApiParams } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

const call = (param: TraktApiParams) => {
  console.error('Endpoint call function not implemented', param);
  throw new Error('Endpoint call function not implemented');
};

const calendars = {
  my: {
    shows: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/my/shows/:start_date/:days',
      optional: ['start_date', 'days'],
      call,
    },
    new_shows: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/my/shows/new/:start_date/:days',
      optional: ['start_date', 'days'],
      call,
    },
    premieres_shows: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/my/shows/premieres/:start_date/:days',
      optional: ['start_date', 'days'],
      call,
    },
    movies: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/my/movies/:start_date/:days',
      optional: ['start_date', 'days'],
      call,
    },
    dvd: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/my/dvd/:start_date/:days',
      optional: ['start_date', 'days'],
      call,
    },
  },
  all: {
    shows: {
      opts: {
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/all/shows/:start_date/:days',
      optional: ['start_date', 'days'],
      call,
    },
    new_shows: {
      opts: {
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/all/shows/new/:start_date/:days',
      optional: ['start_date', 'days'],
      call,
    },
    premieres_shows: {
      opts: {
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/all/shows/premieres/:start_date/:days',
      optional: ['start_date', 'days'],
      call,
    },
    movies: {
      opts: {
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/all/movies/:start_date/:days',
      optional: ['start_date', 'days'],
      call,
    },
    dvd: {
      opts: {
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/all/dvd/:start_date/:days',
      optional: ['start_date', 'days'],
      call,
    },
  },
} satisfies ITraktApi;

const checkin = {
  add: {
    opts: {
      auth: true,
    },
    method: HttpMethod.POST,
    url: '/checkin',
    body: {
      movie: null,
      episode: null,
      sharing: null,
      message: null,
      venue_id: null,
      venue_name: null,
      app_version: null,
      app_date: null,
    },
    optional: [],
    call,
  },
  delete: {
    opts: {
      auth: true,
    },
    method: HttpMethod.DELETE,
    url: '/checkin',
    optional: [],
    call,
  },
} satisfies ITraktApi;

const comments = {
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

const lists = {
  trending: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/lists/trending',
    optional: [],
    call,
  },
  popular: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/lists/popular',
    optional: [],
    call,
  },
  get: {
    opts: {},
    method: HttpMethod.GET,
    url: '/lists/:id',
    optional: [],
    call,
  },
  likes: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/lists/:id/likes',
    optional: [],
    call,
  },
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

const movies = {
  trending: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/trending',
    optional: [],
    call,
  },
  popular: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/popular',
    optional: [],
    call,
  },
  recommended: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/recommended/:period',
    optional: ['period'],
    call,
  },
  played: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/played/:period',
    optional: ['period'],
    call,
  },
  watched: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/watched/:period',
    optional: ['period'],
    call,
  },
  collected: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/collected/:period',
    optional: ['period'],
    call,
  },
  anticipated: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/anticipated',
    optional: [],
    call,
  },
  boxoffice: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/boxoffice',
    optional: [],
    call,
  },
  updates: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/updates/:start_date',
    optional: ['start_date'],
    call,
  },
  updated_ids: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/movies/updates/id/:start_date',
    optional: ['start_date'],
    call,
  },
  summary: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/:id',
    optional: [],
    call,
  },
  aliases: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/aliases',
    optional: [],
    call,
  },
  releases: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/releases/:country',
    optional: ['country'],
    call,
  },
  translations: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/translations/:language',
    optional: ['language'],
    call,
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/movies/:id/comments/:sort',
    optional: ['sort'],
    call,
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/movies/:id/lists/:type/:sort',
    optional: ['type', 'sort'],
    call,
  },
  people: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/:id/people',
    optional: [],
    call,
  },
  ratings: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/ratings',
    optional: [],
    call,
  },
  related: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/:id/related?limit=',
    optional: ['limit'],
    call,
  },
  stats: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/stats',
    optional: [],
    call,
  },
  studios: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/studios',
    optional: [],
    call,
  },
  watching: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/:id/watching',
    optional: [],
    call,
  },
} satisfies ITraktApi;

const people = {
  summary: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/people/:id',
    optional: [],
    call,
  },
  movies: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/people/:id/movies',
    optional: [],
    call,
  },
  shows: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/people/:id/shows',
    optional: [],
    call,
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/people/:id/lists/:type/:sort',
    optional: ['type', 'sort'],
    call,
  },
  updates: {
    get: {
      opts: {
        pagination: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/people/updates/:start_date?limit=',
      optional: ['limit'],
      call,
    },
    id: {
      opts: {
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/people/updates/id/:start_date?limit=',
      optional: ['limit'],
      call,
    },
  },
} satisfies ITraktApi;

const recommendations = {
  movies: {
    get: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/recommendations/movies/?limit=&ignore_collected=',
      optional: ['limit', 'ignore_collected'],
      call,
    },
    hide: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/recommendations/movies/:id',
      optional: [],
      call,
    },
  },
  shows: {
    get: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/recommendations/shows/?limit=&ignore_collected=',
      optional: ['limit', 'ignore_collected'],
      call,
    },
    hide: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/recommendations/shows/:id',
      optional: [],
      call,
    },
  },
} satisfies ITraktApi;

const scrobble = {
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

const search = {
  text: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/search/:type?query=&fields=',
    optional: ['fields'],
    call,
  },
  id: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/search/:id_type/:id?type=&fields=',
    optional: ['type', 'fields'],
    call,
  },
} satisfies ITraktApi;

const shows = {
  trending: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/trending',
    optional: [],
    call,
  },
  popular: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/popular',
    optional: [],
    call,
  },
  recommended: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/recommended/:period',
    optional: ['period'],
    call,
  },
  played: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/played/:period',
    optional: ['period'],
    call,
  },
  watched: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/watched/:period',
    optional: ['period'],
    call,
  },
  collected: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/collected',
    optional: ['period'],
    call,
  },
  anticipated: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/anticipated',
    optional: [],
    call,
  },
  updates: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/updates/:start_date',
    optional: ['start_date'],
    call,
  },
  updated_ids: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/updates/id/:start_date',
    optional: ['start_date'],
    call,
  },
  summary: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id',
    optional: [],
    call,
  },
  aliases: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/aliases',
    optional: [],
    call,
  },
  certifications: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/certifications',
    optional: [],
    call,
  },
  translations: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/translations/:language',
    optional: ['language'],
    call,
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/comments/:sort',
    optional: ['sort'],
    call,
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/lists/:type/:sort',
    optional: ['type', 'sort'],
    call,
  },
  progress: {
    collection: {
      opts: {
        auth: true,
      },
      method: HttpMethod.GET,
      url: '/shows/:id/progress/collection?hidden=&specials=&count_specials=&last_activity=',
      optional: ['hidden', 'specials', 'count_specials', 'last_activity'],
      call,
    },
    watched: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/shows/:id/progress/watched?hidden=&specials=&count_specials=&last_activity=',
      optional: ['hidden', 'specials', 'count_specials', 'last_activity'],
      call,
    },
    reset: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/shows/:id/progress/watched/reset',
      optional: [],
      call,
    },
    undo_reset: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/shows/:id/progress/watched/reset',
      optional: [],
      call,
    },
  },
  people: {
    opts: {
      extended: ['full', 'guest_stars'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/people',
    optional: [],
    call,
  },
  ratings: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/ratings',
    optional: [],
    call,
  },
  related: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/related',
    optional: [],
    call,
  },
  stats: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/stats',
    optional: [],
    call,
  },
  studios: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/studios',
    optional: [],
    call,
  },
  watching: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/watching',
    optional: [],
    call,
  },
  next_episode: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/next_episode',
    optional: [],
    call,
  },
  last_episode: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/last_episode',
    optional: [],
    call,
  },
} satisfies ITraktApi;

const seasons = {
  summary: {
    opts: {
      extended: ['full', 'episodes'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons',
    optional: [],
    call,
  },
  season: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season?translations=',
    optional: ['translations'],
    call,
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/comments/:sort',
    optional: ['sort'],
    call,
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/lists/:type/:sort',
    optional: ['type', 'sort'],
    call,
  },
  people: {
    opts: {
      extended: ['guest_stars'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/people',
    optional: [],
    call,
  },
  ratings: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/ratings',
    optional: [],
    call,
  },
  stats: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/stats',
    optional: [],
    call,
  },
  watching: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/watching',
    optional: [],
    call,
  },
} satisfies ITraktApi;

const episodes = {
  summary: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode',
    optional: [],
    call,
  },
  translations: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/translations/:language',
    optional: ['language'],
    call,
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/comments/:sort',
    optional: ['sort'],
    call,
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/lists/:type/:sort',
    optional: ['type', 'sort'],
    call,
  },
  people: {
    opts: {
      extended: ['guest_stars'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/people',
    optional: [],
    call,
  },
  ratings: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/ratings',
    optional: [],
    call,
  },
  stats: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/stats',
    optional: [],
    call,
  },
  watching: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/watching',
    optional: [],
    call,
  },
} satisfies ITraktApi;

const sync = {
  last_activities: {
    opts: {
      auth: true,
    },
    method: HttpMethod.GET,
    url: '/sync/last_activities',
    optional: [],
    call,
  },
  playback: {
    get: {
      opts: {
        auth: true,
      },
      method: HttpMethod.GET,
      url: '/sync/playback/:type?limit=',
      optional: ['type', 'limit'],
      call,
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/sync/playback/:id',
      optional: [],
      call,
    },
  },
  collection: {
    get: {
      opts: {
        auth: true,
        extended: ['full', 'metadata'],
      },
      method: HttpMethod.GET,
      url: '/sync/collection/:type',
      optional: [],
      call,
    },
    add: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/sync/collection',
      body: {
        movies: null,
        shows: null,
        seasons: null,
        episodes: null,
      },
      optional: [],
      call,
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/sync/collection/remove',
      body: {
        movies: null,
        shows: null,
        seasons: null,
        episodes: null,
      },
      optional: [],
      call,
    },
  },
  watched: {
    opts: {
      auth: true,
      extended: ['full', 'noseasons'],
    },
    method: HttpMethod.GET,
    url: '/sync/watched/:type',
    optional: [],
    call,
  },
  history: {
    get: {
      opts: {
        auth: true,
        pagination: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/sync/history/:type/:id?start_at=&end_at=',
      optional: ['type', 'id', 'start_at', 'end_at'],
      call,
    },
    add: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/sync/history',
      body: {
        movies: null,
        shows: null,
        seasons: null,
        episodes: null,
      },
      optional: [],
      call,
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/sync/history/remove',
      body: {
        movies: null,
        shows: null,
        episodes: null,
        ids: null,
      },
      optional: [],
      call,
    },
  },
  ratings: {
    get: {
      opts: {
        auth: true,
        pagination: 'optional',
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/sync/ratings/:type/:rating',
      optional: ['rating', 'type'],
      call,
    },
    add: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/sync/ratings',
      body: {
        movies: null,
        shows: null,
        seasons: null,
        episodes: null,
      },
      optional: [],
      call,
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/sync/ratings/remove',
      body: {
        movies: null,
        shows: null,
        episodes: null,
      },
      optional: [],
      call,
    },
    watchlist: {
      get: {
        opts: {
          auth: true,
          pagination: 'optional',
          extended: ['full'],
        },
        method: HttpMethod.GET,
        url: '/sync/watchlist/:type',
        optional: ['type'],
        call,
      },
      add: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/sync/watchlist',
        body: {
          movies: null,
          shows: null,
          episodes: null,
        },
        optional: [],
        call,
      },
      remove: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/sync/watchlist/remove',
        body: {
          movies: null,
          shows: null,
          episodes: null,
        },
        optional: [],
        call,
      },
      reorder: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/sync/watchlist/reorder',
        body: {
          rank: null,
        },
        optional: [],
        call,
      },
    },
    recommendations: {
      get: {
        opts: {
          auth: true,
          pagination: 'optional',
          extended: ['full'],
        },
        method: HttpMethod.GET,
        url: '/sync/recommendations/:type/:sort',
        optional: [],
        call,
      },
      add: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/sync/recommendations',
        body: {
          movies: null,
          shows: null,
        },
        optional: [],
        call,
      },
      remove: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/sync/recommendations/remove',
        body: {
          movies: null,
          shows: null,
        },
        optional: [],
        call,
      },
      reorder: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/sync/recommendations/reorder',
        body: {
          rank: null,
        },
        optional: [],
        call,
      },
    },
  },
} satisfies ITraktApi;

const users = {
  settings: {
    opts: {
      auth: true,
    },
    method: HttpMethod.GET,
    url: '/users/settings',
    optional: [],
    call,
  },
  requests: {
    get: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/users/requests',
      optional: [],
      call,
    },
    following: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/users/requests/following',
      optional: [],
      call,
    },
    approve: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/users/requests/:id',
      optional: [],
      call,
    },
    deny: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/users/requests/:id',
      optional: [],
      call,
    },
    hidden: {
      get: {
        opts: {
          auth: true,
          pagination: true,
          extended: ['full'],
        },
        method: HttpMethod.GET,
        url: '/users/hidden/:section?type=',
        optional: ['type'],
        call,
      },
      add: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/users/hidden/:section',
        body: {
          movies: null,
          shows: null,
          episodes: null,
        },
        optional: [],
        call,
      },
      remove: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/users/hidden/:section/remove',
        body: {
          movies: null,
          shows: null,
          episodes: null,
        },
        optional: [],
        call,
      },
    },
    likes: {
      opts: {
        auth: 'optional',
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/users/:username/likes/:type',
      optional: ['type'],
      call,
    },
    saved_filters: {
      opts: {
        auth: true,
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/users/saved_filters/:section',
      optional: [],
      call,
    },
    profile: {
      opts: {
        auth: 'optional',
        extended: ['full', 'vip'],
      },
      method: HttpMethod.GET,
      url: '/users/:username',
      optional: [],
      call,
    },
    collection: {
      opts: {
        auth: 'optional',
        extended: ['full', 'metadata'],
      },
      method: HttpMethod.GET,
      url: '/users/:username/collection/:type',
      optional: [],
      call,
    },
    comments: {
      opts: {
        auth: 'optional',
        pagination: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/users/:username/comments/:comment_type/:type?include_replies=',
      optional: ['comment_type', 'type', 'include_replies'],
      call,
    },
  },
  lists: {
    get: {
      opts: {
        auth: 'optional',
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists',
      optional: [],
      call,
    },
    collaborations: {
      opts: {
        auth: 'optional',
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists/collaborations',
      optional: [],
      call,
    },
    create: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/users/:username/lists',
      body: {
        name: null,
        description: null,
        privacy: null,
        display_numbers: null,
        allow_comments: null,
      },
      optional: [],
      call,
    },
    reorder: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/users/:username/lists/reorder',
      body: {
        rank: null,
      },
      optional: [],
      call,
    },
  },
  list: {
    get: {
      opts: {
        auth: 'optional',
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists/:id',
      optional: [],
      call,
    },
    update: {
      opts: {
        auth: true,
      },
      method: HttpMethod.PUT,
      url: '/users/:username/lists/:id',
      body: {
        name: null,
        description: null,
        privacy: null,
        display_numbers: null,
        allow_comments: null,
      },
      optional: [],
      call,
    },
    delete: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/users/:username/lists/:id',
      optional: [],
      call,
    },
    likes: {
      opts: {
        auth: 'optional',
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists/:id/likes',
      optional: [],
      call,
    },
    like: {
      add: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/users/:username/lists/:id/like',
        optional: [],
        call,
      },
      remove: {
        opts: {
          auth: true,
        },
        method: HttpMethod.DELETE,
        url: '/users/:username/lists/:id/like',
        optional: [],
        call,
      },
    },
    items: {
      get: {
        opts: {
          auth: 'optional',
          pagination: 'optional',
          extended: ['full'],
        },
        method: HttpMethod.GET,
        url: '/users/:username/lists/:id/items?type=',
        optional: ['type'],
        call,
      },
      add: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/users/:username/lists/:id/items',
        body: {
          movies: null,
          shows: null,
          people: null,
        },
        optional: [],
        call,
      },
      remove: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/users/:username/lists/:id/items/remove',
        body: {
          movies: null,
          shows: null,
          people: null,
        },
        optional: [],
        call,
      },
      reorder: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/users/:username/lists/:id/items/reorder',
        body: {
          rank: null,
        },
        optional: [],
        call,
      },
    },
    comments: {
      opts: {
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists/:id/comments/:sort',
      optional: ['sort'],
      call,
    },
  },
  follow: {
    add: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/users/:username/follow',
      optional: [],
      call,
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/users/:username/follow',
      optional: [],
      call,
    },
  },
  followers: {
    opts: {
      auth: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/followers',
    optional: [],
    call,
  },
  following: {
    opts: {
      auth: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/following',
    optional: [],
    call,
  },
  friends: {
    opts: {
      auth: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/friends',
    optional: [],
    call,
  },
  history: {
    opts: {
      auth: 'optional',
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/history/:type/:item_id?start_at=&end_at=',
    optional: ['type', 'item_id', 'start_at', 'end_at'],
    call,
  },
  ratings: {
    opts: {
      auth: 'optional',
      pagination: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/ratings/:type/:rating',
    optional: ['rating', 'type'],
    call,
  },
  watchlist: {
    opts: {
      auth: 'optional',
      pagination: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/watchlist/:type',
    optional: ['type'],
    call,
  },
  recommendations: {
    opts: {
      auth: true,
      pagination: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/recommendations/:type/:sort',
    optional: ['type', 'sort'],
    call,
  },
  watching: {
    opts: {
      auth: 'optional',
    },
    method: HttpMethod.GET,
    url: '/users/:username/watching',
    optional: [],
    call,
  },
  watched: {
    opts: {
      auth: 'optional',
      extended: ['full', 'noseasons'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/watched/:type',
    optional: [],
    call,
  },
  stats: {
    opts: {
      auth: 'optional',
    },
    method: HttpMethod.GET,
    url: '/users/:username/stats',
    optional: [],
    call,
  },
} satisfies ITraktApi;

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

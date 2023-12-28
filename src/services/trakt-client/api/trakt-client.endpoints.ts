import type { ITraktApi } from '~/models/trakt-client.model';

import { HttpMethod } from '~/utils/http.utils';

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
    },
    new_shows: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/my/shows/new/:start_date/:days',
      optional: ['start_date', 'days'],
    },
    premieres_shows: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/my/shows/premieres/:start_date/:days',
      optional: ['start_date', 'days'],
    },
    movies: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/my/movies/:start_date/:days',
      optional: ['start_date', 'days'],
    },
    dvd: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/my/dvd/:start_date/:days',
      optional: ['start_date', 'days'],
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
    },
    new_shows: {
      opts: {
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/all/shows/new/:start_date/:days',
      optional: ['start_date', 'days'],
    },
    premieres_shows: {
      opts: {
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/all/shows/premieres/:start_date/:days',
      optional: ['start_date', 'days'],
    },
    movies: {
      opts: {
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/all/movies/:start_date/:days',
      optional: ['start_date', 'days'],
    },
    dvd: {
      opts: {
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/calendars/all/dvd/:start_date/:days',
      optional: ['start_date', 'days'],
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
  },
  delete: {
    opts: {
      auth: true,
    },
    method: HttpMethod.DELETE,
    url: '/checkin',
    optional: [],
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
    },
    get: {
      opts: {},
      method: HttpMethod.GET,
      url: '/comments/:id',
      optional: [],
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
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/comments/:id',
      optional: [],
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
    },
  },
  item: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/comments/:id/item',
    optional: [],
  },
  likes: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/comments/:id/likes',
    optional: [],
  },
  like: {
    add: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/comments/:id/like',
      optional: [],
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/comments/:id/like',
      optional: [],
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
  },
  recent: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/comments/recent/:comment_type/:type?include_replies=',
    optional: ['comment_type', 'type', 'include_replies'],
  },
  updates: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/comments/updates/:comment_type/:type?include_replies=',
    optional: ['comment_type', 'type', 'include_replies'],
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
  },
  popular: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/lists/popular',
    optional: [],
  },
  get: {
    opts: {},
    method: HttpMethod.GET,
    url: '/lists/:id',
    optional: [],
  },
  likes: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/lists/:id/likes',
    optional: [],
  },
  items: {
    opts: {
      pagination: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/lists/:id/items/:type',
    optional: [],
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/lists/:id/comments/:sort',
    optional: ['sort'],
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
  },
  popular: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/popular',
    optional: [],
  },
  recommended: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/recommended/:period',
    optional: ['period'],
  },
  played: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/played/:period',
    optional: ['period'],
  },
  watched: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/watched/:period',
    optional: ['period'],
  },
  collected: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/collected/:period',
    optional: ['period'],
  },
  anticipated: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/anticipated',
    optional: [],
  },
  boxoffice: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/boxoffice',
    optional: [],
  },
  updates: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/updates/:start_date',
    optional: ['start_date'],
  },
  updated_ids: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/movies/updates/id/:start_date',
    optional: ['start_date'],
  },
  summary: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/:id',
    optional: [],
  },
  aliases: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/aliases',
    optional: [],
  },
  releases: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/releases/:country',
    optional: ['country'],
  },
  translations: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/translations/:language',
    optional: ['language'],
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/movies/:id/comments/:sort',
    optional: ['sort'],
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/movies/:id/lists/:type/:sort',
    optional: ['type', 'sort'],
  },
  people: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/:id/people',
    optional: [],
  },
  ratings: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/ratings',
    optional: [],
  },
  related: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/:id/related?limit=',
    optional: ['limit'],
  },
  stats: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/stats',
    optional: [],
  },
  studios: {
    opts: {},
    method: HttpMethod.GET,
    url: '/movies/:id/studios',
    optional: [],
  },
  watching: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/movies/:id/watching',
    optional: [],
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
  },
  movies: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/people/:id/movies',
    optional: [],
  },
  shows: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/people/:id/shows',
    optional: [],
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/people/:id/lists/:type/:sort',
    optional: ['type', 'sort'],
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
    },
    id: {
      opts: {
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/people/updates/id/:start_date?limit=',
      optional: ['limit'],
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
    },
    hide: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/recommendations/movies/:id',
      optional: [],
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
    },
    hide: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/recommendations/shows/:id',
      optional: [],
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
  },
  id: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/search/:id_type/:id?type=&fields=',
    optional: ['type', 'fields'],
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
  },
  popular: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/popular',
    optional: [],
  },
  recommended: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/recommended/:period',
    optional: ['period'],
  },
  played: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/played/:period',
    optional: ['period'],
  },
  watched: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/watched/:period',
    optional: ['period'],
  },
  collected: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/collected',
    optional: ['period'],
  },
  anticipated: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/anticipated',
    optional: [],
  },
  updates: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/updates/:start_date',
    optional: ['start_date'],
  },
  updated_ids: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/updates/id/:start_date',
    optional: ['start_date'],
  },
  summary: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id',
    optional: [],
  },
  aliases: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/aliases',
    optional: [],
  },
  certifications: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/certifications',
    optional: [],
  },
  translations: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/translations/:language',
    optional: ['language'],
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/comments/:sort',
    optional: ['sort'],
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/lists/:type/:sort',
    optional: ['type', 'sort'],
  },
  progress: {
    collection: {
      opts: {
        auth: true,
      },
      method: HttpMethod.GET,
      url: '/shows/:id/progress/collection?hidden=&specials=&count_specials=&last_activity=',
      optional: ['hidden', 'specials', 'count_specials', 'last_activity'],
    },
    watched: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/shows/:id/progress/watched?hidden=&specials=&count_specials=&last_activity=',
      optional: ['hidden', 'specials', 'count_specials', 'last_activity'],
    },
    reset: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/shows/:id/progress/watched/reset',
      optional: [],
    },
    undo_reset: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/shows/:id/progress/watched/reset',
      optional: [],
    },
  },
  people: {
    opts: {
      extended: ['full', 'guest_stars'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/people',
    optional: [],
  },
  ratings: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/ratings',
    optional: [],
  },
  related: {
    opts: {
      pagination: true,
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/related',
    optional: [],
  },
  stats: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/stats',
    optional: [],
  },
  studios: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/studios',
    optional: [],
  },
  watching: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/watching',
    optional: [],
  },
  next_episode: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/next_episode',
    optional: [],
  },
  last_episode: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/last_episode',
    optional: [],
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
  },
  season: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season?translations=',
    optional: ['translations'],
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/comments/:sort',
    optional: ['sort'],
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/lists/:type/:sort',
    optional: ['type', 'sort'],
  },
  people: {
    opts: {
      extended: ['guest_stars'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/people',
    optional: [],
  },
  ratings: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/ratings',
    optional: [],
  },
  stats: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/stats',
    optional: [],
  },
  watching: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/watching',
    optional: [],
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
  },
  translations: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/translations/:language',
    optional: ['language'],
  },
  comments: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/comments/:sort',
    optional: ['sort'],
  },
  lists: {
    opts: {
      pagination: true,
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/lists/:type/:sort',
    optional: ['type', 'sort'],
  },
  people: {
    opts: {
      extended: ['guest_stars'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/people',
    optional: [],
  },
  ratings: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/ratings',
    optional: [],
  },
  stats: {
    opts: {},
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/stats',
    optional: [],
  },
  watching: {
    opts: {
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/watching',
    optional: [],
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
  },
  playback: {
    get: {
      opts: {
        auth: true,
      },
      method: HttpMethod.GET,
      url: '/sync/playback/:type?limit=',
      optional: ['type', 'limit'],
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/sync/playback/:id',
      optional: [],
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
    },
    following: {
      opts: {
        auth: true,
        extended: ['full'],
      },
      method: HttpMethod.GET,
      url: '/users/requests/following',
      optional: [],
    },
    approve: {
      opts: {
        auth: true,
      },
      method: HttpMethod.POST,
      url: '/users/requests/:id',
      optional: [],
    },
    deny: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/users/requests/:id',
      optional: [],
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
    },
    saved_filters: {
      opts: {
        auth: true,
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/users/saved_filters/:section',
      optional: [],
    },
    profile: {
      opts: {
        auth: 'optional',
        extended: ['full', 'vip'],
      },
      method: HttpMethod.GET,
      url: '/users/:username',
      optional: [],
    },
    collection: {
      opts: {
        auth: 'optional',
        extended: ['full', 'metadata'],
      },
      method: HttpMethod.GET,
      url: '/users/:username/collection/:type',
      optional: [],
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
    },
    collaborations: {
      opts: {
        auth: 'optional',
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists/collaborations',
      optional: [],
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
    },
    delete: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/users/:username/lists/:id',
      optional: [],
    },
    likes: {
      opts: {
        auth: 'optional',
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists/:id/likes',
      optional: [],
    },
    like: {
      add: {
        opts: {
          auth: true,
        },
        method: HttpMethod.POST,
        url: '/users/:username/lists/:id/like',
        optional: [],
      },
      remove: {
        opts: {
          auth: true,
        },
        method: HttpMethod.DELETE,
        url: '/users/:username/lists/:id/like',
        optional: [],
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
      },
    },
    comments: {
      opts: {
        pagination: true,
      },
      method: HttpMethod.GET,
      url: '/users/:username/lists/:id/comments/:sort',
      optional: ['sort'],
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
    },
    remove: {
      opts: {
        auth: true,
      },
      method: HttpMethod.DELETE,
      url: '/users/:username/follow',
      optional: [],
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
  },
  following: {
    opts: {
      auth: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/following',
    optional: [],
  },
  friends: {
    opts: {
      auth: 'optional',
      extended: ['full'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/friends',
    optional: [],
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
  },
  watching: {
    opts: {
      auth: 'optional',
    },
    method: HttpMethod.GET,
    url: '/users/:username/watching',
    optional: [],
  },
  watched: {
    opts: {
      auth: 'optional',
      extended: ['full', 'noseasons'],
    },
    method: HttpMethod.GET,
    url: '/users/:username/watched/:type',
    optional: [],
  },
  stats: {
    opts: {
      auth: 'optional',
    },
    method: HttpMethod.GET,
    url: '/users/:username/stats',
    optional: [],
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
  },
  networks: {
    opts: {},
    method: HttpMethod.GET,
    url: '/networks',
    optional: [],
  },
  languages: {
    opts: {},
    method: HttpMethod.GET,
    url: '/languages/:type',
    optional: [],
  },
  countries: {
    opts: {},
    method: HttpMethod.GET,
    url: '/countries/:type',
    optional: [],
  },
  certifications: {
    opts: {},
    method: HttpMethod.GET,
    url: '/certifications/:type',
    optional: [],
  },
} satisfies ITraktApi;

import type { TraktComment } from '~/models/trakt-comment.model';
import type { TraktList } from '~/models/trakt-list.model';
import type {
  TraktMovie,
  TraktMovieAnticipated,
  TraktMovieBoxOffice,
  TraktMovieCast,
  TraktMovieFavorited,
  TraktMoviePlayed,
  TraktMovieRelease,
  TraktMovieStats,
  TraktMovieTrending,
  TraktMovieUpdate,
} from '~/models/trakt-movie.model';

import type { TraktUser } from '~/models/trakt-user.model';

import {
  TraktApiExtended,
  type TraktApiParamsExtended,
  type TraktApiParamsFilter,
  type TraktApiParamsPagination,
  type TraktApiTemplateOptions,
  TraktClientEndpoint,
} from '~/models/trakt-client.model';
import {
  type StartDateParam,
  type TraktAlias,
  type TraktRating,
  type TraktStudio,
  type TraktTranslation,
  transformStartDate,
  validateStartDate,
} from '~/models/trakt-entity.model';
import { type TraktApiMovieFilters, TraktApiMovieFilterValues } from '~/services/trakt-client/api/trakt-api.filters';
import { HttpMethod } from '~/utils/http.utils';

type BaseMovieParams = TraktApiParamsPagination & TraktApiParamsExtended<typeof TraktApiExtended.Full> & TraktApiParamsFilter<TraktApiMovieFilters>;

const baseOptions: TraktApiTemplateOptions = {
  pagination: true,
  extended: [TraktApiExtended.Full],
  filters: TraktApiMovieFilterValues,
};

export const movies = {
  /**
   * Returns all movies being watched right now. Movies with the most users are returned first.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @filters movies - {@link TraktApiMovieFilters}
   *
   * @see [trending]{@link https://trakt.docs.apiary.io/#reference/movies/trending/get-trending-movies}
   */
  trending: new TraktClientEndpoint<BaseMovieParams, TraktMovieTrending[]>({
    method: HttpMethod.GET,
    url: '/movies/trending',
    opts: { ...baseOptions },
  }),
  /**
   * Returns the most popular movies. Popularity is calculated using the rating percentage and the number of ratings.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @filters movies - {@link TraktApiMovieFilters}
   *
   * @see [get-popular-movies]{@link https://trakt.docs.apiary.io/#reference/movies/popular/get-popular-movies}
   */
  popular: new TraktClientEndpoint<BaseMovieParams, TraktMovie<'any'>[]>({
    method: HttpMethod.GET,
    url: '/movies/popular',
    opts: { ...baseOptions },
  }),
  /**
   * Returns the most favorited movies in the specified time period, defaulting to weekly. All stats are relative to the specific time period.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @filters movies - {@link TraktApiMovieFilters}
   *
   * @see [get-the-most-favorited-movies]{@link https://trakt.docs.apiary.io/#reference/movies/favorited/get-the-most-favorited-movies}
   */
  favorited: new TraktClientEndpoint<
    {
      /** Time period. */
      period?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';
    } & BaseMovieParams,
    TraktMovieFavorited[]
  >({
    method: HttpMethod.GET,
    url: '/movies/favorited/:period',
    opts: {
      ...baseOptions,
      parameters: {
        path: {
          period: false,
        },
      },
    },
  }),
  /**
   * Returns the most played (a single user can watch multiple times) movies in the specified time period, defaulting to weekly.
   * All stats are relative to the specific time period.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @filters movies - {@link TraktApiMovieFilters}
   *
   * @see [get-the-most-played-movies]{@link https://trakt.docs.apiary.io/#reference/movies/played/get-the-most-played-movies}
   */
  played: new TraktClientEndpoint<
    {
      /** Time period. */
      period?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';
    } & BaseMovieParams,
    TraktMoviePlayed[]
  >({
    method: HttpMethod.GET,
    url: '/movies/played/:period',
    opts: {
      ...baseOptions,
      parameters: {
        path: {
          period: false,
        },
      },
    },
  }),
  /**
   * Returns the most watched (unique users) movies in the specified time period, defaulting to weekly. All stats are relative to the specific time period.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @filters movies - {@link TraktApiMovieFilters}
   *
   * @see [get-the-most-watched-movies]{@link https://trakt.docs.apiary.io/#reference/movies/watched/get-the-most-watched-movies}
   */
  watched: new TraktClientEndpoint<
    {
      /** Time period. */
      period?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';
    } & BaseMovieParams,
    TraktMoviePlayed[]
  >({
    method: HttpMethod.GET,
    url: '/movies/watched/:period',
    opts: {
      ...baseOptions,
      parameters: {
        path: {
          period: false,
        },
      },
    },
  }),
  /**
   * Returns the most collected (unique users) movies in the specified time period, defaulting to weekly. All stats are relative to the specific time period.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @filters movies - {@link TraktApiMovieFilters}
   *
   * @see [get-the-most-collected-movies]{@link https://trakt.docs.apiary.io/#reference/movies/collected/get-the-most-collected-movies}
   */
  collected: new TraktClientEndpoint<
    {
      /** Time period. */
      period?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';
    } & BaseMovieParams,
    TraktMoviePlayed[]
  >({
    method: HttpMethod.GET,
    url: '/movies/collected/:period',
    opts: {
      ...baseOptions,
      parameters: {
        path: {
          period: false,
        },
      },
    },
  }),
  /**
   * Returns the most anticipated movies based on the number of lists a movie appears on.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @filters movies - {@link TraktApiMovieFilters}
   *
   * @see [get-the-most-anticipated-movies]{@link https://trakt.docs.apiary.io/#reference/movies/anticipated/get-the-most-anticipated-movies}
   */
  anticipated: new TraktClientEndpoint<BaseMovieParams, TraktMovieAnticipated[]>({
    method: HttpMethod.GET,
    url: '/movies/anticipated',
    opts: { ...baseOptions },
  }),
  /**
   * Returns the top 10 grossing movies in the U.S. box office last weekend. Updated every Monday morning.
   *
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-the-weekend-box-office]{@link https://trakt.docs.apiary.io/#reference/movies/box-office/get-the-weekend-box-office}
   */
  boxOffice: new TraktClientEndpoint<TraktApiParamsExtended<typeof TraktApiExtended.Full>, TraktMovieBoxOffice[]>({
    method: HttpMethod.GET,
    url: '/movies/boxoffice',
    opts: {
      extended: [TraktApiExtended.Full],
    },
  }),
  /**
   * Returns all movies updated since the specified UTC date and time.
   * We recommended storing the X-Start-Date header you can be efficient using this method moving forward.
   * By default, 10 results are returned. You can send a limit to get up to 100 results per page.
   *
   * * <b>Important</b>
   *
   * The start_date is only accurate to the hour, for caching purposes.
   * Please drop the minutes and seconds from your timestamp to help optimize our cached data.
   * For example, use 2021-07-17T12:00:00Z and not 2021-07-17T12:23:34Z.
   *
   * * <b>Note</b>
   *
   * The start_date can only be a maximum of 30 days in the past.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-recently-updated-movies]{@link https://trakt.docs.apiary.io/#reference/movies/updates/get-recently-updated-movies}
   */
  updates: new TraktClientEndpoint<
    StartDateParam & TraktApiParamsExtended<typeof TraktApiExtended.Full> & TraktApiParamsPagination,
    TraktMovieUpdate[]
  >({
    method: HttpMethod.GET,
    url: '/movies/updates/:start_date',
    transform: transformStartDate,
    validate: validateStartDate,
    opts: {
      pagination: true,
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          start_date: false,
        },
      },
    },
  }),
  /**
   * Returns all movie Trakt IDs updated since the specified UTC date and time.
   * We recommended storing the X-Start-Date header you can be efficient using this method moving forward.
   * By default, 10 results are returned. You can send a limit to get up to 100 results per page.
   *
   * * <b>Important</b>
   *
   * The start_date is only accurate to the hour, for caching purposes.
   * Please drop the minutes and seconds from your timestamp to help optimize our cached data.
   * For example, use 2021-07-17T12:00:00Z and not 2021-07-17T12:23:34Z.
   *
   * * <b>Note</b>
   *
   * The start_date can only be a maximum of 30 days in the past.
   *
   * @pagination true - {@link TraktApiPagination}
   *
   * @see [get-recently-updated-movie-trakt-ids]{@link https://trakt.docs.apiary.io/#reference/movies/updated-ids/get-recently-updated-movie-trakt-ids}
   */
  updatedIds: new TraktClientEndpoint<StartDateParam & TraktApiParamsPagination, number[]>({
    method: HttpMethod.GET,
    url: '/movies/updates/id/:start_date',
    transform: transformStartDate,
    validate: validateStartDate,
    opts: {
      pagination: true,
      parameters: {
        path: {
          start_date: false,
        },
      },
    },
  }),
  /**
   * Returns a single movie's details.
   *
   * * <b>Note</b>
   *
   * When getting full extended info, the status field can have a value of released, in production, post production, planned, rumored, or canceled.
   *
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-a-movie]{@link https://trakt.docs.apiary.io/#reference/movies/updated-ids/get-a-movie}
   */
  summary: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktMovie<'any'>
  >({
    method: HttpMethod.GET,
    url: '/movies/:id',
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
   * Returns all title aliases for a movie. Includes country where name is different.
   *
   * @see [get-all-movie-aliases]{@link https://trakt.docs.apiary.io/#reference/movies/summary/get-all-movie-aliases}
   */
  aliases: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    },
    TraktAlias[]
  >({
    method: HttpMethod.GET,
    url: '/movies/:id/aliases',
    opts: {
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns all releases for a movie including country, certification, release date, release type, and note.
   * The release type can be set to unknown, premiere, limited, theatrical, digital, physical, or tv. T
   * he note might have optional info such as the film festival name for a premiere release or Blu-ray specs for a physical release. We pull this info from TMDB.
   *
   * @see [get-all-movie-releases]{@link https://trakt.docs.apiary.io/#reference/movies/updated-ids/get-all-movie-releases}
   */
  releases: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
      /** 2 character country code (ISO 3166-1 alpha-2) */
      country?: string;
    },
    TraktMovieRelease[]
  >({
    method: HttpMethod.GET,
    url: '/movies/:id/releases/:country',
    opts: {
      parameters: {
        path: {
          id: true,
          country: false,
        },
      },
    },
  }),
  /**
   * Returns all translations for a movie, including language and translated values for title, tagline and overview.
   *
   * @see [get-all-movie-translations]{@link https://trakt.docs.apiary.io/#reference/movies/translations/get-all-movie-translations}
   */
  translations: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
      /** 2 character language code (ISO 639-1) */
      language?: string;
    },
    TraktTranslation[]
  >({
    method: HttpMethod.GET,
    url: '/movies/:id/translations/:language',
    opts: {
      parameters: {
        path: {
          id: true,
          language: false,
        },
      },
    },
  }),
  /**
   * Returns all top level comments for a movie. By default, the newest comments are returned first.
   * Other sorting options include oldest, most likes, most replies, highest rated, lowest rated, and most plays.
   *
   * * <b>Note</b>
   *
   * If you send OAuth, comments from blocked users will be automatically filtered out.
   *
   * @pagination true - {@link TraktApiPagination}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   * @auth optional
   *
   * @see [get-all-movie-comments]{@link https://trakt.docs.apiary.io/#reference/movies/comments/get-all-movie-comments}
   */
  comments: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
      /** Comment sorting. */
      sort?: 'newest' | 'oldest' | 'likes' | 'replies' | 'highest' | 'lowest' | 'plays';
    } & TraktApiParamsPagination,
    TraktComment[]
  >({
    method: HttpMethod.GET,
    url: '/movies/:id/comments/:sort',
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
  /**
   * Returns all lists that contain this movie. By default, personal lists are returned sorted by the most popular.
   *
   * @pagination true - {@link TraktApiPagination}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   *
   * @see [get-lists-containing-this-movie]{@link https://trakt.docs.apiary.io/#reference/movies/lists/get-lists-containing-this-movie}
   */
  lists: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
      /** Filter for a specific list type */
      type?: 'all' | 'personal' | 'official' | 'watchlists' | 'favorites';
      /** Lists sorting. */
      sort?: 'popular' | 'likes' | 'comments' | 'items' | 'added' | 'updated';
    } & TraktApiParamsPagination,
    TraktList[]
  >({
    method: HttpMethod.GET,
    url: '/movies/:id/lists/:type/:sort',
    opts: {
      pagination: true,
      emoji: true,
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
   * Returns all cast and crew for a movie. Each cast member will have a characters array and a standard person object.
   * The crew object will be broken up by department into production, art, crew, costume & make-up, directing, writing, sound, camera, visual effects, lighting, and editing (if there are people for those crew positions).
   * Each of those members will have a jobs array and a standard person object.
   *
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-all-people-for-a-movie]{@link https://trakt.docs.apiary.io/#reference/movies/people/get-all-people-for-a-movie}
   */
  people: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktMovieCast
  >({
    method: HttpMethod.GET,
    url: '/movies/:id/people',
    opts: {
      extended: [TraktApiExtended.Full],
    },
  }),
  /**
   * Returns rating (between 0 and 10) and distribution for a movie.
   *
   * @see [get-movie-ratings]{@link https://trakt.docs.apiary.io/#reference/movies/ratings/get-movie-ratings}
   */
  ratings: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    },
    TraktRating
  >({
    method: HttpMethod.GET,
    url: '/movies/:id/ratings',
    opts: {
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns related and similar movies.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-related-movies]{@link https://trakt.docs.apiary.io/#reference/movies/related/get-related-movies}
   */
  related: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
      TraktApiParamsPagination,
    TraktMovie<'any'>[]
  >({
    method: HttpMethod.GET,
    url: '/movies/:id/related',
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
   * Returns lots of movie stats.
   *
   * @see [get-movie-stats]{@link https://trakt.docs.apiary.io/#reference/movies/stats/get-movie-stats}
   */
  stats: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    },
    TraktMovieStats
  >({
    method: HttpMethod.GET,
    url: '/movies/:id/stats',
    opts: {
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns all studios for a movie.
   *
   * @see [get-movie-studios]{@link https://trakt.docs.apiary.io/#reference/movies/studios/get-movie-studios}
   */
  studios: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    },
    TraktStudio[]
  >({
    method: HttpMethod.GET,
    url: '/movies/:id/studios',
    opts: {
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns all users watching this movie right now.
   *
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-users-watching-right-now]{@link https://trakt.docs.apiary.io/#reference/movies/watching/get-users-watching-right-now}
   */
  watching: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktUser<'any'>[]
  >({
    method: HttpMethod.GET,
    url: '/movies/:id/watching',
    opts: {
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
};

import type { TraktComment } from '~/models/trakt-comment.model';
import type { TraktRating, TraktTranslation } from '~/models/trakt-entity.model';
import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktList } from '~/models/trakt-list.model';
import type { TraktSeason, TraktSeasonCast, TraktSeasonStats } from '~/models/trakt-season.model';

import type { TraktUser } from '~/models/trakt-user.model';

import { TraktApiExtended, type TraktApiParamsExtended, type TraktApiParamsPagination, TraktClientEndpoint } from '~/models/trakt-client.model';
import { HttpMethod } from '~/utils/http.utils';

export const seasons = {
  /**
   * Returns all seasons for a show including the number of episodes in each season.
   *
   * * <b>Episodes</b>
   *
   * If you add ?extended=episodes to the URL, it will return all episodes for all seasons.
   *
   * * <b>Note</b>
   *
   * This returns a lot of data, so please only use this extended parameter if you actually need it!
   *
   * @extended true - {@link TraktApiExtended.Episodes}
   *
   * @see [get-all-seasons-for-a-show]{@link https://trakt.docs.apiary.io/#reference/seasons/summary/get-all-seasons-for-a-show}
   */
  summary: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Episodes>,
    TraktSeason<'any'>[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons',
    opts: {
      extended: [TraktApiExtended.Full, TraktApiExtended.Episodes],
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns all episodes for a specific season of a show.
   *
   * * <b>Translations</b>
   *
   * If you'd like to included translated episode titles and overviews in the response, include the translations parameter in the URL.
   * Include all languages by setting the parameter to all or use a specific 2 digit country language code to further limit it.
   *
   * * <b>Note</b>
   *
   * This returns a lot of data, so please only use this extended parameter if you actually need it!
   *
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-single-season-for-a-show]{@link https://trakt.docs.apiary.io/#reference/seasons/season/get-single-season-for-a-show}
   */
  season: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
      /** season number */
      season: number;
      /** include episode translations - 2 character language code (ISO 639-1) */
      translations?: string;
    },
    TraktEpisode<'any'>[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season?translations=',
    opts: {
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          id: true,
          season: true,
        },
        query: {
          translations: false,
        },
      },
    },
  }),
  /**
   * Returns all translations for a season, including language and translated values for title and overview.
   *
   * @see [get-all-season-translations]{@link https://trakt.docs.apiary.io/#reference/seasons/translations/get-all-season-translations}
   */
  translations: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
      /** season number */
      season: number;
      /** 2 character language code (ISO 639-1) */
      language?: string;
    },
    TraktTranslation[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/translations/:language',
    opts: {
      parameters: {
        path: {
          id: true,
          season: true,
          language: false,
        },
      },
    },
  }),
  /**
   * Returns all top level comments for a season. By default, the newest comments are returned first.
   * Other sorting options include oldest, most likes, most replies, highest rated, lowest rated, most plays, and highest watched percentage.
   *
   * * <b>Note</b>
   *
   * If you send OAuth, comments from blocked users will be automatically filtered out.
   *
   * @pagination true - {@link TraktApiPagination}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   * @auth optional
   *
   * @see [get-all-season-comments]{@link https://trakt.docs.apiary.io/#reference/seasons/comments/get-all-season-comments}
   */
  comments: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
      /** season number */
      season: number;
      /** Comment sorting. */
      sort?: 'newest' | 'oldest' | 'likes' | 'replies' | 'highest' | 'lowest' | 'plays' | 'watched';
    } & TraktApiParamsPagination,
    TraktComment[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/comments/:sort',
    opts: {
      pagination: true,
      emoji: true,
      auth: 'optional',
      parameters: {
        path: {
          id: true,
          season: true,
          sort: false,
        },
      },
    },
  }),
  /**
   * Returns all lists that contain this season. By default, personal lists are returned sorted by the most popular.
   *
   * @pagination true - {@link TraktApiPagination}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   *
   * @see [get-lists-containing-this-season]{@link https://trakt.docs.apiary.io/#reference/seasons/lists/get-lists-containing-this-season}
   */
  lists: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
      /** season number */
      season: number;
      /** Filter for a specific list type */
      type?: 'all' | 'personal' | 'official' | 'watchlists';
      /** Lists sorting. */
      sort?: 'popular' | 'likes' | 'comments' | 'items' | 'added' | 'updated';
    } & TraktApiParamsPagination,
    TraktList[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/lists/:type/:sort',
    opts: {
      pagination: true,
      emoji: true,
      parameters: {
        path: {
          id: true,
          season: true,
          type: false,
          sort: false,
        },
      },
    },
  }),
  /**
   * Returns all cast and crew for a season, including the episode_count for which they appear.
   * Each cast member will have a characters array and a standard person object.
   *
   * The crew object will be broken up by department into production, art, crew, costume & make-up, directing, writing, sound, camera, visual effects, lighting, and editing (if there are people for those crew positions).
   * Each of those members will have a jobs array and a standard person object.
   *
   * * <b>Guest Stars</b>
   *
   * If you add ?extended=guest_stars to the URL, it will return all guest stars that appeared in at least 1 episode of the season.
   *
   * * <b>Note</b>
   *
   * This returns a lot of data, so please only use this extended parameter if you actually need it!
   *
   * @extended true - {@link TraktApiExtended.GuestStars}
   *
   * @see [get-all-people-for-a-season]{@link https://trakt.docs.apiary.io/#reference/seasons/people/get-all-people-for-a-season}
   */
  people: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
      /** season number */
      season: number;
    } & TraktApiParamsExtended<typeof TraktApiExtended.GuestStars>,
    TraktSeasonCast
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/people',
    opts: {
      extended: [TraktApiExtended.GuestStars],
      parameters: {
        path: {
          id: true,
          season: true,
        },
      },
    },
  }),
  /**
   * Returns rating (between 0 and 10) and distribution for a season.
   *
   * @see [get-season-ratings]{@link https://trakt.docs.apiary.io/#reference/seasons/ratings/get-season-ratings}
   */
  ratings: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
      /** season number */
      season: number;
    },
    TraktRating
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/ratings',
    opts: {
      parameters: {
        path: {
          id: true,
          season: true,
        },
      },
    },
  }),
  /**
   * Returns lots of season stats.
   *
   * @see [get-season-stats]{@link https://trakt.docs.apiary.io/#reference/seasons/stats/get-season-stats}
   */
  stats: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
      /** season number */
      season: number;
    },
    TraktSeasonStats
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/stats',
    opts: {
      parameters: {
        path: {
          id: true,
          season: true,
        },
      },
    },
  }),
  /**
   * Returns all users watching this season right now.
   *
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-users-watching-right-now]{@link https://trakt.docs.apiary.io/#reference/seasons/watching/get-users-watching-right-now}
   */
  watching: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
      /** season number */
      season: number;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktUser<'any'>[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/watching',
    opts: {
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          id: true,
          season: true,
        },
      },
    },
  }),
};

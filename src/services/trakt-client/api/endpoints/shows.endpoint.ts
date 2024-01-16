import type { TraktComment } from '~/models/trakt-comment.model';
import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktList } from '~/models/trakt-list.model';
import type { TraktCollectionProgress, TraktProgressReset, TraktWatchedProgress } from '~/models/trakt-progress.model';
import type {
  TraktShow,
  TraktShowAnticipated,
  TraktShowCast,
  TraktShowCertification,
  TraktShowFavorited,
  TraktShowPlayed,
  TraktShowStats,
  TraktShowTrending,
  TraktShowUpdate,
} from '~/models/trakt-show.model';

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
import { type TraktApiShowFilters, TraktApiShowFilterValues } from '~/services/trakt-client/api/trakt-api.filters';
import { HttpMethod } from '~/utils/http.utils';

type BaseShowParams = TraktApiParamsPagination & TraktApiParamsExtended<typeof TraktApiExtended.Full> & TraktApiParamsFilter<TraktApiShowFilters>;

const baseOptions: TraktApiTemplateOptions = {
  pagination: true,
  extended: [TraktApiExtended.Full],
  filters: TraktApiShowFilterValues,
};

export const shows = {
  /**
   * Returns all shows being watched right now. Shows with the most users are returned first.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @filters true - {@link TraktApiShowFilters}
   *
   * @see [get-trending-shows]{@link https://trakt.docs.apiary.io/#reference/shows/trending/get-trending-shows}
   */
  trending: new TraktClientEndpoint<BaseShowParams, TraktShowTrending[]>({
    method: HttpMethod.GET,
    url: '/shows/trending',
    opts: { ...baseOptions },
  }),
  /**
   * Returns the most popular shows. Popularity is calculated using the rating percentage and the number of ratings.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @filters true - {@link TraktApiShowFilters}
   *
   * @see [get-popular-shows]{@link https://trakt.docs.apiary.io/#reference/shows/popular/get-popular-shows}
   */
  popular: new TraktClientEndpoint<BaseShowParams, TraktShow<'any'>[]>({
    method: HttpMethod.GET,
    url: '/shows/popular',
    opts: { ...baseOptions },
  }),
  /**
   * Returns the most favorited shows in the specified time period, defaulting to weekly. All stats are relative to the specific time period.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @filters true - {@link TraktApiShowFilters}
   *
   * @see [get-the-most-favorited-shows]{@link https://trakt.docs.apiary.io/#reference/shows/favorited/get-the-most-favorited-shows}
   */
  favorited: new TraktClientEndpoint<
    {
      /** Time period. */
      period?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';
    } & BaseShowParams,
    TraktShowFavorited[]
  >({
    method: HttpMethod.GET,
    url: '/shows/favorited/:period',
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
   * Returns the most played (a single user can watch multiple episodes multiple times) shows in the specified time period, defaulting to weekly.
   * All stats are relative to the specific time period.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @filters true - {@link TraktApiShowFilters}
   *
   * @see [get-the-most-played-shows]{@link https://trakt.docs.apiary.io/#reference/shows/played/get-the-most-played-shows}
   */
  played: new TraktClientEndpoint<
    {
      /** Time period. */
      period?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';
    } & BaseShowParams,
    TraktShowPlayed[]
  >({
    method: HttpMethod.GET,
    url: '/shows/played/:period',
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
   * Returns the most watched (unique users) shows in the specified time period, defaulting to weekly. All stats are relative to the specific time period.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @filters true - {@link TraktApiShowFilters}
   *
   * @see [get-the-most-watched-shows]{@link https://trakt.docs.apiary.io/#reference/shows/watched/get-the-most-watched-shows}
   */
  watched: new TraktClientEndpoint<
    {
      /** Time period. */
      period?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';
    } & BaseShowParams,
    TraktShowPlayed[]
  >({
    method: HttpMethod.GET,
    url: '/shows/watched/:period',
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
   * Returns the most collected (unique users) shows in the specified time period, defaulting to weekly. All stats are relative to the specific time period.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @filters true - {@link TraktApiShowFilters}
   *
   * @see [get-the-most-collected-shows]{@link https://trakt.docs.apiary.io/#reference/shows/collected/get-the-most-collected-shows}
   */
  collected: new TraktClientEndpoint<
    {
      /** Time period. */
      period?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';
    } & BaseShowParams,
    TraktShowPlayed[]
  >({
    method: HttpMethod.GET,
    url: '/shows/collected',
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
   * Returns the most anticipated shows based on the number of lists a show appears on.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @filters true - {@link TraktApiShowFilters}
   *
   * @see [get-the-most-anticipated-shows]{@link https://trakt.docs.apiary.io/#reference/shows/anticipated/get-the-most-anticipated-shows}
   */
  anticipated: new TraktClientEndpoint<BaseShowParams, TraktShowAnticipated[]>({
    method: HttpMethod.GET,
    url: '/shows/anticipated',
    opts: { ...baseOptions },
  }),
  /**
   * Returns all shows updated since the specified UTC date and time.
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
   * @see [get-recently-updated-shows]{@link https://trakt.docs.apiary.io/#reference/shows/updates/get-recently-updated-shows}
   */
  updates: new TraktClientEndpoint<
    StartDateParam & TraktApiParamsExtended<typeof TraktApiExtended.Full> & TraktApiParamsPagination,
    TraktShowUpdate[]
  >({
    method: HttpMethod.GET,
    url: '/shows/updates/:start_date',
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
   * Returns all show Trakt IDs updated since the specified UTC date and time.
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
   * @see [get-recently-updated-show-trakt-ids]{@link https://trakt.docs.apiary.io/#reference/shows/updated-ids/get-recently-updated-show-trakt-ids}
   */
  updatedIds: new TraktClientEndpoint<StartDateParam & TraktApiParamsPagination, number[]>({
    method: HttpMethod.GET,
    url: '/shows/updates/id/:start_date',
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
   * Returns a single shows's details. If you request extended info, the airs object is relative to the show's country.
   * You can use the day, time, and timezone to construct your own date then convert it to whatever timezone your user is in.
   *
   * * <b>Note</b>
   *
   * When getting full extended info, the status field can have a value of returning series (airing right now), continuing (airing right now), in production (airing soon), planned (in development), upcoming (in development), pilot, canceled, or ended.
   *
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-a-single-show]{@link https://trakt.docs.apiary.io/#reference/shows/summary/get-a-single-show}
   */
  summary: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktShow<'any'>
  >({
    method: HttpMethod.GET,
    url: '/shows/:id',
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
   * Returns all title aliases for a show. Includes country where name is different.
   *
   * @see [get-all-show-aliases]{@link https://trakt.docs.apiary.io/#reference/shows/aliases/get-all-show-aliases}
   */
  aliases: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    },
    TraktAlias[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/aliases',
    opts: {
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns all content certifications for a show, including the country.
   *
   * @see [get-all-show-certifications]{@link https://trakt.docs.apiary.io/#reference/shows/certifications/get-all-show-certifications}
   */
  certifications: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    },
    TraktShowCertification[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/certifications',
    opts: {
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns all translations for a show, including language and translated values for title and overview.
   *
   * @see [get-all-show-translations]{@link https://trakt.docs.apiary.io/#reference/shows/translations/get-all-show-translations}
   */
  translations: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
      /** 2 character language code. (ISO 639-1) */
      language?: string;
    },
    TraktTranslation[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/translations/:language',
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
   * Returns all top level comments for a show. By default, the newest comments are returned first.
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
   * @see [get-all-show-comments]{@link https://trakt.docs.apiary.io/#reference/shows/comments/get-all-show-comments}
   */
  comments: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
      /** Comment sorting. */
      sort?: 'newest' | 'oldest' | 'likes' | 'replies' | 'highest' | 'lowest' | 'plays' | 'watched';
    } & TraktApiParamsPagination,
    TraktComment[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/comments/:sort',
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
   * Returns all lists that contain this show. By default, personal lists are returned sorted by the most popular.
   *
   * @pagination true - {@link TraktApiPagination}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   *
   * @see [get-lists-containing-this-show]{@link https://trakt.docs.apiary.io/#reference/shows/lists/get-lists-containing-this-show}
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
    url: '/shows/:id/lists/:type/:sort',
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
  progress: {
    /**
     * Returns collection progress for a show including details on all aired seasons and episodes.
     * The next_episode will be the next episode the user should collect, if there are no upcoming episodes it will be set to null.
     *
     * By default, any hidden seasons will be removed from the response and stats.
     * To include these and adjust the completion stats, set the hidden flag to true.
     *
     * By default, specials will be excluded from the response. Set the specials flag to true to include season 0 and adjust the stats accordingly.
     * If you'd like to include specials, but not adjust the stats, set count_specials to false.
     *
     * By default, the last_episode and next_episode are calculated using the last aired episode the user has collected, even if they've collected older episodes more recently.
     * To use their last collected episode for these calculations, set the last_activity flag to collected.
     *
     * * <b>Note</b>
     *
     * Only aired episodes are used to calculate progress. Episodes in the future or without an air date are ignored.
     *
     * @auth required
     *
     * @see [get-show-collection-progress]{@link https://trakt.docs.apiary.io/#reference/shows/collection-progress/get-show-collection-progress}
     */
    collection: new TraktClientEndpoint<
      {
        /** Trakt ID, Trakt slug, or IMDB ID */
        id: string;
        /** include any hidden seasons */
        hidden?: boolean;
        /** include specials as season 0 */
        specials?: boolean;
        /** count specials in the overall stats (only applies if specials are included) */
        count_specials?: boolean;
      },
      TraktCollectionProgress
    >({
      method: HttpMethod.GET,
      url: '/shows/:id/progress/collection?hidden=false&specials=false&count_specials=true',
      opts: {
        auth: true,
        parameters: {
          path: {
            id: true,
          },
          query: {
            hidden: false,
            specials: false,
            count_specials: false,
          },
        },
      },
    }),
    /**
     * Returns watched progress for a show including details on all aired seasons and episodes.
     * The next_episode will be the next episode the user should watch, if there are no upcoming episodes it will be set to null.
     * If not null, the reset_at date is when the user started re-watching the show.
     * Your app can adjust the progress by ignoring episodes with a last_watched_at prior to the reset_at.
     *
     * By default, any hidden seasons will be removed from the response and stats.
     * To include these and adjust the completion stats, set the hidden flag to true.
     *
     * By default, specials will be excluded from the response.
     * Set the specials flag to true to include season 0 and adjust the stats accordingly.
     * If you'd like to include specials, but not adjust the stats, set count_specials to false.
     *
     * By default, the last_episode and next_episode are calculated using the last aired episode the user has watched, even if they've watched older episodes more recently.
     * To use their last watched episode for these calculations, set the last_activity flag to watched.
     *
     * * <b>Note</b>
     *
     * Only aired episodes are used to calculate progress. Episodes in the future or without an air date are ignored.
     *
     * @auth required
     *
     * @see [get-show-watched-progress]{@link https://trakt.docs.apiary.io/#reference/shows/collection-progress/get-show-watched-progress}
     */
    watched: new TraktClientEndpoint<
      {
        /** Trakt ID, Trakt slug, or IMDB ID */
        id: string;
        /** include any hidden seasons */
        hidden?: boolean;
        /** include specials as season 0 */
        specials?: boolean;
        /** count specials in the overall stats (only applies if specials are included) */
        count_specials?: boolean;
      },
      TraktWatchedProgress
    >({
      method: HttpMethod.GET,
      url: '/shows/:id/progress/watched?hidden=&specials=&count_specials=&last_activity=',
      opts: {
        auth: true,
        parameters: {
          path: {
            id: true,
          },
          query: {
            hidden: false,
            specials: false,
            count_specials: false,
          },
        },
      },
    }),
    /**
     * Reset a show's progress when the user started re-watching the show.
     * You can optionally specify the reset_at date to have it calculate progress from that specific date onwards.
     *
     * @vip required - [Requires a paid VIP subscription]{@link https://trakt.docs.apiary.io/#introduction/vip-methods}
     * @auth required
     *
     * @see [reset-show-progress]{@link https://trakt.docs.apiary.io/#reference/shows/reset-watched-progress/reset-show-progress}
     */
    reset: new TraktClientEndpoint<
      {
        /** Trakt ID, Trakt slug, or IMDB ID */
        id: string;
      },
      TraktProgressReset
    >({
      method: HttpMethod.POST,
      url: '/shows/:id/progress/watched/reset',
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
     * Undo the reset and have watched progress use all watched history for the show.
     *
     * @vip required - [Requires a paid VIP subscription]{@link https://trakt.docs.apiary.io/#introduction/vip-methods}
     * @auth required
     *
     * @see [undo-reset-show-progress]{@link https://trakt.docs.apiary.io/#reference/shows/reset-watched-progress/undo-reset-show-progress}
     */
    undoReset: new TraktClientEndpoint<{
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    }>({
      method: HttpMethod.DELETE,
      url: '/shows/:id/progress/watched/reset',
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
  },
  /**
   * Returns all cast and crew for a show, including the episode_count for which they appears.
   * Each cast member will have a characters array and a standard person object.
   *
   * The crew object will be broken up by department into production, art, crew, costume & make-up, directing, writing, sound, camera, visual effects, lighting, editing, and created by (if there are people for those crew positions).
   * Each of those members will have a jobs array and a standard person object.
   *
   * * <b>Guest Starts</b>
   *
   * If you add ?extended=guest_stars to the URL, it will return all guest stars that appeared in at least 1 episode of the show.
   *
   * * <b>Note</b>
   *
   * This returns a lot of data, so please only use this extended parameter if you actually need it!
   *
   * @extended true - {@link TraktApiExtended.Full}, {@link TraktApiExtended.GuestStars}
   *
   * @see [get-all-people-for-a-show]{@link https://trakt.docs.apiary.io/#reference/shows/people/get-all-people-for-a-show}
   */
  people: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.GuestStars | typeof TraktApiExtended.Full>,
    TraktShowCast
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/people',
    opts: {
      extended: [TraktApiExtended.Full, TraktApiExtended.GuestStars],
    },
  }),
  /**
   * Returns rating (between 0 and 10) and distribution for a show.
   *
   * @see [get-show-ratings]{@link https://trakt.docs.apiary.io/#reference/shows/ratings/get-show-ratings}
   */
  ratings: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    },
    TraktRating
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/ratings',
    opts: {
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns related and similar shows.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-related-shows]{@link https://trakt.docs.apiary.io/#reference/shows/related/get-related-shows}
   */
  related: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
      TraktApiParamsPagination,
    TraktShow<'any'>[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/related',
    opts: {
      pagination: true,
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns lots of show stats.
   *
   * @see [get-show-stats]{@link https://trakt.docs.apiary.io/#reference/shows/stats/get-show-stats}
   */
  stats: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    },
    TraktShowStats
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/stats',
    opts: {
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns all studios for a show.
   *
   * @see [get-show-studios]{@link https://trakt.docs.apiary.io/#reference/shows/studios/get-show-studios}
   */
  studios: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    },
    TraktStudio[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/studios',
    opts: {
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns all users watching this show right now.
   *
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-users-watching-right-now]{@link https://trakt.docs.apiary.io/#reference/shows/watching/get-users-watching-right-now}
   */
  watching: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktUser<'any'>[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/watching',
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
   * Returns the next scheduled to air episode. If no episode is found, a 204 HTTP status code will be returned.
   *
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-next-episode]{@link https://trakt.docs.apiary.io/#reference/shows/next-episode/get-next-episode}
   */
  nextEpisode: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktEpisode<'any'>
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/next_episode',
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
   * Returns the most recently aired episode. If no episode is found, a 204 HTTP status code will be returned.
   *
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-last-episode]{@link https://trakt.docs.apiary.io/#reference/shows/last-episode/get-last-episode}
   */
  lastEpisode: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktEpisode<'any'>
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/last_episode',
    opts: {
      extended: [TraktApiExtended.Full],
    },
  }),
};

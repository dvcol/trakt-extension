import type { TraktComment } from '~/models/trakt-comment.model';
import type { TraktRating, TraktTranslation } from '~/models/trakt-entity.model';
import type { TraktEpisode, TraktEpisodeCast, TraktShowStats } from '~/models/trakt-episode.model';

import type { TraktList } from '~/models/trakt-list.model';

import type { TraktUser } from '~/models/trakt-user.model';

import { TraktApiExtended, type TraktApiParamsExtended, type TraktApiParamsPagination, TraktClientEndpoint } from '~/models/trakt-client.model';
import { HttpMethod } from '~/utils/http.utils';

type BaseEpisodeParam = {
  /** Trakt ID, Trakt slug, or IMDB ID */
  id: string;
  /** season number */
  season: number;
  /** episode number */
  episode: number;
};

export const episodes = {
  /**
   * Returns a single episode's details. All date and times are in UTC and were calculated using the episode's air_date and show's country and air_time.
   *
   * * <b>Note</b>
   *
   * If the first_aired is unknown, it will be set to null.
   *
   * * <b>Note</b>
   *
   * When getting full extended info, the episode_type field can have a value of standard, series_premiere (season 1, episode 1), season_premiere (episode 1), mid_season_finale, mid_season_premiere (the next episode after the mid season finale), season_finale, or series_finale (last episode to air for an ended show).
   *
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-a-single-episode-for-a-show]{@link https://trakt.docs.apiary.io/#reference/episodes/summary/get-a-single-episode-for-a-show}
   */
  summary: new TraktClientEndpoint<BaseEpisodeParam & TraktApiParamsExtended<typeof TraktApiExtended.Full>, TraktEpisode<'any'>>({
    opts: {
      extended: [TraktApiExtended.Full],
    },
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode',
  }),
  /**
   * Returns all translations for an episode, including language and translated values for title and overview.
   *
   * @see [get-all-episode-translations]{@link https://trakt.docs.apiary.io/#reference/episodes/translations/get-all-episode-translations}
   */
  translations: new TraktClientEndpoint<
    BaseEpisodeParam & {
      /** 2 character language code (ISO 639-1) */
      language?: string;
    },
    TraktTranslation[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/translations/:language',
    opts: {
      parameters: {
        path: {
          id: true,
          season: true,
          episode: true,
          language: false,
        },
      },
    },
  }),
  /**
   * Returns all top level comments for an episode. By default, the newest comments are returned first.
   * Other sorting options include oldest, most likes, most replies, highest rated, lowest rated, and most plays.
   *
   * @pagination true - {@link TraktApiPagination}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   * @auth optional
   *
   * @see [get-all-episode-comments]{@link https://trakt.docs.apiary.io/#reference/episodes/comments/get-all-episode-comments}
   */
  comments: new TraktClientEndpoint<
    BaseEpisodeParam & {
      /** sort order */
      sort?: 'newest' | 'oldest' | 'likes' | 'replies' | 'highest' | 'lowest' | 'plays';
    } & TraktApiParamsPagination,
    TraktComment[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/comments/:sort',
    opts: {
      pagination: true,
      emoji: true,
      auth: 'optional',
      parameters: {
        path: {
          id: true,
          season: true,
          episode: true,
          sort: false,
        },
      },
    },
  }),
  /**
   * Returns all lists that contain this episode. By default, personal lists are returned sorted by the most popular.
   *
   * @pagination true - {@link TraktApiPagination}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   *
   * @see [get-lists-containing-this-episode]{@link https://trakt.docs.apiary.io/#reference/episodes/lists/get-lists-containing-this-episode}
   */
  lists: new TraktClientEndpoint<
    BaseEpisodeParam & {
      /** Filter for a specific list type */
      type?: 'all' | 'personal' | 'official' | 'watchlists';
      /** How to sort */
      sort?: 'popular' | 'likes' | 'comments' | 'items' | 'added' | 'updated';
    } & TraktApiParamsPagination,
    TraktList[]
  >({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/lists/:type/:sort',
    opts: {
      pagination: true,
      emoji: true,
      parameters: {
        path: {
          id: true,
          season: true,
          episode: true,
          type: false,
          sort: false,
        },
      },
    },
  }),
  /**
   * Returns all cast and crew for an episode. Each cast member will have a characters array and a standard person object.
   *
   * The crew object will be broken up by department into production, art, crew, costume & make-up, directing, writing, sound, camera, visual effects, lighting, and editing (if there are people for those crew positions).
   * Each of those members will have a jobs array and a standard person object.
   *
   * * <b>Guest Stars</b>
   *
   * If you add ?extended=guest_stars to the URL, it will return all guest stars that appeared in the episode.
   *
   * * <b>Note</b>
   *
   * This returns a lot of data, so please only use this extended parameter if you actually need it!
   *
   * @extended true - {@link TraktApiExtended.GuestStars}
   *
   * @see [get-all-people-for-an-episode]{@link https://trakt.docs.apiary.io/#reference/episodes/people/get-all-people-for-an-episode}
   */
  people: new TraktClientEndpoint<BaseEpisodeParam & TraktApiParamsExtended<typeof TraktApiExtended.GuestStars>, TraktEpisodeCast>({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/people',
    opts: {
      extended: [TraktApiExtended.GuestStars],
      parameters: {
        path: {
          id: true,
          season: true,
          episode: true,
        },
      },
    },
  }),
  /**
   * Returns rating (between 0 and 10) and distribution for an episode.
   *
   * @see [get-episode-ratings]{@link https://trakt.docs.apiary.io/#reference/episodes/ratings/get-episode-ratings}
   */
  ratings: new TraktClientEndpoint<BaseEpisodeParam, TraktRating>({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/ratings',
    opts: {
      parameters: {
        path: {
          id: true,
          season: true,
          episode: true,
        },
      },
    },
  }),
  /**
   * Returns lots of episode stats.
   *
   * @see [get-episode-stats]{@link https://trakt.docs.apiary.io/#reference/episodes/stats/get-episode-stats}
   */
  stats: new TraktClientEndpoint<BaseEpisodeParam, TraktShowStats>({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/stats',
    opts: {
      parameters: {
        path: {
          id: true,
          season: true,
          episode: true,
        },
      },
    },
  }),
  /**
   * Returns all users watching this episode right now.
   *
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-users-watching-right-now]{@link https://trakt.docs.apiary.io/#reference/episodes/watching/get-users-watching-right-now}
   */
  watching: new TraktClientEndpoint<BaseEpisodeParam & TraktApiParamsExtended<typeof TraktApiExtended.Full>, TraktUser<'any'>[]>({
    method: HttpMethod.GET,
    url: '/shows/:id/seasons/:season/episodes/:episode/watching',
    opts: {
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          id: true,
          season: true,
          episode: true,
        },
      },
    },
  }),
};

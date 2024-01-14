import type { TraktList } from '~/models/trakt-list.model';
import type { TraktMovieCast } from '~/models/trakt-movie.model';
import type { TraktPerson, TraktPersonUpdate } from '~/models/trakt-people.model';

import type { TraktShowCast } from '~/models/trakt-show.model';

import { TraktApiExtended, type TraktApiParamsExtended, type TraktApiParamsPagination, TraktClientEndpoint } from '~/models/trakt-client.model';
import { type StartDateParam, transformStartDate, validateStartDate } from '~/models/trakt-entity.model';
import { HttpMethod } from '~/utils/http.utils';

export const people = {
  /**
   * Returns all people updated since the specified UTC date and time.
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
   * @see [get-recently-updated-people]{@link https://trakt.docs.apiary.io/#reference/people/updates/get-recently-updated-people}
   */
  updates: new TraktClientEndpoint<
    StartDateParam & TraktApiParamsExtended<typeof TraktApiExtended.Full> & TraktApiParamsPagination,
    TraktPersonUpdate[]
  >({
    method: HttpMethod.GET,
    url: '/people/updates/:start_date',
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
   * Returns all people Trakt IDs updated since the specified UTC date and time.
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
   * @see [get-recently-updated-people-trakt-ids]{@link https://trakt.docs.apiary.io/#reference/people/updated-ids/get-recently-updated-people-trakt-ids}
   */
  updatedIds: new TraktClientEndpoint<StartDateParam & TraktApiParamsPagination, number[]>({
    method: HttpMethod.GET,
    url: '/people/updates/id/:start_date',
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
   * Returns a single person's details.
   *
   * * <b>Gender</b>
   *
   * If available, the gender property will be set to male, female, or non_binary.
   *
   * * <b>Known For Department</b>
   *
   * If available, the known_for_department property will be set to production, art, crew, costume & make-up, directing, writing, sound, camera, visual effects, lighting, or editing.
   * Many people have credits across departments, known_for allows you to select their default credits more accurately.
   *
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-a-single-person]{@link https://trakt.docs.apiary.io/#reference/people/summary/get-a-single-person}
   */
  summary: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktPerson<'any'>
  >({
    method: HttpMethod.GET,
    url: '/people/:id',
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
   * Returns all movies where this person is in the cast or crew. Each cast object will have a characters array and a standard movie object.
   *
   * The crew object will be broken up by department into production, art, crew, costume & make-up, directing, writing, sound, camera, visual effects, lighting, and editing (if there are people for those crew positions).
   * Each of those members will have a jobs array and a standard movie object.
   *
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-movie-credits]{@link https://trakt.docs.apiary.io/#reference/people/movies/get-movie-credits}
   */
  movies: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktMovieCast
  >({
    method: HttpMethod.GET,
    url: '/people/:id/movies',
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
   * Returns all shows where this person is in the cast or crew, including the episode_count for which they appear.
   * Each cast object will have a characters array and a standard show object.
   * If series_regular is true, this person is a series regular and not simply a guest star.
   *
   * The crew object will be broken up by department into production, art, crew, costume & make-up, directing, writing, sound, camera, visual effects, lighting, editing, and created by (if there are people for those crew positions).
   * Each of those members will have a jobs array and a standard show object.
   *
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-show-credits]{@link https://trakt.docs.apiary.io/#reference/people/shows/get-show-credits}
   */
  shows: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full>,
    TraktShowCast
  >({
    method: HttpMethod.GET,
    url: '/people/:id/shows',
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
   * Returns all lists that contain this person. By default, personal lists are returned sorted by the most popular.
   *
   * @pagination true - {@link TraktApiPagination}
   * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
   *
   * @see [get-lists-containing-this-person]{@link https://trakt.docs.apiary.io/#reference/people/lists/get-lists-containing-this-person}
   */
  lists: new TraktClientEndpoint<
    {
      /** Trakt ID, Trakt slug, or IMDB ID */
      id: string;
      /** Filter for a specific list type */
      type?: 'all' | 'personal' | 'official';
      /** How to sort */
      sort?: 'popular' | 'likes' | 'comments' | 'items' | 'added' | 'updated';
    },
    TraktList[]
  >({
    method: HttpMethod.GET,
    url: '/people/:id/lists/:type/:sort',
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
};

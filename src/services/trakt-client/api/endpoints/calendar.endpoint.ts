import type { ITraktApi } from '~/models/trakt-client.model';

import type { TraktApiCommonFilters } from '~/services/trakt-client/api/trakt-api.filters';

import { TraktClientEndpoint } from '~/models/trakt-client.model';

import { TraktApiCommonFilterValues } from '~/services/trakt-client/api/trakt-api.filters';
import { TraktApiValidators } from '~/services/trakt-client/api/trakt-api.validators';
import { HttpMethod } from '~/utils/http.utils';

/**
 * By default, the calendar will return all shows or movies for the specified time period and can be global or user specific.
 * The start_date defaults to today and days to 7. The maximum amount of days you can send is 33.
 * All dates (including the start_date and first_aired) are in UTC, so it's up to your app to handle any offsets based on the user's time zone.
 *
 * The my calendar displays episodes for all shows that have been watched, collected, or watchlisted plus individual episodes on the watchlist.
 * It will remove any shows that have been hidden from the calendar. The all calendar displays info for all shows airing during the specified period.
 *
 * @see {@link https://trakt.docs.apiary.io/#reference/calendars}
 */
export const calendars = {
  my: {
    shows: {
      /**
       * Returns all shows airing during the time period specified.
       * @auth true
       * @extended full
       * @filters common
       *
       * @see {@link https://trakt.docs.apiary.io/#reference/calendars/my-shows/get-shows}
       */
      get: new TraktClientEndpoint<
        {
          start_date?: string;
          days?: number;
        },
        TraktApiCommonFilters
      >({
        method: HttpMethod.GET,
        url: '/calendars/my/shows/:start_date/:days',
        opts: {
          auth: true,
          extended: ['full'],
          filters: TraktApiCommonFilterValues,
          parameters: {
            path: {
              start_date: false,
              days: false,
            },
          },
        },
        validate: param => {
          if (param.start_date) TraktApiValidators.date(param.start_date);
          return true;
        },
      }),
      /**
       * Returns all new show premieres (series_premiere) airing during the time period specified.
       * @auth true
       * @extended full
       * @filters common
       *
       * @see {@link https://trakt.docs.apiary.io/#reference/calendars/my-new-shows/get-new-shows}
       */
      new: new TraktClientEndpoint<
        {
          start_date?: string;
          days?: number;
        },
        TraktApiCommonFilters
      >({
        method: HttpMethod.GET,
        url: '/calendars/my/shows/new/:start_date/:days',
        opts: {
          auth: true,
          extended: ['full'],
          filters: TraktApiCommonFilterValues,
          parameters: {
            path: {
              start_date: false,
              days: false,
            },
          },
        },
        validate: param => {
          if (param.start_date) TraktApiValidators.date(param.start_date);
          return true;
        },
      }),
      /**
       * Returns all show premieres (mid_season_premiere, season_premiere, series_premiere) airing during the time period specified.
       * @auth true
       * @extended full
       * @filters common
       *
       * @see {@link https://trakt.docs.apiary.io/#reference/calendars/my-season-premieres/get-season-premieres}
       */
      premieres: new TraktClientEndpoint<
        {
          start_date?: string;
          days?: number;
        },
        TraktApiCommonFilters
      >({
        method: HttpMethod.GET,
        url: '/calendars/my/shows/premieres/:start_date/:days',
        opts: {
          auth: true,
          extended: ['full'],
          filters: TraktApiCommonFilterValues,
          parameters: {
            path: {
              start_date: false,
              days: false,
            },
          },
        },
        validate: param => {
          if (param.start_date) TraktApiValidators.date(param.start_date);
          return true;
        },
      }),
      /**
       * Returns all show finales (mid_season_finale, season_finale, series_finale) airing during the time period specified.
       * @auth true
       * @extended full
       * @filters common
       *
       * @see {@link https://trakt.docs.apiary.io/#reference/calendars/my-finales/get-finales}
       */
      finales: new TraktClientEndpoint<
        {
          start_date?: string;
          days?: number;
        },
        TraktApiCommonFilters
      >({
        method: HttpMethod.GET,
        url: '/calendars/my/shows/finales/:start_date/:days',
        opts: {
          auth: true,
          extended: ['full'],
          filters: TraktApiCommonFilterValues,
          parameters: {
            path: {
              start_date: false,
              days: false,
            },
          },
        },
        validate: param => {
          if (param.start_date) TraktApiValidators.date(param.start_date);
          return true;
        },
      }),
    },
    /**
     * Returns all movies with a release date during the time period specified.
     * @auth true
     * @extended full
     * @filters common
     *
     * @see {@link https://trakt.docs.apiary.io/#reference/calendars/my-movies/get-movies}
     */
    movies: new TraktClientEndpoint<
      {
        start_date?: string;
        days?: number;
      },
      TraktApiCommonFilters
    >({
      method: HttpMethod.GET,
      url: '/calendars/my/movies/:start_date/:days',
      opts: {
        auth: true,
        extended: ['full'],
        filters: TraktApiCommonFilterValues,
        parameters: {
          path: {
            start_date: false,
            days: false,
          },
        },
      },
      validate: param => {
        if (param.start_date) TraktApiValidators.date(param.start_date);
        return true;
      },
    }),
    /**
     * Returns all movies with a DVD release date during the time period specified.
     * @auth true
     * @extended full
     * @filters common
     *
     * @see {@link https://trakt.docs.apiary.io/#reference/calendars/my-dvd/get-dvd-releases}
     */
    dvd: new TraktClientEndpoint<
      {
        start_date?: string;
        days?: number;
      },
      TraktApiCommonFilters
    >({
      method: HttpMethod.GET,
      url: '/calendars/my/dvd/:start_date/:days',
      opts: {
        auth: true,
        extended: ['full'],
        filters: TraktApiCommonFilterValues,
        parameters: {
          path: {
            start_date: false,
            days: false,
          },
        },
      },
      validate: param => {
        if (param.start_date) TraktApiValidators.date(param.start_date);
        return true;
      },
    }),
  },
  all: {
    /**
     * Returns all shows airing during the time period specified.
     * @filters common
     *
     * @see {@link https://trakt.docs.apiary.io/#reference/calendars/all-shows/get-shows}
     */
    shows: {
      get: new TraktClientEndpoint<
        {
          start_date?: string;
          days?: number;
        },
        TraktApiCommonFilters
      >({
        method: HttpMethod.GET,
        url: '/calendars/all/shows/:start_date/:days',
        opts: {
          extended: ['full'],
          filters: TraktApiCommonFilterValues,
          parameters: {
            path: {
              start_date: false,
              days: false,
            },
          },
        },
        validate: param => {
          if (param.start_date) TraktApiValidators.date(param.start_date);
          return true;
        },
      }),
      /**
       * Returns all new show premieres (series_premiere) airing during the time period specified.
       * @filters common
       *
       * @see {@link https://trakt.docs.apiary.io/#reference/calendars/all-new-shows/get-new-shows}
       */
      new: new TraktClientEndpoint<
        {
          start_date?: string;
          days?: number;
        },
        TraktApiCommonFilters
      >({
        method: HttpMethod.GET,
        url: '/calendars/all/shows/new/:start_date/:days',
        opts: {
          extended: ['full'],
          filters: TraktApiCommonFilterValues,
          parameters: {
            path: {
              start_date: false,
              days: false,
            },
          },
        },
        validate: param => {
          if (param.start_date) TraktApiValidators.date(param.start_date);
          return true;
        },
      }),
      /**
       * Returns all show premieres (mid_season_premiere, season_premiere, series_premiere) airing during the time period specified.
       * @filters common
       *
       * @see {@link https://trakt.docs.apiary.io/#reference/calendars/all-season-premieres/get-season-premieres}
       */
      premieres: new TraktClientEndpoint<
        {
          start_date?: string;
          days?: number;
        },
        TraktApiCommonFilters
      >({
        method: HttpMethod.GET,
        url: '/calendars/all/shows/premieres/:start_date/:days',
        opts: {
          extended: ['full'],
          filters: TraktApiCommonFilterValues,
          parameters: {
            path: {
              start_date: false,
              days: false,
            },
          },
        },
        validate: param => {
          if (param.start_date) TraktApiValidators.date(param.start_date);
          return true;
        },
      }),
      /**
       * Returns all show finales (mid_season_finale, season_finale, series_finale) airing during the time period specified.
       * @filters common
       *
       * @see {@link https://trakt.docs.apiary.io/#reference/calendars/all-finales/get-finales}
       */
      finales: new TraktClientEndpoint<
        {
          start_date?: string;
          days?: number;
        },
        TraktApiCommonFilters
      >({
        method: HttpMethod.GET,
        url: '/calendars/all/finales/:start_date/:days',
        opts: {
          extended: ['full'],
          filters: TraktApiCommonFilterValues,
          parameters: {
            path: {
              start_date: false,
              days: false,
            },
          },
        },
        validate: param => {
          if (param.start_date) TraktApiValidators.date(param.start_date);
          return true;
        },
      }),
      /**
       * Returns all movies with a release date during the time period specified.
       * @filters common
       *
       * @see {@link https://trakt.docs.apiary.io/#reference/calendars/all-movies/get-movies}
       */
      movies: new TraktClientEndpoint<
        {
          start_date?: string;
          days?: number;
        },
        TraktApiCommonFilters
      >({
        method: HttpMethod.GET,
        url: '/calendars/all/movies/:start_date/:days',
        opts: {
          extended: ['full'],
          filters: TraktApiCommonFilterValues,
          parameters: {
            path: {
              start_date: false,
              days: false,
            },
          },
        },
        validate: param => {
          if (param.start_date) TraktApiValidators.date(param.start_date);
          return true;
        },
      }),
    },
    /**
     * Returns all movies with a DVD release date during the time period specified.
     * @filters common
     *
     * @see {@link https://trakt.docs.apiary.io/#reference/calendars/all-dvd/get-dvd-releases}
     */
    dvd: new TraktClientEndpoint<
      {
        start_date?: string;
        days?: number;
      },
      TraktApiCommonFilters
    >({
      method: HttpMethod.GET,
      url: '/calendars/all/dvd/:start_date/:days',
      opts: {
        extended: ['full'],
        filters: TraktApiCommonFilterValues,
        parameters: {
          path: {
            start_date: false,
            days: false,
          },
        },
      },
      validate: param => {
        if (param.start_date) TraktApiValidators.date(param.start_date);
        return true;
      },
    }),
  },
} satisfies ITraktApi;

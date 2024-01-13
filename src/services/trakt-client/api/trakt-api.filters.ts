import type { Primitive } from '~/utils/typescript.utils';

import { TraktEpisodeTypeValues } from '~/models/trakt-episode.model';
import { TraktShowStatusValues } from '~/models/trakt-show.model';

import { DecimalRange, DigitRange, LargeRange, PercentageRange, VeryLargeRange } from '~/utils/regex.utils';

/**
 Applying these filters refines the results and helps your users to more easily discover new items.
 Add a query string (i.e. ?years=2016&genres=action) with any filters you want to use.
 Some filters allow multiples which can be sent as comma delimited parameters.
 *
 * Note: Make sure to properly URL encode the parameters including spaces and special characters.
 *
 * @see [filters]{@link https://trakt.docs.apiary.io/#introduction/filters}
 */
export const TraktApiCommonFilter = {
  /** Search titles and descriptions. */
  Query: 'query',
  /** 4 digit year or range of years. */
  Years: 'years',
  /** Range in minutes (dash separated digits, i.e. \d+-\d+). */
  Runtimes: 'runtimes',
  /** Genre slugs. (supports comma separated multiple values) */
  Genres: 'genres',
  /** 2 character (ISO 639-1) language code. (supports comma separated multiple values) */
  Languages: 'languages',
  /** 2 character (ISO 3166-1 alpha-2) country code. (supports comma separated multiple values) */
  Countries: 'countries',
  /** Trakt studio ID. (supports comma separated multiple values) */
  StudioIds: 'studio_ids',
} as const;

/** @see [filters]{@link https://trakt.docs.apiary.io/#introduction/filters} */
export type TraktApiCommonFilters = (typeof TraktApiCommonFilter)[keyof typeof TraktApiCommonFilter];
export const TraktApiCommonFilterValues: TraktApiCommonFilters[] = Object.values(TraktApiCommonFilter);

/**
 *  Applying these filters refines the results and helps your users to more easily discover new items.
 *  Add a query string (i.e. ?ratings=0-100) with any filters you want to use.
 *
 *  Trakt, TMDB, and IMDB ratings apply to movies, shows, and episodes. Rotten Tomatoes and Metacritic apply to movies.
 *
 * @see [filters]{@link https://trakt.docs.apiary.io/#introduction/filters}
 */
export const TraktApiRatingFilter = {
  /** Trakt rating range between 0 and 100. */
  Ratings: 'ratings',
  /** Trakt vote count between 0 and 100 0000. */
  Votes: 'votes',
  /** TMDB vote count between 0 and 100 0000. */
  TmdbVotes: 'tmdb_votes',
  /** IMDB vote count between 0 and 300 0000. */
  ImdbVotes: 'imdb_votes',
  /** TMDB rating range between 0.0 and 10.0. */
  TmdbRatings: 'tmdb_ratings',
  /** IMDB rating range between 0.0 and 10.0. */
  ImdbRatings: 'imdb_ratings',
} as const;

/** @see [filters]{@link https://trakt.docs.apiary.io/#introduction/filters} */
export type TraktApiRatingFilters = (typeof TraktApiRatingFilter)[keyof typeof TraktApiRatingFilter];
export const TraktApiRatingFilterValues: TraktApiRatingFilters[] = Object.values(TraktApiRatingFilter);

/**
 *  Applying these filters refines the results and helps your users to more easily discover new items.
 *  Add a query string (i.e. ?rt_meters=0-100) with any filters you want to use.
 *
 * @see [filters]{@link https://trakt.docs.apiary.io/#introduction/filters}
 */
export const TraktApiMovieRatingFilter = {
  ...TraktApiRatingFilter,
  /** Rotten Tomatoes tomatometer range between 0 and 100. */
  RtMeters: 'rt_meters',
  /** Rotten Tomatoes audience score range between 0 and 100. */
  RtUserMeters: 'rt_user_meters',
  /** Metacritic score range between 0 and 100. */
  Metascores: 'metascores',
} as const;

/** @see [filters]{@link https://trakt.docs.apiary.io/#introduction/filters} */
export type TraktApiMovieRatingFilters = (typeof TraktApiMovieRatingFilter)[keyof typeof TraktApiMovieRatingFilter];
export const TraktApiMovieRatingFilterValues: TraktApiMovieRatingFilters[] = Object.values(TraktApiMovieRatingFilter);

/**
 *  Applying these filters refines the results and helps your users to more easily discover new items.
 *  Add a query string (i.e. ?certifications=us) with any filters you want to use.
 *
 * @see [filters]{@link https://trakt.docs.apiary.io/#introduction/filters}
 */
export const TraktApiMovieFilter = {
  /** US content certification. (supports comma separated multiple values) */
  Certifications: 'certifications',
} as const;

/** @see [filters]{@link https://trakt.docs.apiary.io/#introduction/filters} */
export type TraktApiMovieFilters =
  | TraktApiCommonFilters
  | TraktApiMovieRatingFilters
  | (typeof TraktApiMovieFilter)[keyof typeof TraktApiMovieFilter];
export const TraktApiMovieFilterValues: TraktApiMovieFilters[] = [
  ...TraktApiCommonFilterValues,
  ...TraktApiMovieRatingFilterValues,
  ...Object.values(TraktApiMovieFilter),
];

/**
 *  Applying these filters refines the results and helps your users to more easily discover new items.
 *  Add a query string (i.e. ?certifications=us) with any filters you want to use.
 *
 * @see [filters]{@link https://trakt.docs.apiary.io/#introduction/filters}
 */
export const TraktApiShowFilter = {
  /** US content certification. (supports comma separated multiple values) */
  Certifications: 'certifications',
  /** Trakt network ID. (supports comma separated multiple values) */
  NetworkIds: 'network_ids',
  /** Set to returning series, continuing, in production, planned, upcoming, pilot, canceled, or ended. (supports comma separated multiple values) */
  Status: 'status',
} as const;

/** @see [filters]{@link https://trakt.docs.apiary.io/#introduction/filters} */
export type TraktApiShowFilters = TraktApiCommonFilters | TraktApiRatingFilters | (typeof TraktApiShowFilter)[keyof typeof TraktApiShowFilter];
export const TraktApiShowFilterValues: TraktApiShowFilters[] = [
  ...TraktApiCommonFilterValues,
  ...TraktApiRatingFilterValues,
  ...Object.values(TraktApiShowFilter),
];

/**
 *  Applying these filters refines the results and helps your users to more easily discover new items.
 *  Add a query string (i.e. ?certifications=us) with any filters you want to use.
 *
 * @see [filters]{@link https://trakt.docs.apiary.io/#introduction/filters}
 */
export const TraktApiEpisodeFilter = {
  /** US content certification. (supports comma separated multiple values) */
  Certifications: 'certifications',
  /** Trakt network ID. (supports comma separated multiple values) */
  NetworkIds: 'network_ids',
  /** Set to standard, series_premiere, season_premiere, mid_season_finale, mid_season_premiere, season_finale, or series_finale. (supports comma separated multiple values) */
  EpisodeTypes: 'episode_types',
} as const;

/** @see [filters]{@link https://trakt.docs.apiary.io/#introduction/filters} */
export type TraktApiEpisodeFilters =
  | TraktApiCommonFilters
  | TraktApiRatingFilters
  | (typeof TraktApiEpisodeFilter)[keyof typeof TraktApiEpisodeFilter];
export const TraktApiEpisodeFilterValues: TraktApiEpisodeFilters[] = [
  ...TraktApiCommonFilterValues,
  ...TraktApiRatingFilterValues,
  ...Object.values(TraktApiEpisodeFilter),
];

export const TraktApiFilter = {
  ...TraktApiCommonFilter,
  ...TraktApiRatingFilter,
  ...TraktApiMovieFilter,
  ...TraktApiShowFilter,
  ...TraktApiEpisodeFilter,
} as const;

export const TraktApiFilterValues = Object.values(TraktApiFilter);

/** @see [filters]{@link https://trakt.docs.apiary.io/#introduction/filters} */
export type TraktApiFilters = TraktApiCommonFilters | TraktApiRatingFilters | TraktApiMovieFilters | TraktApiShowFilters | TraktApiEpisodeFilters;

export const isFilter = (filter: string): filter is TraktApiFilters => (TraktApiFilterValues as string[]).includes(filter);

export const TraktApiFilterValidator = {
  common: (filter: TraktApiCommonFilters, value: Primitive | Primitive[], error = false): boolean => {
    if (Array.isArray(value) && [TraktApiCommonFilter.Query, TraktApiCommonFilter.Years, TraktApiCommonFilter.Runtimes].some(f => f === filter)) {
      if (error) throw new Error(`Filter '${filter}' doesn't support multiple values.`);
      return false;
    }

    if (filter === TraktApiCommonFilter.Runtimes && !DigitRange.test(value.toString())) {
      if (error) throw new Error(`Filter '${filter}' should be dash separated digits, i.e. \\d+-\\d+`);
      return false;
    }

    const values = Array.isArray(value) ? value : [value];

    if (values.some(v => v.toString().length > 4) && filter === TraktApiCommonFilter.Years) {
      if (error) throw new Error(`Filter '${filter}' needs to be a 4 digit value.`);
      return false;
    }
    if (values.some(v => v.toString().length > 2) && [TraktApiCommonFilter.Languages, TraktApiCommonFilter.Countries].some(f => f === filter)) {
      if (error) throw new Error(`Filter '${filter}' needs to be a 2 digit value.`);
      return false;
    }

    return true;
  },
  rating: (filter: TraktApiMovieFilters, value: Primitive | Primitive[], error = false): boolean => {
    if (Array.isArray(value)) {
      if (error) throw new Error(`Filter '${filter}' doesn't support multiple values.`);
      return false;
    }

    switch (filter) {
      case TraktApiRatingFilter.Ratings:
      case TraktApiMovieRatingFilter.RtMeters:
      case TraktApiMovieRatingFilter.RtUserMeters:
      case TraktApiMovieRatingFilter.Metascores:
        if (!PercentageRange.test(value.toString())) {
          if (error) throw new Error(`Filter '${filter}' should be a range between 0 and 100.`);
          return false;
        }
        break;

      case TraktApiRatingFilter.Votes:
      case TraktApiRatingFilter.TmdbVotes:
        if (!LargeRange.test(value.toString())) {
          if (error) throw new Error(`Filter '${filter}' should be a range between 0 and 100 0000.`);
          return false;
        }
        break;

      case TraktApiRatingFilter.ImdbVotes:
        if (!VeryLargeRange.test(value.toString())) {
          if (error) throw new Error(`Filter '${filter}' should be a range between 0 and 300 0000.`);
          return false;
        }
        break;

      case TraktApiRatingFilter.TmdbRatings:
      case TraktApiRatingFilter.ImdbRatings:
        if (!DecimalRange.test(value.toString())) {
          if (error) throw new Error(`Filter '${filter}' should be a range between 0.0 and 10.0.`);
          return false;
        }
        break;

      default:
        break;
    }
    return true;
  },
  shows: (filter: TraktApiShowFilters, value: Primitive | Primitive[], error = false): boolean => {
    const values = Array.isArray(value) ? value : [value];

    if (filter === TraktApiShowFilter.Status && !values.some(v => TraktShowStatusValues.includes(v.toString()))) {
      if (error) throw new Error(`Filter '${filter}' is invalid.`);
      return false;
    }
    return true;
  },
  episodes: (filter: TraktApiEpisodeFilters, value: Primitive | Primitive[], error = false): boolean => {
    const values = Array.isArray(value) ? value : [value];

    if (filter === TraktApiEpisodeFilter.EpisodeTypes && !values.some(v => TraktEpisodeTypeValues.includes(v.toString()))) {
      if (error) throw new Error(`Filter '${filter}' is invalid.`);
      return false;
    }
    return true;
  },
  validate: (filter: TraktApiFilters, value: Primitive | Primitive[], error = false): boolean => {
    if (TraktApiCommonFilterValues.includes(filter as TraktApiCommonFilters)) {
      return TraktApiFilterValidator.common(filter as TraktApiCommonFilters, value, error);
    }
    if (TraktApiRatingFilterValues.includes(filter as TraktApiRatingFilters)) {
      return TraktApiFilterValidator.rating(filter as TraktApiRatingFilters, value, error);
    }
    if (TraktApiShowFilterValues.includes(filter as TraktApiShowFilters)) {
      return TraktApiFilterValidator.shows(filter as TraktApiShowFilters, value, error);
    }
    if (TraktApiEpisodeFilterValues.includes(filter as TraktApiEpisodeFilters)) {
      return TraktApiFilterValidator.episodes(filter as TraktApiEpisodeFilters, value, error);
    }
    return true;
  },
};

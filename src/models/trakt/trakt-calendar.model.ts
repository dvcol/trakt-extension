import type { TraktApiExtended, TraktApiParams } from '~/models/trakt/trakt-client.model';
import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';

import type { TraktApiCommonFilters } from '~/services/trakt-client/api/trakt-api.filters';

export type TraktCalendarShow = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  first_aired: string;
  episode: TraktEpisode;
  show: TraktShow;
};

export type TraktCalendarMovie = {
  /** Calendar Date in ISO 8601 format (YYYY-MM-DD) */
  released: string;
  movie: TraktMovie;
};

export type TraktCalendarStartAndDay = {
  /**
   * Date (in UTC) from which to start the calendar.
   * Defaults to today.
   */
  start_date?: string | number | Date;
  /**
   * Number of days to display.
   * Defaults to 7.
   * The maximum amount of days you can send is 33.
   */
  days?: number;
};

export type TraktCalendarQuery = TraktApiParams<TraktCalendarStartAndDay, typeof TraktApiExtended.Full, TraktApiCommonFilters, false>;

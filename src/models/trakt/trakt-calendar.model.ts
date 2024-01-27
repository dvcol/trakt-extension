import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';

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

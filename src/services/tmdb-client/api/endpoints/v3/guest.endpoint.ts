import type { TmdbEpisodeRating } from '~/models/tmdb/tmdb-episode.model';
import type { TmdbMovieGuestRating } from '~/models/tmdb/tmdb-movie.model';

import type { TmdbShowGuestRating } from '~/models/tmdb/tmdb-show.model';

import { TmdbClientEndpoint, type TmdbPaginatedData, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Guest v3 endpoints.
 */
export const guest = {
  rated: {
    /**
     * Get the rated movies for a guest session.
     *
     * @auth guest-session
     * @version 3
     *
     * @see [guest-rated-movies]{@link https://developer.themoviedb.org/reference/guest-session-rated-movies}
     */
    movies: new TmdbClientEndpoint<
      {
        session_id?: string;

        language?: string;
        sort_by?: 'created_at.asc' | 'created_at.desc';
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbMovieGuestRating>
    >({
      method: HttpMethod.GET,
      url: '/guest_session/:session_id/rated/movies?language=&sort_by=&page=',
      opts: {
        auth: 'session',
        guest: true,
        version: 3,
        parameters: {
          path: {
            session_id: false,
          },
          query: {
            language: false,
            page: false,
            sort_by: false,
          },
        },
      },
    }),
    /**
     * Get the rated TV shows for a guest session.
     *
     * @auth guest-session
     * @version 3
     *
     * @see [guest-rated-tv-shows]{@link https://developer.themoviedb.org/reference/guest-session-rated-tv}
     */
    tv: new TmdbClientEndpoint<
      {
        session_id?: string;

        language?: string;
        sort_by?: 'created_at.asc' | 'created_at.desc';
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbShowGuestRating>
    >({
      method: HttpMethod.GET,
      url: '/guest_session/:session_id/rated/tv?language=&sort_by=&page=',
      opts: {
        auth: 'session',
        guest: true,
        version: 3,
        parameters: {
          path: {
            session_id: false,
          },
          query: {
            language: false,
            page: false,
            sort_by: false,
          },
        },
      },
    }),
    /**
     * Get the rated TV episodes for a guest session.
     *
     * @auth guest-session
     * @version 3
     *
     * @see [guest-rated-tv-episodes]{@link https://developer.themoviedb.org/reference/guest-session-rated-tv-episodes}
     */
    episodes: new TmdbClientEndpoint<
      {
        session_id?: string;

        language?: string;
        sort_by?: 'created_at.asc' | 'created_at.desc';
      } & TmdbParamPagination,
      TmdbPaginatedData<TmdbEpisodeRating>
    >({
      method: HttpMethod.GET,
      url: '/guest_session/:session_id/rated/tv/episodes?language=&sort_by=&page=',
      opts: {
        auth: 'session',
        guest: true,
        version: 3,
        parameters: {
          path: {
            session_id: false,
          },
          query: {
            language: false,
            page: false,
            sort_by: false,
          },
        },
      },
    }),
  },
};

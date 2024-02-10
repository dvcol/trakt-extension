import { TmdbClientEndpoint, type TmdbPaginatedData, type TmdbParamPagination } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Changes v3 endpoints.
 */
export const changes = {
  /**
   * Get a list of all of the movie ids that have been changed in the past 24 hours.
   *
   * You can query this method up to 14 days at a time.
   * Use the start_date and end_date query parameters.
   * 100 items are returned per page.
   *
   * @version 3
   *
   * @see [movie-changes]{@link https://developer.themoviedb.org/reference/changes-movie-list}
   */
  movie: new TmdbClientEndpoint<
    {
      start_date?: string;
      end_date?: string;
    } & TmdbParamPagination,
    TmdbPaginatedData<{ id: number; adult: boolean }>
  >({
    method: HttpMethod.GET,
    url: '/movie/changes?page=&start_date=&end_date=',
    opts: {
      version: 3,
    },
  }),
  people: new TmdbClientEndpoint({
    /**
     * Get a list of all of the person ids that have been changed in the past 24 hours.
     *
     * You can query this method up to 14 days at a time.
     * Use the start_date and end_date query parameters.
     * 100 items are returned per page.
     *
     * @version 3
     * @see [person-changes]{@link https://developer.themoviedb.org/reference/changes-people-list}
     */
    method: HttpMethod.GET,
    url: '/person/changes?page=&start_date=&end_date=',
    opts: {
      version: 3,
    },
  }),
};

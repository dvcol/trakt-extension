import type { TvdbGenre } from '~/models/tvdb/tvdb-genre.model';

import { TvdbClientEndpoint } from '~/models/tvdb/tvdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Genres Endpoint
 *
 * @see [genres]{@link https://thetvdb.github.io/v4-api/#/Genres}
 */
export const genres = {
  /**
   * Returns a list of genres records.
   *
   * @auth required
   *
   * @see [get-all-genres]{@link https://thetvdb.github.io/v4-api/#/Genres/getAllGenres}
   */
  all: new TvdbClientEndpoint<Record<string, never>, TvdbGenre[]>({
    method: HttpMethod.GET,
    url: '/genres',
    opts: {
      auth: true,
    },
  }),
  /**
   * Returns a single genre record.
   *
   * @auth required
   *
   * @see [get-genre]{@link https://thetvdb.github.io/v4-api/#/Genres/getGenreBase}
   */
  get: new TvdbClientEndpoint<
    {
      id: number | string;
    },
    TvdbGenre
  >({
    method: HttpMethod.GET,
    url: '/genres/:id',
    opts: {
      auth: true,
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
};

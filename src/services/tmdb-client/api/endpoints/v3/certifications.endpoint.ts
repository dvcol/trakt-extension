import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TmdbCertification } from '~/models/tmdb/tmdb-entity.model';

import { TmdbClientEndpoint } from '~/models/tmdb/tmdb-client.model';

/**
 * Certifications v3 endpoints/
 */
export const certifications = {
  /**
   * Get an up to date list of the officially supported movie certifications on TMDB.
   *
   * @version 3
   *
   * @see [movie-certifications]{@link https://developer.themoviedb.org/reference/certification-movie-list}
   */
  movie: new TmdbClientEndpoint<
    Record<string, never>,
    {
      certifications: Record<string, TmdbCertification[]>;
    }
  >({
    method: HttpMethod.GET,
    url: '/certification/movie/list',
    opts: {
      version: 3,
    },
  }),
  /**
   * Get an up to date list of the officially supported TV show certifications on TMDb.
   *
   * @version 3
   *
   * @see [tv-certifications]{@link https://developer.themoviedb.org/reference/certifications-tv-list}
   */
  tv: new TmdbClientEndpoint<
    Record<string, never>,
    {
      certifications: Record<string, TmdbCertification[]>;
    }
  >({
    method: HttpMethod.GET,
    url: '/certification/tv/list',
    opts: {
      version: 3,
    },
  }),
};

import type { TvdbArtwork, TvdbArtworkExtended, TvdbArtworkType } from '~/models/tvdb/tvdb-artwork.model';

import type { Any, Entity } from '~/models/tvdb/tvdb-entity.model';

import { TvdbClientEndpoint } from '~/models/tvdb/tvdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Artwork endpoints
 *
 * @see [artwork]{@link https://thetvdb.github.io/v4-api/#/Artwork}
 */
export const artwork = {
  /**
   * Returns a single artwork base record.
   *
   * @auth required
   *
   * @see [artwork]{@link https://thetvdb.github.io/v4-api/#/Artwork/getArtworkBase}
   * @see [artwork-extended]{@link https://thetvdb.github.io/v4-api/#/Artwork/getArtworkExtended}
   */
  get: new TvdbClientEndpoint<
    {
      id: number | string;
      extended?: boolean | 'extended';
    },
    TvdbArtwork<Any>
  >({
    method: HttpMethod.GET,
    url: '/artwork/:id/:extended',
    opts: {
      auth: true,
      parameters: {
        path: {
          id: true,
          extended: false,
        },
      },
    },
    /** Coerce extended into string value */
    transform: params => ({ ...params, extended: params.extended ? 'extended' : undefined }),
  }),
  /**
   * Returns a single artwork base record.
   *
   * @auth required
   *
   * @see [artwork-extended]{@link https://thetvdb.github.io/v4-api/#/Artwork/getArtworkExtended}
   */
  extended: new TvdbClientEndpoint<
    {
      id: number | string;
    },
    TvdbArtworkExtended
  >({
    method: HttpMethod.GET,
    url: '/artwork/:id/extended',
    opts: {
      auth: true,
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  /**
   * Returns list of artwork status records.
   *
   * @auth required
   *
   * @see [artwork-statuses]{@link https://thetvdb.github.io/v4-api/#/Artwork%20Statuses/getAllArtworkStatuses}
   */
  statuses: new TvdbClientEndpoint<Record<string, never>, Entity[]>({
    method: HttpMethod.GET,
    url: '/artwork/statuses',
    opts: {
      auth: true,
    },
  }),
  /**
   * Returns list of artwork type records.
   *
   * @auth required
   *
   * @see [artwork-types]{@link https://thetvdb.github.io/v4-api/#/Artwork%20Types/getAllArtworkTypes}
   */
  types: new TvdbClientEndpoint<Record<string, never>, TvdbArtworkType>({
    method: HttpMethod.GET,
    url: '/artwork/types',
    opts: {
      auth: true,
    },
  }),
};

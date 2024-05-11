import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TmdbAlternativeNames, TmdbNetwork } from '~/models/tmdb/tmdb-entity.model';
import type { TmdbImages } from '~/models/tmdb/tmdb-image.model';

import { TmdbClientEndpoint } from '~/models/tmdb/tmdb-client.model';

/**
 * Networks v3 endpoints.
 */
export const networks = {
  /**
   * Get the details of a network by ID.
   *
   * @version 3
   *
   * @see [network-details]{@link https://developer.themoviedb.org/reference/network-details}
   */
  details: new TmdbClientEndpoint<
    {
      network_id: string | number;
    },
    TmdbNetwork
  >({
    method: HttpMethod.GET,
    url: '/network/:network_id',
    opts: {
      version: 3,
      parameters: {
        path: {
          network_id: true,
        },
      },
    },
  }),
  /**
   * Get the alternative names of a network.
   *
   * @version 3
   *
   * @see [network-alternative-names]{@link https://developer.themoviedb.org/reference/details-copy}
   */
  names: new TmdbClientEndpoint<
    {
      network_id: string | number;
    },
    TmdbAlternativeNames
  >({
    method: HttpMethod.GET,
    url: '/network/:network_id/alternative_names',
    opts: {
      version: 3,
      parameters: {
        path: {
          network_id: true,
        },
      },
    },
  }),
  /**
   * Get the TV network logos by id.
   *
   * * <b>Note</b>
   *
   * There are two image formats that are supported for companies, PNG's and SVG's.
   * You can see which type the original file is by looking at the file_type field.
   * We prefer SVG's as they are resolution independent and as such, the width and height are only there to reflect the original asset that was uploaded.
   * An SVG can be scaled properly beyond those dimensions if you call them as a PNG.
   *
   * @version 3
   *
   * @see [network-logos]{@link https://developer.themoviedb.org/reference/alternative-names-copy}
   */
  images: new TmdbClientEndpoint<
    {
      network_id: string | number;
    },
    TmdbImages
  >({
    method: HttpMethod.GET,
    url: '/network/:network_id/images',
    opts: {
      version: 3,
      parameters: {
        path: {
          network_id: true,
        },
      },
    },
  }),
};

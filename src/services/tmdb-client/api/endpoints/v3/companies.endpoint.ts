import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TmdbCompany } from '~/models/tmdb/tmdb-company.model';
import type { TmdbAlternativeNames } from '~/models/tmdb/tmdb-entity.model';
import type { TmdbImages } from '~/models/tmdb/tmdb-image.model';

import { TmdbClientEndpoint } from '~/models/tmdb/tmdb-client.model';

/**
 * Companies v3 endpoints.
 */
export const companies = {
  /**
   * Get a company by id.
   *
   * @version 3
   *
   * @see [company-details]{@link https://developer.themoviedb.org/reference/company-details}
   */
  details: new TmdbClientEndpoint<
    {
      company_id: number | string;
    },
    TmdbCompany
  >({
    method: HttpMethod.GET,
    url: '/company/:company_id',
    opts: {
      version: 3,
      parameters: {
        path: {
          company_id: true,
        },
      },
    },
  }),
  /**
   * Get a company alternative names by id.
   *
   * @version 3
   *
   * @see [company-alternative-names]{@link https://developer.themoviedb.org/reference/company-alternative-names}
   */
  names: new TmdbClientEndpoint<
    {
      company_id: number | string;
    },
    TmdbAlternativeNames
  >({
    method: HttpMethod.GET,
    url: '/company/:company_id/alternative_names',
    opts: {
      version: 3,
      parameters: {
        path: {
          company_id: true,
        },
      },
    },
  }),
  /**
   * Get the images for a company by id.
   *
   * * <b>Note:</b>
   *
   * There are two image formats that are supported for companies, PNG's and SVG's.
   * You can see which type the original file is by looking at the file_type field.
   * We prefer SVG's as they are resolution independent and as such, the width and height are only there to reflect the original asset that was uploaded.
   * An SVG can be scaled properly beyond those dimensions if you call them as a PNG.
   *
   * @version 3
   *
   * @see [company-images]{@link https://developer.themoviedb.org/reference/company-images}
   */
  images: new TmdbClientEndpoint<
    {
      company_id: number | string;
    },
    TmdbImages
  >({
    method: HttpMethod.GET,
    url: '/company/:company_id/images',
    opts: {
      version: 3,
      parameters: {
        path: {
          company_id: true,
        },
      },
    },
  }),
};

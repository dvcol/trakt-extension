import type { TmdbCollection, TmdbCollectionImages } from '~/models/tmdb/tmdb-collection.model';

import type { TmdbTranslations } from '~/models/tmdb/tmdb-translation.model';

import { TmdbClientEndpoint } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Collections v3 endpoints.
 */
export const collections = {
  /**
   * Get a collection by id.
   *
   * @version 3
   *
   * @see [collection-details]{@link https://developer.themoviedb.org/reference/collection-details}
   */
  details: new TmdbClientEndpoint<
    {
      collection_id: number | string;
      language?: string;
    },
    TmdbCollection
  >({
    method: HttpMethod.GET,
    url: '/collection/:collection_id',
    opts: {
      version: 3,
      parameters: {
        path: {
          collection_id: true,
        },
        query: {
          language: false,
        },
      },
    },
  }),
  /**
   * Get the images that belong to a collection.
   *
   * This method will return the backdrops and posters that have been added to a collection.
   *
   * * <b>Note</b>
   *
   * If you have a language specified, it will act as a filter on the returned items. You can use the include_image_language param to query additional languages.
   *
   * @version 3
   *
   * @see [collection-images]{@link https://developer.themoviedb.org/reference/collection-images}
   */
  images: new TmdbClientEndpoint<
    {
      collection_id: number | string;
      /** specify a comma separated list of ISO-639-1 values to query, for example: en,null */
      include_image_language?: string | string[];
      language?: string;
    },
    TmdbCollectionImages
  >({
    method: HttpMethod.GET,
    url: '/collection/:collection_id/images',
    opts: {
      version: 3,
      parameters: {
        path: {
          collection_id: true,
        },
        query: {
          include_image_language: false,
          language: false,
        },
      },
    },
    transform: params =>
      Array.isArray(params.include_image_language) ? { ...params, include_image_language: params.include_image_language.join(',') } : params,
  }),
  /**
   * Get the list of translations for a given collection.
   *
   * @version 3
   *
   * @see [collection-translations]{@link https://developer.themoviedb.org/reference/collection-translations}
   */
  translations: new TmdbClientEndpoint<
    {
      collection_id: number | string;
    },
    TmdbTranslations
  >({
    method: HttpMethod.GET,
    url: '/collection/:collection_id/translations',
    opts: {
      version: 3,
      parameters: {
        path: {
          collection_id: true,
        },
      },
    },
  }),
};

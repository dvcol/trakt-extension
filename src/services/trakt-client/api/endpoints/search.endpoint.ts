import { HttpMethod } from '@dvcol/base-http-client/utils/http';

import type { TraktIdLookup, TraktSearch, TraktSearchResult } from '~/models/trakt/trakt-search.model';

import { TraktApiExtended, TraktClientEndpoint } from '~/models/trakt/trakt-client.model';
import { TraktApiCommonFilterValues } from '~/services/trakt-client/api/trakt-api.filters';
import { TraktApiTransforms } from '~/services/trakt-client/api/trakt-api.transforms';

/**
 * Searches can use queries or ID lookups. Queries will search text fields like the title and overview.
 * ID lookups are helpful if you have an external ID and want to get the Trakt ID and info.
 * These methods can search for movies, shows, episodes, people, and lists.
 */
export const search = {
  /**
   * Search all text fields that a media object contains (i.e. title, overview, etc). Results are ordered by the most relevant score.
   * Specify the type of results by sending a single value or a comma delimited string for multiple types.
   *
   * * <b>Special Characters</b>
   *
   * Our search engine (Solr) gives the following characters special meaning when they appear in a query:
   *
   * <b>+ - && || ! ( ) { } [ ] ^ " ~ * ? : /</b>
   *
   * To interpret any of these characters literally (and not as a special character), precede the character with a backslash  <b> \ </b> character.
   *
   * * <b>Search Fields</b>
   *
   * By default, all text fields are used to search for the query. You can optionally specify the fields parameter with a single value or comma delimited string for multiple fields.
   * Each type has specific fields that can be specified. This can be useful if you want to support more strict searches (i.e. title only).
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @filters common - {@link TraktApiCommonFilters}
   *
   * @see [search-text-query]{@link https://trakt.docs.apiary.io/#reference/search/text-query/get-text-query-results}
   */
  text: new TraktClientEndpoint<TraktSearch, TraktSearchResult[]>({
    method: HttpMethod.GET,
    url: '/search/:type?query=&fields=',
    transform(params) {
      const _params = { ...params };
      if (params.type) _params.type = TraktApiTransforms.array.toString(params.type);
      if (params.fields) _params.fields = TraktApiTransforms.array.toString(params.fields);
      if (params.escape && params.query) _params.query = TraktApiTransforms.search.escape(params.query);
      return _params;
    },
    opts: {
      pagination: true,
      extended: [TraktApiExtended.Full],
      filters: TraktApiCommonFilterValues,
      parameters: {
        path: {
          type: false,
        },
        query: {
          query: true,
          fields: false,
        },
      },
    },
  }),
  /**
   * Lookup items by their Trakt, IMDB, TMDB, or TVDB ID. If you use the search url without a type it might return multiple items if the id_type is not globally unique.
   * Specify the type of results by sending a single value or a comma delimited string for multiple types.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   *
   * @see [get-id-lookup-results]{@link https://trakt.docs.apiary.io/#reference/search/id-lookup/get-id-lookup-results}
   */
  id: new TraktClientEndpoint<TraktIdLookup, TraktSearchResult[]>({
    method: HttpMethod.GET,
    url: '/search/:id_type/:id?type=',
    transform(params) {
      const _params = { ...params };
      if (params.type) _params.type = TraktApiTransforms.array.toString(params.type);
      return _params;
    },
    opts: {
      pagination: true,
      extended: [TraktApiExtended.Full],
      parameters: {
        path: {
          id_type: true,
          id: true,
        },
        query: {
          type: false,
        },
      },
    },
  }),
};

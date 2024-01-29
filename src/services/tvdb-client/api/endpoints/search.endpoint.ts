import type { TvdbSearch, TvdbSearchQuery } from '~/models/tvdb/tvdb-search.model';

import { TvdbClientEndpoint } from '~/models/tvdb/tvdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Search Endpoint
 *
 * @see [search]{@link https://thetvdb.github.io/v4-api/#/Search}
 */
export const search = {
  /**
   * Search index including series, movies, people, and companies. Search is limited to 5k results max.
   *
   * @auth required
   *
   * @see [search]{@link https://thetvdb.github.io/v4-api/#/Search/getSearchResults}
   */
  query: new TvdbClientEndpoint<TvdbSearchQuery, TvdbSearch[]>({
    method: HttpMethod.GET,
    url: '/search?query=&type=&year=&company=&country=&director=&language=&primaryType=&network=&remoteId=&offset=&limit=',
    opts: {
      auth: true,
      parameters: {
        query: {
          query: true,
          type: false,
          year: false,
          company: false,
          country: false,
          director: false,
          language: false,
          primaryType: false,
          network: false,
          remoteId: false,
          offset: false,
          limit: false,
        },
      },
    },
  }),
  /**
   * Search index including series, movies, people, and companies. Search is limited to 5k results max.
   * This endpoint  search specifically bu remote ids (imdb, tvdb, etc)
   *
   * @auth required
   *
   * @see [search-by-remote-id]{@link https://thetvdb.github.io/v4-api/#/Search/getSearchResultsByRemoteId}
   */
  remote: new TvdbClientEndpoint<
    {
      remoteId: string;
    },
    TvdbSearch[]
  >({
    method: HttpMethod.GET,
    url: '/search/remoteid/:remoteId',
    opts: {
      auth: true,
      parameters: {
        path: {
          remoteId: true,
        },
      },
    },
  }),
};

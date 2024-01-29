import type { TvdbStatus } from '~/models/tvdb/tvdb-entity.model';
import type { TvdbEpisode } from '~/models/tvdb/tvdb-episode.model';
import type { TvdbSeries, TvdbSeriesExtended, TvdbSeriesQuery, TvdbSeriesShort } from '~/models/tvdb/tvdb-series.model';

import type { TvdbTranslation } from '~/models/tvdb/tvdb-translation.model';

import { TvdbClientEndpoint, type TvdbPaginatedData, type TvdbParamPagination } from '~/models/tvdb/tvdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Endpoints for series
 *
 * @see [API Documentation]{@link https://thetvdb.github.io/v4-api/#/Series}
 */
export const series = {
  /**
   * Returns a paginated list of series records.
   *
   * @auth required
   *
   * @see [get-all-series]{@link https://thetvdb.github.io/v4-api/#/Series/getAllSeries}
   */
  list: new TvdbClientEndpoint<TvdbParamPagination, TvdbPaginatedData<TvdbSeriesShort>>({
    method: HttpMethod.GET,
    url: '/series?page=',
    opts: {
      auth: true,
      parameters: {
        query: {
          page: false,
        },
      },
    },
  }),
  /**
   * Returns a single series record.
   *
   * @auth required
   *
   * @see [get-series]{@link https://thetvdb.github.io/v4-api/#/Series/getSeriesBase}
   */
  get: new TvdbClientEndpoint<
    {
      id: number | string;
    },
    TvdbSeriesShort
  >({
    method: HttpMethod.GET,
    url: '/series/:id',
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
   * Returns a series' artworks base on language and type.
   * Note: Artwork type is an id that can be found using /artwork/types endpoint.
   *
   * @auth required
   *
   * @see [get-series-artworks]{@link https://thetvdb.github.io/v4-api/#/Series/getSeriesArtworks}
   */
  artworks: new TvdbClientEndpoint<
    {
      id: number | string;
      lang?: string;
      type?: number;
    },
    TvdbSeriesExtended
  >({
    method: HttpMethod.GET,
    url: '/series/:id/artworks?lang=:lang&type=:type',
    opts: {
      auth: true,
      parameters: {
        path: {
          id: true,
        },
        query: {
          lang: false,
          type: false,
        },
      },
    },
  }),
  /**
   * Returns series base record including the nextAired field.
   *
   * Note: nextAired was included in the base record endpoint but that field will deprecated in the future so developers should use the nextAired endpoint.
   *
   * @auth required
   *
   * @see [get-series-next-aired]{@link https://thetvdb.github.io/v4-api/#/Series/getSeriesNextAired}
   */
  next: new TvdbClientEndpoint<
    {
      id: number | string;
    },
    TvdbSeriesShort & {
      nextAired: string;
    }
  >({
    method: HttpMethod.GET,
    url: '/series/:id/nextAired',
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
   * Returns an extended series record.
   *
   * @auth required
   *
   * @see [get-series-extended]{@link https://thetvdb.github.io/v4-api/#/Series/getSeriesExtended}
   */
  extended: new TvdbClientEndpoint<
    {
      id: number | string;
      /** The meta field can be used to request translations or episodes. */
      meta?: 'translations' | 'episodes';
      /** This reduce the payload and returns the shorten version of this record without characters, artworks and trailers. */
      short?: boolean;
    },
    TvdbSeriesExtended
  >({
    method: HttpMethod.GET,
    url: '/series/:id/extended?meta=&short=',
    opts: {
      auth: true,
      parameters: {
        path: {
          id: true,
        },
        query: {
          meta: false,
          short: false,
        },
      },
    },
  }),
  episodes: {
    /**
     * Returns a paginated list of series episodes from the specified season type.
     * Default returns the episodes in the series default season type?
     *
     * @auth required
     *
     * @see [get-series-episodes]{@link https://thetvdb.github.io/v4-api/#/Series/getSeriesEpisodes}
     */
    type: new TvdbClientEndpoint<
      {
        id: number | string;
        seasonType: 'default' | 'official' | 'dvd' | 'absolute' | 'alternate' | 'regional';
        page?: number;
        season?: number;
        episodeNumber?: number;
        /** airDate of the episode, format is yyyy-mm-dd */
        airDate?: string;
      },
      {
        series: TvdbSeries;
        episodes: TvdbEpisode[];
      }
    >({
      method: HttpMethod.GET,
      url: '/series/:id/episodes/:seasonType?page=&season=&episodeNumber=&airDate=',
      opts: {
        auth: true,
        parameters: {
          path: {
            id: true,
            seasonType: true,
          },
          query: {
            page: false,
            season: false,
            episodeNumber: false,
            airDate: false,
          },
        },
      },
    }),
    /**
     * Returns the series base record with episodes from the specified season type and language.
     * Default returns the episodes in the series default season type.
     * @auth required
     *
     * @see [get-series-episodes-translated]{@link https://thetvdb.github.io/v4-api/#/Series/getSeriesSeasonEpisodesTranslated}
     */
    lang: new TvdbClientEndpoint<
      {
        id: number | string;
        lang: string;
        seasonType: 'default' | 'official' | 'dvd' | 'absolute' | 'alternate' | 'regional';
        page?: number;
      },
      TvdbSeries
    >({
      method: HttpMethod.GET,
      url: '/series/:id/episodes/:seasonType/:lang?page=',
      opts: {
        auth: true,
        parameters: {
          path: {
            id: true,
            lang: true,
            seasonType: true,
          },
          query: {
            page: false,
          },
        },
      },
    }),
  },
  /**
   * Search series based on filter parameters
   *
   * @auth required
   *
   * @see [get-series-filter]{@link https://thetvdb.github.io/v4-api/#/Series/getSeriesFilter}
   */
  filter: new TvdbClientEndpoint<TvdbSeriesQuery, TvdbSeries[]>({
    method: HttpMethod.GET,
    url: '/series/filter?company=&contentRating=&country=&genre=&lang=&sort=&sortType=&status=&year=',
    opts: {
      auth: true,
      parameters: {
        query: {
          company: false,
          contentRating: false,
          country: false,
          genre: false,
          lang: false,
          sort: false,
          sortType: false,
          status: false,
          year: false,
        },
      },
    },
  }),
  /**
   * Returns a series record that match the provided slug.
   *
   * @auth required
   *
   * @see [get-series-by-slug]{@link https://thetvdb.github.io/v4-api/#/Series/getSeriesBaseBySlug}
   */
  slug: new TvdbClientEndpoint<
    {
      slug: string;
    },
    TvdbSeries
  >({
    method: HttpMethod.GET,
    url: '/series/slug/:slug',
    opts: {
      auth: true,
      parameters: {
        path: {
          slug: true,
        },
      },
    },
  }),
  /**
   * Returns a series translation record.
   *
   * @auth required
   *
   * @see [get-series-translation]{@link https://thetvdb.github.io/v4-api/#/Series/getSeriesTranslation}
   */
  translations: new TvdbClientEndpoint<
    {
      id: number | string;
      language: string;
    },
    TvdbTranslation
  >({
    method: HttpMethod.GET,
    url: '/series/:id/translations/:language',
    opts: {
      auth: true,
      parameters: {
        path: {
          id: true,
          language: true,
        },
      },
    },
  }),
  /**
   * Returns a list of series status records.
   *
   * @auth required
   *
   * @see [get-series-statuses]{@link https://thetvdb.github.io/v4-api/#/Series%20Statuses/getAllSeriesStatuses}
   */
  statuses: new TvdbClientEndpoint<Record<string, never>, TvdbStatus[]>({
    method: HttpMethod.GET,
    url: '/series/statuses',
    opts: {
      auth: true,
    },
  }),
};

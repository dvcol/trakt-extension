import type { TvdbCharacter } from '~/models/tvdb/tvdb-character.model';

import type { TvdbCountry } from '~/models/tvdb/tvdb-country.model';
import type { Entity, EntityExtended } from '~/models/tvdb/tvdb-entity.model';
import type { TvdbInspiration } from '~/models/tvdb/tvdb-inspiration.model';
import type { TvdbLanguage } from '~/models/tvdb/tvdb-language.model';
import type { TvdbRating } from '~/models/tvdb/tvdb-rating.model';

import type { TvdbSourceType } from '~/models/tvdb/tvdb-source.model';

import type { TvdbUpdate, TvdbUpdateTypes } from '~/models/tvdb/tvdb-update.model';

import { TvdbClientEndpoint, type TvdbPaginatedData } from '~/models/tvdb/tvdb-client.model';
import { artwork } from '~/services/tvdb-client/api/endpoints/artwork.endpoint';
import { awards } from '~/services/tvdb-client/api/endpoints/awards.endpoint';
import { companies } from '~/services/tvdb-client/api/endpoints/companies.endpoint';
import { episodes } from '~/services/tvdb-client/api/endpoints/episodes.endpoint';
import { favorites } from '~/services/tvdb-client/api/endpoints/favorites.endpoint';
import { genres } from '~/services/tvdb-client/api/endpoints/genres.endpoint';
import { lists } from '~/services/tvdb-client/api/endpoints/lists.endpoint';
import { movies } from '~/services/tvdb-client/api/endpoints/movies.endpoint';
import { people } from '~/services/tvdb-client/api/endpoints/people.endpoints';
import { search } from '~/services/tvdb-client/api/endpoints/search.endpoint';
import { seasons } from '~/services/tvdb-client/api/endpoints/seasons.endpoint';
import { series } from '~/services/tvdb-client/api/endpoints/series.endpoint';
import { user } from '~/services/tvdb-client/api/endpoints/user.endpoint';
import { HttpMethod } from '~/utils/http.utils';

/**
 * @see [documentation]{@link https://thetvdb.github.io/v4-api/#/Login/post_login}
 */
export const tvdbApi = {
  /**
   * Create an auth token. The token has one month validation length.
   *
   * @see [login]{@link https://thetvdb.github.io/v4-api/#/Login}
   */
  login: new TvdbClientEndpoint<
    {
      apiKey: string;
      pin?: string;
    },
    {
      token: string;
    },
    false
  >({
    method: HttpMethod.POST,
    url: '/login',
    opts: {
      cache: false,
    },
    body: {
      apiKey: true,
      pin: false,
    },
  }),
  artwork,
  awards,
  /**
   * Returns character base records.
   *
   * @auth required
   *
   * @see [characters]{@link https://thetvdb.github.io/v4-api/#/Characters/getCharacterBase}
   */
  characters: new TvdbClientEndpoint<
    {
      id: number | string;
    },
    TvdbCharacter
  >({
    method: HttpMethod.GET,
    url: '/characters/:id',
    opts: {
      auth: true,
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
  companies,
  /**
   * Content Ratings Endpoint
   *
   * @see [content-ratings]{@link https://thetvdb.github.io/v4-api/#/Content%20Ratings}
   */
  content: {
    /**
     * Returns a list of content ratings records.
     *
     * @auth required
     *
     * @see [get-content-ratings]{@link https://thetvdb.github.io/v4-api/#/Content%20Ratings/getAllContentRatings
     */
    ratings: new TvdbClientEndpoint<Record<string, never>, TvdbRating[]>({
      method: HttpMethod.GET,
      url: '/content/ratings',
      opts: {
        auth: true,
      },
    }),
  },
  /**
   * Returns a list of countries records.
   *
   * @auth required
   *
   * @see [get-countries]{@link https://thetvdb.github.io/v4-api/#/Countries/getAllCountries}
   */
  countries: new TvdbClientEndpoint<Record<string, never>, TvdbCountry[]>({
    method: HttpMethod.GET,
    url: '/countries',
    opts: {
      auth: true,
    },
  }),
  /**
   * Returns a list of entity types records.
   *
   * @auth required
   *
   * @see [get-entity-types]{@link https://thetvdb.github.io/v4-api/#/Entity%20Types/getEntityTypes}
   */
  entities: new TvdbClientEndpoint<Record<string, never>, EntityExtended[]>({
    method: HttpMethod.GET,
    url: '/entities',
    opts: {
      auth: true,
    },
  }),
  episodes,
  /**
   * Returns a list of gender records.
   *
   * @auth required
   *
   * @see [get-all-genders]{@link https://thetvdb.github.io/v4-api/#/Genders/getAllGenders}
   */
  genders: new TvdbClientEndpoint<Record<string, never>, Entity[]>({
    method: HttpMethod.GET,
    url: '/genders',
    opts: {
      auth: true,
    },
  }),
  genres,
  /**
   * Inspiration endpoints.
   *
   * @see [inspiration]{@link https://thetvdb.github.io/v4-api/#/InspirationTypes}
   */
  inspiration: {
    /**
     * Returns a list of inspiration types records.
     *
     * @auth required
     *
     * @see [get-inspiration-types]{@link https://thetvdb.github.io/v4-api/#/InspirationTypes/getAllInspirationTypes}
     */
    types: new TvdbClientEndpoint<Record<string, never>, TvdbInspiration[]>({
      method: HttpMethod.GET,
      url: '/inspiration/types',
      opts: {
        auth: true,
      },
    }),
  },
  /**
   * Returns a list of language records.
   *
   * @auth required
   *
   * @see [get-all-languages]{@link https://thetvdb.github.io/v4-api/#/Languages/getAllLanguages}
   */
  languages: new TvdbClientEndpoint<Record<string, never>, TvdbLanguage[]>({
    method: HttpMethod.GET,
    url: '/languages',
    opts: {
      auth: true,
    },
  }),
  lists,
  movies,
  people,
  search,
  seasons,
  series,
  /**
   * Returns a list of source types records.
   *
   * @auth required
   *
   * @see [get-source-types]{@link https://thetvdb.github.io/v4-api/#/Source%20Types/getAllSourceTypes}
   */
  source: new TvdbClientEndpoint<Record<string, never>, TvdbSourceType[]>({
    method: HttpMethod.GET,
    url: '/source/types',
    opts: {
      auth: true,
    },
  }),
  /**
   * Returns a paginated list of updated entities.
   * methodInt indicates a created record (1), an updated record (2), or a deleted record (3).
   * If a record is deleted because it was a duplicate of another record, the target record's information is provided in mergeToType and mergeToId.
   *
   * @auth required
   *
   * @see [get-updates]{@link https://thetvdb.github.io/v4-api/#/Updates/updates}
   */
  updates: new TvdbClientEndpoint<
    {
      since: number;
      type?: TvdbUpdateTypes;
      action?: string;
      page?: number;
    },
    TvdbPaginatedData<TvdbUpdate>
  >({
    method: HttpMethod.GET,
    url: '/updates?since=&type=&action=page=',
    opts: {
      auth: true,
      parameters: {
        query: {
          since: true,
          type: false,
          page: false,
          action: false,
        },
      },
    },
  }),
  user,
  favorites,
};

import type { TvdbFavorite, TvdbFavorites } from '~/models/tvdb/tvdb-favorite.model';

import { TvdbClientEndpoint } from '~/models/tvdb/tvdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Favorites API endpoints.
 *
 * @see [favorites]{@link https://thetvdb.github.io/v4-api/#/Favorite}
 */
export const favorites = {
  /**
   * Returns a list of user favorites.
   *
   * @auth required
   *
   * @see [get-user-favorites]{@link https://thetvdb.github.io/v4-api/#/Favorites/getUserFavorites}
   */
  get: new TvdbClientEndpoint<Record<string, never>, TvdbFavorites>({
    method: HttpMethod.GET,
    url: '/user/favorites',
    opts: {
      auth: true,
    },
  }),
  /**
   * Adds a favorite to the user's favorites.
   *
   * @auth required
   *
   * @see [create-user-favorite]{@link https://thetvdb.github.io/v4-api/#/Favorites/createUserFavorites}
   */
  add: new TvdbClientEndpoint<Record<string, never>, TvdbFavorite, false>({
    method: HttpMethod.POST,
    url: '/user/favorites',
    opts: {
      auth: true,
      cache: false,
    },
    body: {
      series: false,
      movie: false,
      episode: false,
      artwork: false,
      people: false,
      list: false,
    },
  }),
};

import type { TmdbApiResponse } from '~/models/tmdb/tmdb-client.model';
import type { TraktAuthenticationApprove } from '~/models/trakt/trakt-authentication.model';
import type { TraktApiResponse } from '~/models/trakt/trakt-client.model';
import type { TraktCollectionGetQuery } from '~/models/trakt/trakt-collection.model';
import type { TraktHistoryGetQuery } from '~/models/trakt/trakt-history.model';
import type { TraktList, TraktListItemsGetQuery } from '~/models/trakt/trakt-list.model';
import type { TraktWatchlistGetQuery } from '~/models/trakt/trakt-watchlist.model';
import type { SettingsAuth, UserSetting } from '~/models/trakt-service.model';
import type { TvdbApiResponse } from '~/models/tvdb/tvdb-client.model';

import { LoadingBarService } from '~/services/loading-bar.service';
import { tmdbApi } from '~/services/tmdb-client/api/tmdb-api.endpoints';
import { TmdbClient } from '~/services/tmdb-client/clients/tmdb-client';
import { traktApi } from '~/services/trakt-client/api/trakt-api.endpoints';
import { TraktClient } from '~/services/trakt-client/clients/trakt-client';
import { tvdbApi } from '~/services/tvdb-client/api/tvdb-api.endpoints';
import { TvdbClient } from '~/services/tvdb-client/clients/tvdb-client';
import { tmdbClientSettings } from '~/settings/tmdb.api';
import { traktClientSettings } from '~/settings/traktv.api';
import { tvdbClientSettings } from '~/settings/tvdb.api';
import { useAuthSettingsStore } from '~/stores/settings/auth.store';
import { useUserSettingsStore } from '~/stores/settings/user.store';
import { createTab } from '~/utils/browser/browser.utils';
import { CacheRetention, ChromeCacheStore } from '~/utils/cache.utils';

export class TraktService {
  private static traktClient: TraktClient;
  private static tmdbClient: TmdbClient;
  private static tvdbClient: TvdbClient;

  private static caches: {
    trakt: ChromeCacheStore<TraktApiResponse>;
    tmdb: ChromeCacheStore<TmdbApiResponse>;
    tvdb: ChromeCacheStore<TvdbApiResponse>;
  };

  static get auth() {
    return {
      trakt: this.traktClient.auth,
      tvdb: this.tvdbClient.auth,
      tmdb: this.tmdbClient.auth,
    };
  }

  static get isStaging() {
    return this.traktClient.isStaging;
  }

  static {
    this.caches = {
      trakt: new ChromeCacheStore<TraktApiResponse>({ prefix: 'trakt-cache' }),
      tvdb: new ChromeCacheStore<TvdbApiResponse>({
        prefix: 'tvdb-cache',
        retention: CacheRetention.Year,
      }),
      tmdb: new ChromeCacheStore<TmdbApiResponse>({
        prefix: 'tmdb-cache',
        retention: CacheRetention.Year,
      }),
    };

    this.traktClient = new TraktClient({ ...traktClientSettings, cacheStore: this.caches.trakt }, {}, traktApi);
    this.tvdbClient = new TvdbClient({ ...tvdbClientSettings, cacheStore: this.caches.tvdb }, {}, tvdbApi);
    this.tmdbClient = new TmdbClient({ ...tmdbClientSettings, cacheStore: this.caches.tmdb }, {}, tmdbApi);
  }

  static changeUser(user: string) {
    this.caches.trakt.prefix = `trakt-cache-${user}`;
    this.caches.tvdb.prefix = `tvdb-cache-${user}`;
  }

  private static async saveAuth(
    auth: SettingsAuth = this.auth,
    prev: SettingsAuth = useAuthSettingsStore().auth,
  ): Promise<{ auth: SettingsAuth; settings: UserSetting }> {
    if (JSON.stringify(auth) === JSON.stringify(prev)) return { settings: useUserSettingsStore().userSetting, auth };

    if (auth.trakt?.access_token && auth.trakt?.access_token !== prev?.trakt?.access_token) {
      const settingsResponse = await this.traktClient.users.settings();
      const settings: UserSetting = await settingsResponse.json();
      settings.isStaging = this.traktClient.isStaging;
      await useUserSettingsStore().setUserSetting(settings);
      await useAuthSettingsStore().setAuth(auth);
      return { settings, auth };
    }

    await useAuthSettingsStore().setAuth(auth);
    return { settings: useUserSettingsStore().userSetting, auth };
  }

  static async importAuthentication({ trakt, tvdb, tmdb }: SettingsAuth = {}): Promise<{
    auth: SettingsAuth;
    settings: UserSetting;
  }> {
    const promises = [];
    if (trakt) promises.push(this.traktClient.importAuthentication(trakt).then(_auth => console.info('Trakt import', _auth)));
    if (tvdb) promises.push(this.tvdbClient.importAuthentication(tvdb).then(_auth => console.info('Tvdb import', _auth)));
    if (tmdb) console.info('TmdbClient.importAuthentication', this.tmdbClient.importAuthentication(tmdb));
    await Promise.all(promises);
    return this.saveAuth({ trakt, tvdb, tmdb });
  }

  static async approve(params: TraktAuthenticationApprove = {}) {
    const url = this.traktClient
      .redirectToAuthenticationUrl(params)
      .replace(`${traktClientSettings.corsProxy}/${traktClientSettings.corsPrefix}`, traktClientSettings.endpoint);
    return createTab({ url });
  }

  static async login(token: string): Promise<{ auth: SettingsAuth; settings: UserSetting }> {
    const trakt = await this.traktClient.exchangeCodeForToken(token);
    const tvdb = await this.tvdbClient.authenticate();

    return this.saveAuth({ trakt, tvdb });
  }

  static async logout(account?: string) {
    await useAuthSettingsStore().setAuth(undefined, account);
    await useUserSettingsStore().setUserSetting(undefined, account);
  }

  static listen() {
    this.traktClient.onAuthChange(async _auth => {
      console.info('TraktClient.onAuthChange', { ..._auth });
    });

    this.traktClient.onCall(async call => {
      console.info('TraktClient.onCall', call);

      const timeout = setTimeout(() => LoadingBarService.start(), 500);
      try {
        await call.query;
        LoadingBarService.finish();
      } catch (error) {
        LoadingBarService.error();
        throw error;
      } finally {
        clearTimeout(timeout);
      }
    });

    this.tvdbClient.onAuthChange(async _auth => {
      console.info('TvdbClient.onAuthChange', { ..._auth });
    });

    this.tvdbClient.onCall(async call => {
      console.info('TvdbClient.onCall', call);
    });

    this.tmdbClient.onAuthChange(async _auth => {
      console.info('TmdbClient.onAuthChange', { ..._auth });
    });

    this.tmdbClient.onCall(async call => {
      console.info('TmdbClient.onCall', call);
    });
  }

  static async tmdbConfiguration() {
    const response = await this.tmdbClient.v3.configuration.details.cached();
    return response.json();
  }

  static posters = {
    async movie(movie_id: string | number) {
      const response = await TraktService.tmdbClient.v3.movies.images.cached({
        movie_id,
      });
      return response.json();
    },

    async show(series_id: string | number) {
      const response = await TraktService.tmdbClient.v3.shows.images.cached({
        series_id,
      });
      return response.json();
    },

    async season(series_id: string | number, season_number: number) {
      const response = await TraktService.tmdbClient.v3.seasons.images.cached({
        series_id,
        season_number,
      });
      return response.json();
    },

    async episode(series_id: string | number, season_number: number, episode_number: number) {
      const response = await TraktService.tmdbClient.v3.episodes.images.cached({
        series_id,
        season_number,
        episode_number,
      });
      return response.json();
    },
  };

  static async history(query: TraktHistoryGetQuery) {
    const response = await this.traktClient.sync.history.get.cached(query);
    return { data: await response.json(), pagination: response.pagination };
  }

  static async watchlist(query: TraktWatchlistGetQuery) {
    const response = await this.traktClient.sync.watchlist.get.cached(query);
    return { data: await response.json(), pagination: response.pagination };
  }

  static async collection(query: TraktCollectionGetQuery) {
    const response = await this.traktClient.sync.collection.get.cached(query);
    return { data: await response.json(), pagination: response.pagination };
  }

  static async lists(userId: string, collaboration?: boolean) {
    let response: TraktApiResponse<TraktList[]>;
    if (collaboration) {
      response = await this.traktClient.users.lists.collaborations.cached({ id: userId });
    } else {
      response = await this.traktClient.users.lists.get.cached({ id: userId });
    }
    return response.json();
  }

  static async list(query: TraktListItemsGetQuery) {
    const response = await this.traktClient.users.list.items.get.cached(query);
    return { data: await response.json(), pagination: response.pagination };
  }
}

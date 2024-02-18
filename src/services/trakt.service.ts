import type { TmdbApiResponse } from '~/models/tmdb/tmdb-client.model';

import type { TraktApiResponse } from '~/models/trakt/trakt-client.model';
import type { SettingsAuth, UserSetting } from '~/models/trakt-service.model';
import type { TvdbApiResponse } from '~/models/tvdb/tvdb-client.model';

import { LoadingBarService } from '~/services/loading-bar.service';
import { TmdbClient } from '~/services/tmdb-client/clients/tmdb-client';
import { traktApi } from '~/services/trakt-client/api/trakt-api.endpoints';
import { TraktClient } from '~/services/trakt-client/clients/trakt-client';
import { TvdbClient } from '~/services/tvdb-client/clients/tvdb-client';
import { tmdbClientSettings } from '~/settings/tmdb.api';
import { traktClientSettings } from '~/settings/traktv.api';
import { tvdbClientSettings } from '~/settings/tvdb.api';
import { useAuthSettingsStore } from '~/stores/settings/auth.store';
import { useUserSettingsStore } from '~/stores/settings/user.store';
import { ChromeCacheStore } from '~/utils/cache.utils';

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
      tvdb: new ChromeCacheStore<TvdbApiResponse>({ prefix: 'tvdb-cache' }),
      tmdb: new ChromeCacheStore<TmdbApiResponse>({ prefix: 'tmdb-cache' }),
    };

    this.traktClient = new TraktClient({ ...traktClientSettings, cacheStore: this.caches.trakt }, {}, traktApi);
    this.tvdbClient = new TvdbClient({ ...tvdbClientSettings, cacheStore: this.caches.tvdb });
    this.tmdbClient = new TmdbClient({ ...tmdbClientSettings, cacheStore: this.caches.tmdb });
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

  static async importAuthentication({ trakt, tvdb, tmdb }: SettingsAuth = {}): Promise<{ auth: SettingsAuth; settings: UserSetting }> {
    const promises = [];
    if (trakt) promises.push(this.traktClient.importAuthentication(trakt).then(_auth => console.info('Trakt import', _auth)));
    if (tvdb) promises.push(this.tvdbClient.importAuthentication(tvdb).then(_auth => console.info('Tvdb import', _auth)));
    if (tmdb) console.info('TmdbClient.importAuthentication', this.tmdbClient.importAuthentication(tmdb));
    await Promise.all(promises);
    return this.saveAuth({ trakt, tvdb, tmdb });
  }

  static async approve(redirect_uri?: string) {
    return this.traktClient.redirectToAuthentication({ redirect_uri });
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
}

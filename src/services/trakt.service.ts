import { type BaseCacheOption, type CacheResponse, getCachedFunction, type TypedResponse } from '@dvcol/base-http-client';

import { CacheRetention } from '@dvcol/base-http-client/utils/cache';

import { TmdbClient } from '@dvcol/tmdb-http-client';
import { isResponseOk, TraktClient } from '@dvcol/trakt-http-client';
import { TvdbClient } from '@dvcol/tvdb-http-client';

import type { CancellablePromise } from '@dvcol/base-http-client/utils/fetch';
import type { TmdbApiResponse } from '@dvcol/tmdb-http-client/models';
import type {
  TraktApiResponse,
  TraktAuthenticationApprove,
  TraktCalendarQuery,
  TraktCollection,
  TraktCollectionGetQuery,
  TraktCollectionProgress,
  TraktCollectionRequest,
  TraktEpisodeExtended,
  TraktEpisodeShort,
  TraktFavoriteGetQuery,
  TraktFavoriteRequest,
  TraktHistoryGetQuery,
  TraktHistoryRemovedRequest,
  TraktHistoryRequest,
  TraktList,
  TraktListItemsGetQuery,
  TraktMovieExtended,
  TraktPersonExtended,
  TraktSearch,
  TraktSeasonExtended,
  TraktShowExtended,
  TraktSyncRequest,
  TraktUserListItemAddedRequest,
  TraktUserListItemRemoveRequest,
  TraktWatched,
  TraktWatchedProgress,
  TraktWatchlistGetQuery,
} from '@dvcol/trakt-http-client/models';

import type { TvdbApiResponse } from '@dvcol/tvdb-http-client/models';
import type { ProgressItem } from '~/models/progress.model';
import type { SettingsAuth, UserSetting } from '~/models/trakt-service.model';

import { LoadingBarService } from '~/services/loading-bar.service';
import { tmdbUsedApi } from '~/services/tmdb.used.api';
import { traktUsedApi } from '~/services/trakt-used.api';
import { tmdbClientSettings } from '~/settings/tmdb.api';
import { traktClientSettings } from '~/settings/traktv.api';
import { tvdbClientSettings } from '~/settings/tvdb.api';
import { useAuthSettingsStore } from '~/stores/settings/auth.store';
import { logger } from '~/stores/settings/log.store';
import { useUserSettingsStore } from '~/stores/settings/user.store';
import { createTab } from '~/utils/browser/browser.utils';
import { CachePrefix, ChromeCacheStore } from '~/utils/cache.utils';

export const shouldEvict = (date?: string | number | Date, cache?: CacheResponse<unknown>): boolean => {
  // no cache skip
  if (!cache?.evict) return false;
  // cached today skip
  if (cache?.current?.cachedAt) {
    const _cachedAt = new Date(cache.current.cachedAt).toLocaleDateString();
    const _today = new Date().toLocaleDateString();
    if (_cachedAt === _today) return false;
  }
  // no date, force evict
  if (date === undefined) return true;
  // date in the future, force evict
  return new Date(date) > new Date();
};

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
      trakt: new ChromeCacheStore<TraktApiResponse>({
        prefix: CachePrefix.Trakt,
        retention: CacheRetention.Week,
      }),
      tvdb: new ChromeCacheStore<TvdbApiResponse>({
        prefix: CachePrefix.Tvdb,
        retention: CacheRetention.Year,
      }),
      tmdb: new ChromeCacheStore<TmdbApiResponse>({
        prefix: CachePrefix.Tmdb,
        retention: CacheRetention.Year,
      }),
    };

    this.traktClient = new TraktClient({ ...traktClientSettings, cacheStore: this.caches.trakt }, {}, traktUsedApi);
    this.tmdbClient = new TmdbClient({ ...tmdbClientSettings, cacheStore: this.caches.tmdb }, {}, tmdbUsedApi);
    this.tvdbClient = new TvdbClient({ ...tvdbClientSettings, cacheStore: this.caches.tvdb });
  }

  static changeUser(user: string) {
    this.caches.trakt.prefix = `trakt-cache-${user}`;
    this.caches.tvdb.prefix = `tvdb-cache-${user}`;
  }

  static async getUserSettings() {
    const response = await this.traktClient.users.settings();
    return response.json();
  }

  static changeRetention({ trakt, tvdb, tmdb }: { trakt?: number; tvdb?: number; tmdb?: number }) {
    if (trakt !== undefined) this.caches.trakt.retention = trakt;
    if (tvdb !== undefined) this.caches.tvdb.retention = tvdb;
    if (tmdb !== undefined) this.caches.tmdb.retention = tmdb;
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
    if (trakt) promises.push(this.traktClient.importAuthentication(trakt));
    if (tvdb) promises.push(this.tvdbClient.importAuthentication(tvdb));
    if (tmdb) this.tmdbClient.importAuthentication(tmdb);
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

  static async loadingBar<T>(query: Promise<T> | CancellablePromise<T>) {
    const timeout = setTimeout(() => LoadingBarService.start(), 500);
    try {
      await query;
      LoadingBarService.finish();
    } catch (error) {
      LoadingBarService.error();
    } finally {
      clearTimeout(timeout);
    }
  }

  static listen() {
    this.traktClient.onAuthChange(async _auth => {
      logger.debug('TraktClient.onAuthChange', { ..._auth });
    });

    this.traktClient.onCall(async call => {
      logger.debug('TraktClient.onCall', call);
      await this.loadingBar(call.query);
    });

    this.tvdbClient.onAuthChange(async _auth => {
      logger.debug('TvdbClient.onAuthChange', { ..._auth });
    });

    this.tvdbClient.onCall(async call => {
      logger.debug('TvdbClient.onCall', call);
    });

    this.tmdbClient.onAuthChange(async _auth => {
      logger.debug('TmdbClient.onAuthChange', { ..._auth });
    });

    this.tmdbClient.onCall(async call => {
      logger.debug('TmdbClient.onCall', call);
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

    async person(person_id: string | number) {
      const response = await TraktService.tmdbClient.v3.people.images.cached({
        person_id,
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

  static async favorites(query: TraktFavoriteGetQuery) {
    const response = await this.traktClient.sync.favorites.get.cached(query);
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

  static async calendar(query: TraktCalendarQuery, type: 'movies' | 'shows' = 'shows', variant?: 'new' | 'premieres' | 'finales') {
    if (type === 'movies') {
      const response = await this.traktClient.calendars.my.movies.cached(query, { cache: 'reload' });
      return response.json();
    }
    if (variant === 'new') {
      const response = await this.traktClient.calendars.my.shows.new.cached(query, { cache: 'reload' });
      return response.json();
    }
    if (variant === 'premieres') {
      const response = await this.traktClient.calendars.my.shows.premieres.cached(query, { cache: 'reload' });
      return response.json();
    }
    if (variant === 'finales') {
      const response = await this.traktClient.calendars.my.shows.finales.cached(query, { cache: 'reload' });
      return response.json();
    }
    const response = await this.traktClient.calendars.my.shows.get.cached(query, { cache: 'reload' });
    return response.json();
  }

  static async search(query: TraktSearch) {
    const response = await this.traktClient.search.text.cached(query, undefined, { retention: CacheRetention.Day });
    return { data: await response.json(), pagination: response.pagination };
  }

  private static cachedProgress = getCachedFunction(
    // @ts-expect-error -- CancellablePromise extends promise
    async (): CancellablePromise<TypedResponse<ProgressItem[]>> => {
      const response = await fetch('https://trakt.tv/dashboard/on_deck', {
        credentials: 'include',
      });

      isResponseOk(response);

      const htmlString = await response.text();
      const htmlDoc = new DOMParser().parseFromString(htmlString, 'text/html');
      const data = Array.from(htmlDoc.querySelectorAll<HTMLAnchorElement>('a[class="watch"]')).map(
        a => ({ ...a.dataset }) as unknown as ProgressItem,
      );

      return new Response(JSON.stringify(data)) as TypedResponse<ProgressItem[]>;
    },
    {
      cache: this.caches.trakt,
      retention: CacheRetention.Hour * 2,
      key: JSON.stringify({
        template: {
          method: 'GET',
          url: 'https://trakt.tv/dashboard/on_deck',
        },
        init: {
          credentials: 'include',
        },
      }),
    },
  );

  static progress = {
    async onDeck() {
      const call = TraktService.cachedProgress();
      TraktService.loadingBar(call).catch(); // ignore loading error
      const response = await call;
      if (!response.ok) throw response;
      return response.json();
    },

    show: {
      async watched(showId: string | number, cacheOption?: BaseCacheOption) {
        const response = await TraktService.traktClient.shows.progress.watched.cached(
          { id: showId, specials: true, count_specials: true },
          undefined,
          cacheOption,
        );
        return response.json() as Promise<TraktWatchedProgress>;
      },

      async collection(showId: string | number, cacheOption?: BaseCacheOption) {
        const response = await TraktService.traktClient.shows.progress.collection.cached(
          { id: showId, specials: true, count_specials: true },
          undefined,
          cacheOption,
        );
        return response.json() as Promise<TraktCollectionProgress>;
      },
    },

    movie: {
      async watched(): Promise<TraktWatched<'movie', 'short'>[]> {
        const response = await TraktService.traktClient.sync.watched.cached({ type: 'movies' });
        return response.json() as Promise<TraktWatched<'movie', 'short'>[]>;
      },

      async collection(): Promise<TraktCollection<'movie', 'short', 'short'>[]> {
        const response = await TraktService.traktClient.sync.collection.get.cached({ type: 'movies' });
        return response.json() as Promise<TraktCollection<'movie', 'short', 'short'>[]>;
      },
    },
  };

  static show = {
    async summary(id: string | number) {
      const response = await TraktService.traktClient.shows.summary.cached({ id, extended: 'full' });
      const data = await response.json();
      if (shouldEvict(data?.first_aired, response?.cache)) response.cache?.evict?.();
      return data as TraktShowExtended;
    },

    async season(id: string | number, season: number) {
      const response = await TraktService.traktClient.seasons.season.cached({ id, season });
      const data = await response.json();
      if (data.some(e => shouldEvict(e?.first_aired, response?.cache))) response.cache?.evict?.();
      return data as TraktEpisodeShort[];
    },

    async seasons(id: string | number) {
      const response = await TraktService.traktClient.seasons.summary.cached({ id, extended: 'full' });
      const data = await response.json();
      if (data.some(s => shouldEvict(s?.first_aired, response?.cache))) response.cache?.evict?.();
      return data as TraktSeasonExtended[];
    },

    async episode({ id, season, episode }: { id: string | number; season: number; episode: number }) {
      const response = await TraktService.traktClient.episodes.summary.cached({ id, season, episode, extended: 'full' });
      const data = await response.json();
      if (shouldEvict(data?.first_aired, response?.cache)) response.cache?.evict?.();
      return data as TraktEpisodeExtended;
    },
  };

  static async movie(id: string | number) {
    const response = await this.traktClient.movies.summary.cached({ id, extended: 'full' });
    const data = await response.json();
    if (shouldEvict(data?.released, response?.cache)) response.cache?.evict?.();
    return data as TraktMovieExtended;
  }

  static async person(id: string | number) {
    const response = await this.traktClient.people.summary.cached({ id, extended: 'full' });
    return response.json() as Promise<TraktPersonExtended>;
  }

  static async activity() {
    const response = await this.traktClient.sync.lastActivities();
    return response.json();
  }

  static add = {
    async watchlist(payload: TraktSyncRequest) {
      const response = await TraktService.traktClient.sync.watchlist.add(payload);
      TraktService.evict.watchlist().catch(err => logger.error('Failed to evict watchlist cache', { payload, err }));
      return response.json();
    },

    async list(payload: TraktUserListItemAddedRequest) {
      const response = await TraktService.traktClient.users.list.items.add(payload);
      TraktService.evict.list().catch(err => logger.error('Failed to evict list cache', { payload, err }));
      return response.json();
    },

    async history(payload: TraktHistoryRequest) {
      const response = await TraktService.traktClient.sync.history.add(payload);
      TraktService.evict.history().catch(err => logger.error('Failed to evict history cache', { payload, err }));
      if ('movies' in payload) TraktService.evict.progress.movie().catch(err => logger.error('Failed to evict movie cache', { payload, err }));
      else TraktService.evict.progress.show().catch(err => logger.error('Failed to evict progress cache', { payload, err }));
      return response.json();
    },

    async collection(payload: TraktCollectionRequest) {
      const response = await TraktService.traktClient.sync.collection.add(payload);
      if ('movies' in payload) TraktService.evict.collection.movie().catch(err => logger.error('Failed to evict movie cache', { payload, err }));
      else TraktService.evict.collection.show().catch(err => logger.error('Failed to evict show cache', { payload, err }));
      return response.json();
    },

    async favorites(payload: TraktFavoriteRequest) {
      const response = await TraktService.traktClient.sync.favorites.add(payload);
      TraktService.evict.favorites().catch(err => logger.error('Failed to evict favorites cache', { payload, err }));
      return response.json();
    },
  };

  static remove = {
    async watchlist(payload: TraktSyncRequest) {
      const response = await TraktService.traktClient.sync.watchlist.remove(payload);
      TraktService.evict.watchlist().catch(err => logger.error('Failed to evict watchlist cache', { payload, err }));
      return response.json();
    },

    async list(payload: TraktUserListItemRemoveRequest) {
      const response = await TraktService.traktClient.users.list.items.remove(payload);
      TraktService.evict.list().catch(err => logger.error('Failed to evict list cache', { payload, err }));
      return response.json();
    },

    async history(payload: TraktHistoryRemovedRequest) {
      const response = await TraktService.traktClient.sync.history.remove(payload);
      TraktService.evict.history().catch(err => logger.error('Failed to evict history cache', { payload, err }));
      if ('movies' in payload) TraktService.evict.progress.movie().catch(err => logger.error('Failed to evict movie cache', { payload, err }));
      else TraktService.evict.progress.show().catch(err => logger.error('Failed to evict show cache', { payload, err }));
      return response.json();
    },

    async collection(payload: TraktSyncRequest) {
      const response = await TraktService.traktClient.sync.collection.remove(payload);
      if ('movies' in payload) TraktService.evict.collection.movie().catch(err => logger.error('Failed to evict movie cache', { payload, err }));
      else TraktService.evict.collection.show().catch(err => logger.error('Failed to evict show cache', { payload, err }));
      return response.json();
    },

    async favorites(payload: TraktFavoriteRequest) {
      const response = await TraktService.traktClient.sync.favorites.remove(payload);
      TraktService.evict.favorites().catch(err => logger.error('Failed to evict favorites cache', { payload, err }));
      return response.json();
    },
  };

  static evict = {
    tmdb: () => TraktService.tmdbClient.clearCache(),
    trakt: () => TraktService.traktClient.clearCache(),
    tvdb: () => TraktService.tvdbClient.clearCache(),
    history: TraktService.traktClient.sync.history.get.cached.evict,
    watchlist: TraktService.traktClient.sync.watchlist.get.cached.evict,
    favorites: TraktService.traktClient.sync.favorites.get.cached.evict,
    movies: TraktService.traktClient.movies.summary.cached.evict,
    people: TraktService.traktClient.people.summary.cached.evict,
    shows: TraktService.traktClient.shows.summary.cached.evict,
    seasons: () => Promise.all([TraktService.traktClient.seasons.summary.cached.evict(), TraktService.traktClient.seasons.season.cached.evict()]),
    episodes: TraktService.traktClient.episodes.summary.cached.evict,
    search: TraktService.traktClient.search.text.cached.evict,
    list: TraktService.traktClient.users.list.items.get.cached.evict,
    lists: () =>
      Promise.all([
        TraktService.traktClient.users.lists.get.cached.evict(),
        TraktService.traktClient.users.lists.collaborations.cached.evict(),
        TraktService.traktClient.users.list.items.get.cached.evict(),
      ]),
    calendar: () =>
      Promise.all([
        TraktService.traktClient.calendars.my.movies.cached.evict(),
        TraktService.traktClient.calendars.my.shows.new.cached.evict(),
        TraktService.traktClient.calendars.my.shows.premieres.cached.evict(),
        TraktService.traktClient.calendars.my.shows.finales.cached.evict(),
        TraktService.traktClient.calendars.my.shows.get.cached.evict(),
      ]),
    progress: {
      show: () =>
        Promise.all([
          // Progress on deck
          TraktService.cachedProgress.evict(),
          // Progress for watched episodes
          TraktService.traktClient.shows.progress.watched.cached.evict(),
        ]),
      movie: () =>
        Promise.all([
          // Progress on deck
          TraktService.cachedProgress.evict(),
          // Progress for watched episodes
          TraktService.traktClient.sync.watched.cached.evict(),
        ]),
    },
    collection: {
      show: () =>
        Promise.all([
          // List of collected items
          TraktService.traktClient.sync.collection.get.cached.evict(),
          // Collection progress for shows
          TraktService.traktClient.shows.progress.collection.cached.evict(),
        ]),
      movie: TraktService.traktClient.sync.collection.get.cached.evict,
    },
  };
}

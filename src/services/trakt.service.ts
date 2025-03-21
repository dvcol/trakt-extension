import { type BaseCacheOption, type CacheResponse } from '@dvcol/base-http-client';

import { CacheRetention } from '@dvcol/common-utils/common/cache';
import { DateUtils } from '@dvcol/common-utils/common/date';
import { SimklClient } from '@dvcol/simkl-http-client';
import { TmdbClient } from '@dvcol/tmdb-http-client';

import {
  type TmdbApiResponse,
  type TmdbConfigurationCounty,
  type TmdbDiscoverMovieQuery,
  type TmdbMovieReleaseTypes,
  type TmdbMovieShort,
  type TmdbPaginatedData,
  type TmdbParamPagination,
} from '@dvcol/tmdb-http-client/models';
import { TraktClient } from '@dvcol/trakt-http-client';

import { toExtendedRatings, TraktApiExtended } from '@dvcol/trakt-http-client/models';

import { createTab } from '@dvcol/web-extension-utils/chrome/tabs';

import type { JsonWriterOptions } from '@dvcol/common-utils/common/save';

import type { CancellablePromise } from '@dvcol/common-utils/http/fetch';
import type { SimklApiResponse, SimklUserSettings } from '@dvcol/simkl-http-client/models';
import type {
  TraktApiResponse,
  TraktAuthentication,
  TraktAuthenticationApprove,
  TraktCalendarQuery,
  TraktCheckinRequest,
  TraktCollection,
  TraktCollectionGetQuery,
  TraktCollectionProgress,
  TraktCollectionRequest,
  TraktDeviceAuthentication,
  TraktEpisodeExtended,
  TraktEpisodeShort,
  TraktFavoriteGetQuery,
  TraktFavoriteRequest,
  TraktHistoryGetQuery,
  TraktHistoryRemovedRequest,
  TraktHistoryRequest,
  TraktIdLookup,
  TraktList,
  TraktListItemsGetQuery,
  TraktMovieExtended,
  TraktPersonExtended,
  TraktRatingRequest,
  TraktSearch,
  TraktSeasonExtended,
  TraktShowExtended,
  TraktSyncRatingRequest,
  TraktSyncRequest,
  TraktUserListItemAddedRequest,
  TraktUserListItemRemoveRequest,
  TraktWatched,
  TraktWatchedProgress,
  TraktWatchlistGetQuery,
} from '@dvcol/trakt-http-client/models';

import type { ImagePayload } from '~/models/poster.model';
import type { SettingsAuth, UserSetting } from '~/models/trakt-service.model';

import { ErrorService } from '~/services/error.service';
import { LoadingBarService } from '~/services/loading-bar.service';
import { Logger } from '~/services/logger.service';
import { simklClientSettings } from '~/settings/simkl.api';
import { simklUsedApi } from '~/settings/simkl.used.api';
import { tmdbClientSettings } from '~/settings/tmdb.api';
import { tmdbUsedApi } from '~/settings/tmdb.used.api';
import { traktUsedApi } from '~/settings/trakt-used.api';
import { traktClientSettings } from '~/settings/trakt.api';
import { useAppStateStore } from '~/stores/app-state.store';
import { useSimklStore } from '~/stores/data/simkl.store';
import { useAuthSettingsStore } from '~/stores/settings/auth.store';
import { useExtensionSettingsStore } from '~/stores/settings/extension.store';
import { useUserSettingsStore } from '~/stores/settings/user.store';
import { CachePrefix, TraktChromeCacheStore } from '~/utils/cache.utils';
import { cancellablePaginatedWriteJson, getCachedProgressEndpoint, getSessionUser } from '~/utils/trakt-service.utils';

const shouldEvict = (cache?: CacheResponse<unknown>, date?: string | number | Date): boolean => {
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

const imageResponseEmpty = (payload: ImagePayload) => {
  return Object.values(payload)
    .filter(Array.isArray)
    .every(v => !v?.length);
};

type SettingsAndAuth = { auth: SettingsAuth; settings: { trakt: UserSetting; simkl?: SimklUserSettings } };
type SettingsCaches = {
  trakt: TraktChromeCacheStore<TraktApiResponse>;
  simkl: TraktChromeCacheStore<SimklApiResponse>;
  tmdb: TraktChromeCacheStore<TmdbApiResponse>;
};

export class TraktService {
  private static traktClient: TraktClient;
  private static tmdbClient: TmdbClient;
  private static simklClient: SimklClient;

  private static caches: SettingsCaches;

  static get auth(): SettingsAuth {
    return {
      trakt: this.traktClient.auth,
      simkl: this.simklClient.auth,
      tmdb: this.tmdbClient.auth,
    };
  }

  static get isStaging() {
    return this.traktClient.isStaging;
  }

  static {
    this.caches = {
      trakt: new TraktChromeCacheStore<TraktApiResponse>({ prefix: CachePrefix.Trakt, retention: CacheRetention.Week }),
      simkl: new TraktChromeCacheStore<SimklApiResponse>({ prefix: CachePrefix.Simkl, retention: CacheRetention.Week }),
      tmdb: new TraktChromeCacheStore<TmdbApiResponse>({ prefix: CachePrefix.Tmdb, retention: CacheRetention.Year }),
    };

    this.traktClient = new TraktClient({ ...traktClientSettings, cacheStore: this.caches.trakt }, {}, traktUsedApi);
    this.simklClient = new SimklClient({ ...simklClientSettings, cacheStore: this.caches.simkl }, {}, simklUsedApi);
    this.tmdbClient = new TmdbClient({ ...tmdbClientSettings, cacheStore: this.caches.tmdb }, {}, tmdbUsedApi);
  }

  static changeUser(user: string) {
    this.caches.trakt.prefix = `trakt-cache-${user}`;
    this.caches.simkl.prefix = `simkl-cache-${user}`;
  }

  static async getUserSettings() {
    const response = await this.traktClient.users.settings.cached(undefined, undefined, {
      cacheKey: (_key: string) => `${_key}-${this.auth.trakt?.access_token}`,
    });
    return response.json();
  }

  static changeRetention({ trakt, tmdb, simkl }: Record<keyof SettingsCaches, number>) {
    if (trakt !== undefined) this.caches.trakt.retention = trakt;
    if (tmdb !== undefined) this.caches.tmdb.retention = tmdb;
    if (simkl !== undefined) this.caches.simkl.retention = simkl;
  }

  private static async saveAuth(
    auth: SettingsAuth = this.auth,
    prev: SettingsAuth = useAuthSettingsStore().auth,
  ): Promise<{ auth: SettingsAuth; settings: { trakt: UserSetting; simkl?: SimklUserSettings } }> {
    const _settings = { trakt: useUserSettingsStore().userSetting, simkl: useSimklStore().userSetting };

    if (auth.trakt?.access_token && auth.trakt?.access_token !== prev?.trakt?.access_token) {
      const userSettings = await useUserSettingsStore().fetchUserSettings();
      await useAuthSettingsStore().setCurrentUser(userSettings?.user?.name, false);
    }
    if (auth.simkl?.access_token && auth.simkl?.access_token !== prev?.simkl?.access_token) {
      await useSimklStore().fetchUserSettings();
    }

    await useAuthSettingsStore().setAuth(auth);

    return { auth, settings: _settings };
  }

  static async importAuthentication({ trakt, simkl, tmdb }: SettingsAuth = {}): Promise<SettingsAndAuth> {
    if (trakt) await this.traktClient.importAuthentication(trakt);
    if (simkl) this.simklClient.importAuthentication(simkl);
    if (tmdb) this.tmdbClient.importAuthentication(tmdb);
    return this.saveAuth({ trakt, tmdb, simkl });
  }

  static async approve(params: TraktAuthenticationApprove = {}) {
    const url = this.traktClient
      .redirectToAuthenticationUrl(params)
      .replace(`${traktClientSettings.corsProxy}/${traktClientSettings.corsPrefix}`, traktClientSettings.endpoint);
    if (useAppStateStore().isModal) return createTab({ url });
    window.location.href = url;
  }

  static async login(token: string): Promise<SettingsAndAuth> {
    const trakt = await this.traktClient.exchangeCodeForToken(token);
    return this.saveAuth({ trakt });
  }

  static device = {
    code: () => TraktService.traktClient.getDeviceCode(),
    poll: (deviceAuth: TraktDeviceAuthentication) => TraktService.traktClient.pollWithDeviceCode(deviceAuth),
    login: async (trakt: TraktAuthentication) => {
      return this.saveAuth({ trakt });
    },
  };

  static async logout(account?: string) {
    await useAuthSettingsStore().setAuth(undefined, account);
    await useUserSettingsStore().setUserSetting(undefined, account);
    this.evict.trakt().catch(err => Logger.error('Failed to evict trakt cache', err));
    return this.traktClient.importAuthentication({});
  }

  static async loadingBar<T>(query: Promise<T> | CancellablePromise<T>) {
    const { loadingHysteresis } = useExtensionSettingsStore();
    if (loadingHysteresis >= 0) LoadingBarService.start(loadingHysteresis);
    try {
      await query;
      if (loadingHysteresis >= 0) LoadingBarService.finish();
    } catch (error) {
      if (loadingHysteresis >= 0) LoadingBarService.error();
      ErrorService.registerError(error);
    }
  }

  static listen(subs: (() => void)[] = []) {
    subs.push(
      this.traktClient.onAuthChange(async _auth => {
        Logger.debug('TraktClient.onAuthChange', { ..._auth });
      }),
      this.traktClient.onCall(async call => {
        Logger.debug('TraktClient.onCall', call);
        await this.loadingBar(call.query);
      }),
      this.simklClient.onAuthChange(async _auth => {
        Logger.debug('SimklClient.onAuthChange', { ..._auth });
      }),
      this.simklClient.onCall(async call => {
        Logger.debug('SimklClient.onCall', call);
        await this.loadingBar(call.query);
      }),
      this.tmdbClient.onAuthChange(async _auth => {
        Logger.debug('TmdbClient.onAuthChange', { ..._auth });
      }),
      this.tmdbClient.onCall(async call => {
        Logger.debug('TmdbClient.onCall', call);
        try {
          await call.query;
        } catch (error) {
          ErrorService.registerError(error);
        }
      }),
    );
    return () => subs.forEach(sub => sub());
  }

  static async tmdbConfiguration() {
    const response = await this.tmdbClient.v3.configuration.details.cached();
    return response.json();
  }

  static posters = {
    async movie(movie_id: string | number, force?: boolean) {
      const response = await TraktService.tmdbClient.v3.movies.images.cached({ movie_id }, undefined, { force });
      const data = await response.json();
      if (imageResponseEmpty(data) && shouldEvict(response.cache)) response.cache?.evict?.();
      return data;
    },

    async show(series_id: string | number, force?: boolean) {
      const response = await TraktService.tmdbClient.v3.shows.images.cached({ series_id }, undefined, { force });
      const data = await response.json();
      if (imageResponseEmpty(data) && shouldEvict(response.cache)) response.cache?.evict?.();
      return data;
    },

    async season(series_id: string | number, season_number: number, force?: boolean) {
      const response = await TraktService.tmdbClient.v3.seasons.images.cached({ series_id, season_number }, undefined, { force });
      const data = await response.json();
      if (imageResponseEmpty(data) && shouldEvict(response.cache)) response.cache?.evict?.();
      return data;
    },

    async episode(series_id: string | number, season_number: number, episode_number: number, force?: boolean) {
      const response = await TraktService.tmdbClient.v3.episodes.images.cached({ series_id, season_number, episode_number }, undefined, { force });
      const data = await response.json();
      if (imageResponseEmpty(data) && shouldEvict(response.cache)) response.cache?.evict?.();
      return data;
    },

    async person(person_id: string | number, force?: boolean) {
      const response = await TraktService.tmdbClient.v3.people.images.cached({ person_id }, undefined, { force });
      const data = await response.json();
      if (imageResponseEmpty(data) && shouldEvict(response.cache)) response.cache?.evict?.();
      return data;
    },
  };

  static async history(query: TraktHistoryGetQuery, force?: boolean) {
    const response = await this.traktClient.sync.history.get.cached(query, undefined, { force });
    return { data: await response.json(), pagination: response.pagination };
  }

  static async watchlist(query: TraktWatchlistGetQuery, force?: boolean) {
    const response = await this.traktClient.sync.watchlist.get.cached(query, undefined, { force });
    return { data: await response.json(), pagination: response.pagination };
  }

  static async favorites(query: TraktFavoriteGetQuery, force?: boolean) {
    const response = await this.traktClient.sync.favorites.get.cached(query, undefined, { force });
    return { data: await response.json(), pagination: response.pagination };
  }

  static async collection(query: TraktCollectionGetQuery, force?: boolean) {
    const response = await this.traktClient.sync.collection.get.cached(query, undefined, { force });
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

  static async list(query: TraktListItemsGetQuery, force?: boolean) {
    const response = await this.traktClient.users.list.items.get.cached(query, undefined, { force });
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

  private static cachedProgress = getCachedProgressEndpoint(this.caches.trakt);

  static progress = {
    async onDeck() {
      const sessionUser = await getSessionUser();
      const call = TraktService.cachedProgress(sessionUser ? { headers: { 'X-session-user': sessionUser } } : undefined);
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
      async watched(force?: boolean): Promise<TraktWatched<'movie', 'short'>[]> {
        const response = await TraktService.traktClient.sync.watched.cached({ type: 'movies' }, undefined, { force });
        return response.json() as Promise<TraktWatched<'movie', 'short'>[]>;
      },

      async collection(force?: boolean): Promise<TraktCollection<'movie', 'short', 'short'>[]> {
        const response = await TraktService.traktClient.sync.collection.get.cached({ type: 'movies' }, undefined, { force });
        return response.json() as Promise<TraktCollection<'movie', 'short', 'short'>[]>;
      },
    },
  };

  static show = {
    async summary(id: string | number, force?: boolean) {
      const response = await TraktService.traktClient.shows.summary.cached({ id, extended: TraktApiExtended.Full }, undefined, { force });
      const data = await response.json();
      if (shouldEvict(response?.cache, data?.first_aired)) response.cache?.evict?.();
      return data as TraktShowExtended;
    },

    async season(id: string | number, season: number, force?: boolean) {
      const response = await TraktService.traktClient.seasons.season.cached({ id, season }, undefined, { force });
      const data = await response.json();
      if (data.some(e => shouldEvict(response?.cache, e?.first_aired))) response.cache?.evict?.();
      return data as TraktEpisodeShort[];
    },

    async seasons(id: string | number, force?: boolean) {
      const response = await TraktService.traktClient.seasons.summary.cached({ id, extended: TraktApiExtended.Full }, undefined, { force });
      const data = await response.json();
      if (data.some(s => shouldEvict(response?.cache, s?.first_aired))) response.cache?.evict?.();
      return data as TraktSeasonExtended[];
    },

    async episode({ id, season, episode }: { id: string | number; season: number; episode: number }, force?: boolean) {
      const response = await TraktService.traktClient.episodes.summary.cached({ id, season, episode, extended: TraktApiExtended.Full }, undefined, {
        force,
      });
      const data = await response.json();
      if (shouldEvict(response?.cache, data?.first_aired)) response.cache?.evict?.();
      return data as TraktEpisodeExtended;
    },
  };

  static async movie(id: string | number, force?: boolean) {
    const response = await this.traktClient.movies.summary.cached({ id, extended: TraktApiExtended.Full }, undefined, { force });
    const data = await response.json();
    if (shouldEvict(response?.cache, data?.released)) response.cache?.evict?.();
    return data as TraktMovieExtended;
  }

  static async person(id: string | number, force?: boolean) {
    const response = await this.traktClient.people.summary.cached({ id, extended: TraktApiExtended.Full }, undefined, { force });
    return response.json() as Promise<TraktPersonExtended>;
  }

  static async activity() {
    const response = await this.traktClient.sync.lastActivities();
    return response.json();
  }

  static add = {
    async watchlist(payload: TraktSyncRequest) {
      const response = await TraktService.traktClient.sync.watchlist.add(payload);
      TraktService.evict.watchlist().catch(err => Logger.error('Failed to evict watchlist cache', { payload, err }));
      return response.json();
    },

    async list(payload: TraktUserListItemAddedRequest) {
      const response = await TraktService.traktClient.users.list.items.add(payload);
      TraktService.evict.list().catch(err => Logger.error('Failed to evict list cache', { payload, err }));
      return response.json();
    },

    async history(payload: TraktHistoryRequest) {
      const response = await TraktService.traktClient.sync.history.add(payload);
      TraktService.evict.history().catch(err => Logger.error('Failed to evict history cache', { payload, err }));
      if ('movies' in payload) TraktService.evict.progress.movie().catch(err => Logger.error('Failed to evict movie cache', { payload, err }));
      else TraktService.evict.progress.show().catch(err => Logger.error('Failed to evict progress cache', { payload, err }));
      return response.json();
    },

    async collection(payload: TraktCollectionRequest) {
      const response = await TraktService.traktClient.sync.collection.add(payload);
      if ('movies' in payload) TraktService.evict.collection.movie().catch(err => Logger.error('Failed to evict movie cache', { payload, err }));
      else TraktService.evict.collection.show().catch(err => Logger.error('Failed to evict show cache', { payload, err }));
      return response.json();
    },

    async favorites(payload: TraktFavoriteRequest) {
      const response = await TraktService.traktClient.sync.favorites.add(payload);
      TraktService.evict.favorites().catch(err => Logger.error('Failed to evict favorites cache', { payload, err }));
      return response.json();
    },
  };

  static remove = {
    async watchlist(payload: TraktSyncRequest) {
      const response = await TraktService.traktClient.sync.watchlist.remove(payload);
      TraktService.evict.watchlist().catch(err => Logger.error('Failed to evict watchlist cache', { payload, err }));
      return response.json();
    },

    async list(payload: TraktUserListItemRemoveRequest) {
      const response = await TraktService.traktClient.users.list.items.remove(payload);
      TraktService.evict.list().catch(err => Logger.error('Failed to evict list cache', { payload, err }));
      return response.json();
    },

    async history(payload: TraktHistoryRemovedRequest) {
      const response = await TraktService.traktClient.sync.history.remove(payload);
      TraktService.evict.history().catch(err => Logger.error('Failed to evict history cache', { payload, err }));
      if ('movies' in payload) TraktService.evict.progress.movie().catch(err => Logger.error('Failed to evict movie cache', { payload, err }));
      else TraktService.evict.progress.show().catch(err => Logger.error('Failed to evict show cache', { payload, err }));
      return response.json();
    },

    async collection(payload: TraktSyncRequest) {
      const response = await TraktService.traktClient.sync.collection.remove(payload);
      if ('movies' in payload) TraktService.evict.collection.movie().catch(err => Logger.error('Failed to evict movie cache', { payload, err }));
      else TraktService.evict.collection.show().catch(err => Logger.error('Failed to evict show cache', { payload, err }));
      return response.json();
    },

    async favorites(payload: TraktFavoriteRequest) {
      const response = await TraktService.traktClient.sync.favorites.remove(payload);
      TraktService.evict.favorites().catch(err => Logger.error('Failed to evict favorites cache', { payload, err }));
      return response.json();
    },
  };

  static releases = {
    movie: async (
      options?: { from: Date; to: Date; release: TmdbMovieReleaseTypes[]; region?: string },
      query: TmdbDiscoverMovieQuery & TmdbParamPagination = {},
    ): Promise<TmdbPaginatedData<TmdbMovieShort>> => {
      query.region = options?.region ?? query.region;
      query[`release_date.gte`] = options?.from?.toISOString().split('T').at(0) ?? query[`release_date.gte`];
      if (!query[`release_date.gte`]) query[`release_date.gte`] = DateUtils.previous(7).toISOString().split('T').at(0);
      if (!query[`release_date.gte`]) throw new Error('From date is required for movie releases');
      query[`release_date.lte`] = options?.to?.toISOString().split('T').at(0) ?? query[`release_date.lte`];
      if (!query[`release_date.lte`]) query[`release_date.lte`] = DateUtils.next(7).toISOString().split('T').at(0);
      if (!query[`release_date.lte`]) throw new Error('To date is required for movie releases');
      query.with_release_type = options?.release ?? query.with_release_type;
      if (!query.with_release_type) throw new Error('Release type is required for movie releases');
      const response = await TraktService.tmdbClient.v3.discover.movie.cached(query, undefined, { retention: CacheRetention.Week });
      return response.json();
    },
  };

  static providers = {
    regions: async (): Promise<TmdbConfigurationCounty[]> => {
      const response = await TraktService.tmdbClient.v3.providers.regions.cached();
      return response.json();
    },
  };

  static lookup = async (query: TraktIdLookup) => {
    const response = await TraktService.traktClient.search.id.cached(query);
    return response.json();
  };

  static checkin = {
    watching: async (id: string, extended?: boolean) => {
      const response = await TraktService.traktClient.users.watching({ id, extended: extended ? TraktApiExtended.Full : undefined });
      if (response.status === 204) return;
      return response.json();
    },
    checkin: async (query: TraktCheckinRequest) => {
      const response = await TraktService.traktClient.checkin.add(query);
      TraktService.evict.progress.show().catch(err => Logger.error('Failed to evict show cache', { query, err }));
      TraktService.evict.progress.movie().catch(err => Logger.error('Failed to evict movie cache', { query, err }));
      TraktService.evict.history().catch(err => Logger.error('Failed to evict history cache', { query, err }));
      return response.json();
    },
    cancel: async () => {
      const response = await TraktService.traktClient.checkin.delete();
      TraktService.evict.progress.show().catch(err => Logger.error('Failed to evict show cache', { err }));
      TraktService.evict.progress.movie().catch(err => Logger.error('Failed to evict movie cache', { err }));
      return response;
    },
  };

  static ratings = {
    add: async (query: TraktRatingRequest) => {
      const response = await TraktService.traktClient.sync.ratings.add(query);
      TraktService.traktClient.sync.ratings.get.cached.evict().catch(err => Logger.error('Failed to evict ratings cache', { query, err }));
      const { added, not_found } = await response.json();
      if (Object.values(not_found).some(value => value?.length)) throw not_found;
      return added;
    },
    remove: async (query: TraktSyncRequest) => {
      const response = await TraktService.traktClient.sync.ratings.remove(query);
      TraktService.traktClient.sync.ratings.get.cached.evict().catch(err => Logger.error('Failed to evict ratings cache', { query, err }));
      return response.json();
    },

    get: async (query: TraktSyncRatingRequest) => {
      const response = await TraktService.traktClient.sync.ratings.get.cached(query);
      return { data: await response.json(), pagination: response.pagination };
    },

    show: async (id: string | number, force?: boolean) => {
      const response = await TraktService.traktClient.shows.ratings.cached({ id, extended: TraktApiExtended.All }, undefined, { force });
      const data = await response.json();
      if (shouldEvict(response?.cache)) response.cache?.evict?.();
      return toExtendedRatings(data);
    },
    season: async (id: string | number, season: number, force?: boolean) => {
      const response = await TraktService.traktClient.seasons.ratings.cached({ id, season, extended: TraktApiExtended.All }, undefined, { force });
      const data = await response.json();
      if (shouldEvict(response?.cache)) response.cache?.evict?.();
      return toExtendedRatings(data);
    },
    episode: async (id: string | number, season: number, episode: number, force?: boolean) => {
      const response = await TraktService.traktClient.episodes.ratings.cached({ id, season, episode, extended: TraktApiExtended.All }, undefined, {
        force,
      });
      const data = await response.json();
      if (shouldEvict(response?.cache)) response.cache?.evict?.();
      return toExtendedRatings(data);
    },
    movie: async (id: string | number, force?: boolean) => {
      const response = await TraktService.traktClient.movies.ratings.cached({ id, extended: TraktApiExtended.All }, undefined, { force });
      const data = await response.json();
      if (shouldEvict(response?.cache)) response.cache?.evict?.();
      return toExtendedRatings(data);
    },
  };

  static stats = {
    user: async (username: string) => {
      const response = await TraktService.traktClient.users.stats.cached({ id: username }, undefined, { retention: CacheRetention.Day });
      return response.json();
    },
  };

  static simkl = {
    settings: async () => {
      const response = await this.simklClient.user.settings();
      return response.json();
    },
    authorize: () => {
      const url = this.simklClient.resolveAuthorizeUrl();
      if (useAppStateStore().isModal) return createTab({ url });
      window.location.href = url;
    },
    login: async (code: string): Promise<SettingsAndAuth> => {
      const simkl = await this.simklClient.exchangeCodeForToken({ code });
      return this.saveAuth({ simkl });
    },
    logout: async (account?: string) => {
      await useAuthSettingsStore().setAuth({ simkl: null }, account);
      await useSimklStore().setUserSetting(undefined, account);
      this.evict.simkl().catch(err => Logger.error('Failed to evict simkl cache', { account, err }));
      return this.simklClient.importAuthentication({});
    },
    show: async (id: string | number, extended?: boolean, force?: boolean) => {
      const response = await this.simklClient.show.id.cached({ id, extended }, undefined, { force });
      const data = await response.json();
      if (shouldEvict(response?.cache, data?.first_aired)) response.cache?.evict?.();
      return data;
    },
    anime: async (id: string | number, extended?: boolean, force?: boolean) => {
      const response = await this.simklClient.anime.id.cached({ id, extended }, undefined, { force });
      const data = await response.json();
      if (shouldEvict(response?.cache, data?.first_aired)) response.cache?.evict?.();
      return data;
    },
    movie: async (id: string | number, extended?: boolean, force?: boolean) => {
      const response = await this.simklClient.movie.id.cached({ id, extended }, undefined, { force });
      const data = await response.json();
      if (shouldEvict(response?.cache, data?.released)) response.cache?.evict?.();
      return data;
    },
  };

  static evict = {
    tmdb: async () => TraktService.tmdbClient.clearCache(),
    trakt: async () => TraktService.traktClient.clearCache(),
    simkl: async () => TraktService.simklClient.clearCache(),
    images: () =>
      Promise.all([
        TraktService.tmdbClient.v3.configuration.details.cached.evict(),
        TraktService.tmdbClient.v3.movies.images.cached.evict(),
        TraktService.tmdbClient.v3.shows.images.cached.evict(),
        TraktService.tmdbClient.v3.seasons.images.cached.evict(),
        TraktService.tmdbClient.v3.episodes.images.cached.evict(),
        TraktService.tmdbClient.v3.people.images.cached.evict(),
      ]),
    releases: () =>
      Promise.all([
        TraktService.tmdbClient.v3.discover.movie.cached.evict(),
        TraktService.tmdbClient.v3.providers.regions.cached.evict(),
        TraktService.traktClient.search.id.cached.evict(),
      ]),
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
      deck: TraktService.cachedProgress.evict,
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
    ratings: () =>
      Promise.all([
        TraktService.traktClient.sync.ratings.get.cached.evict(),
        TraktService.traktClient.shows.ratings.cached.evict(),
        TraktService.traktClient.seasons.ratings.cached.evict(),
        TraktService.traktClient.episodes.ratings.cached.evict(),
        TraktService.traktClient.movies.ratings.cached.evict(),
      ]),
    stats: TraktService.traktClient.users.stats.cached.evict,
    settings: TraktService.traktClient.users.settings.cached.evict,
    clean: () => Promise.all([TraktService.caches.trakt.clean(), TraktService.caches.simkl.clean(), TraktService.caches.tmdb.clean()]),
  };

  static export = {
    history: ({ payload, writer }: { payload?: TraktHistoryGetQuery; writer?: JsonWriterOptions } = {}) =>
      cancellablePaginatedWriteJson(TraktService.traktClient.sync.history.get, payload, writer),
    watchlist: ({ payload, writer }: { payload?: TraktWatchlistGetQuery; writer?: JsonWriterOptions } = {}) =>
      cancellablePaginatedWriteJson(TraktService.traktClient.sync.watchlist.get, payload, writer),
    collection: ({ payload, writer }: { payload?: TraktCollectionGetQuery; writer?: JsonWriterOptions } = {}) =>
      cancellablePaginatedWriteJson(TraktService.traktClient.sync.collection.get, payload, writer),
    favorites: ({ payload, writer }: { payload?: TraktFavoriteGetQuery; writer?: JsonWriterOptions } = {}) =>
      cancellablePaginatedWriteJson(TraktService.traktClient.sync.favorites.get, payload, writer),
    list: ({ payload, writer }: { payload: TraktListItemsGetQuery; writer?: JsonWriterOptions }) =>
      cancellablePaginatedWriteJson(TraktService.traktClient.users.list.items.get, payload, writer),
  };
}

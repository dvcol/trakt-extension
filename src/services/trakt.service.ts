import type { ProgressItem } from '~/models/progress.model';
import type { TmdbApiResponse } from '~/models/tmdb/tmdb-client.model';
import type { TraktAuthenticationApprove } from '~/models/trakt/trakt-authentication.model';
import type { TraktCalendarQuery } from '~/models/trakt/trakt-calendar.model';
import type { TraktApiResponse } from '~/models/trakt/trakt-client.model';
import type { TraktCollection, TraktCollectionGetQuery, TraktCollectionRequest } from '~/models/trakt/trakt-collection.model';
import type { TraktEpisodeExtended, TraktEpisodeShort } from '~/models/trakt/trakt-episode.model';
import type { TraktFavoriteGetQuery, TraktFavoriteRequest } from '~/models/trakt/trakt-favorite.model';
import type { TraktHistoryGetQuery, TraktHistoryRemovedRequest, TraktHistoryRequest } from '~/models/trakt/trakt-history.model';

import type {
  TraktList,
  TraktListItemsGetQuery,
  TraktUserListItemAddedRequest,
  TraktUserListItemRemoveRequest,
} from '~/models/trakt/trakt-list.model';

import type { TraktMovieExtended } from '~/models/trakt/trakt-movie.model';
import type { TraktPersonExtended } from '~/models/trakt/trakt-people.model';
import type { TraktCollectionProgress, TraktWatchedProgress } from '~/models/trakt/trakt-progress.model';
import type { TraktSearch } from '~/models/trakt/trakt-search.model';
import type { TraktSeasonExtended } from '~/models/trakt/trakt-season.model';
import type { TraktShowExtended } from '~/models/trakt/trakt-show.model';
import type { TraktSyncRequest } from '~/models/trakt/trakt-sync.model';
import type { TraktWatched } from '~/models/trakt/trakt-watched.model';
import type { TraktWatchlistGetQuery } from '~/models/trakt/trakt-watchlist.model';
import type { SettingsAuth, UserSetting } from '~/models/trakt-service.model';
import type { TvdbApiResponse } from '~/models/tvdb/tvdb-client.model';

import { type BaseCacheOption, type CacheResponse, getCachedFunction, type TypedResponse } from '~/services/common/base-client';
import { LoadingBarService } from '~/services/loading-bar.service';
import { tmdbApi } from '~/services/tmdb-client/api/tmdb-api.endpoints';
import { TmdbClient } from '~/services/tmdb-client/clients/tmdb-client';
import { traktApi } from '~/services/trakt-client/api/trakt-api.endpoints';
import { isResponseOk } from '~/services/trakt-client/clients/base-trakt-client';
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

export const shouldEvict = (date?: string | number | Date, cache?: CacheResponse<unknown>): boolean => {
  // no date or cache skip
  if (!date || !cache?.evict) return false;
  // date in the past skip
  if (new Date(date) <= new Date()) return false;
  // cached today skip
  if (cache?.current?.cachedAt) {
    const _cachedAt = new Date(cache.current.cachedAt).toLocaleDateString();
    const _today = new Date().toLocaleDateString();
    if (_cachedAt === _today) return false;
  }
  return true;
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
        prefix: 'trakt-cache',
        retention: CacheRetention.Week,
      }),
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

  static changeRetention(retention: number) {
    this.caches.trakt.retention = retention;
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
    async () => {
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
      const response = await TraktService.cachedProgress();
      if (!response.ok) throw response;
      return response.json();
    },

    show: {
      async watched(showId: string | number, cacheOption?: BaseCacheOption) {
        const response = await TraktService.traktClient.shows.progress.watched.cached(
          { id: showId, specials: true, count_specials: false },
          undefined,
          cacheOption,
        );
        return response.json() as Promise<TraktWatchedProgress>;
      },

      async collection(showId: string | number, cacheOption?: BaseCacheOption) {
        const response = await TraktService.traktClient.shows.progress.collection.cached(
          { id: showId, specials: true, count_specials: false },
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
      TraktService.evict.watchlist().catch(console.error);
      return response.json();
    },

    async list(payload: TraktUserListItemAddedRequest) {
      const response = await TraktService.traktClient.users.list.items.add(payload);
      TraktService.evict.list().catch(console.error);
      return response.json();
    },

    async history(payload: TraktHistoryRequest) {
      const response = await TraktService.traktClient.sync.history.add(payload);
      TraktService.evict.history().catch(console.error);
      if ('movies' in payload) TraktService.evict.progress.movie().catch(console.error);
      else TraktService.evict.progress.show().catch(console.error);
      return response.json();
    },

    async collection(payload: TraktCollectionRequest) {
      const response = await TraktService.traktClient.sync.collection.add(payload);
      if ('movies' in payload) TraktService.evict.collection.movie().catch(console.error);
      else TraktService.evict.collection.show().catch(console.error);
      return response.json();
    },

    async favorites(payload: TraktFavoriteRequest) {
      const response = await TraktService.traktClient.sync.favorites.add(payload);
      TraktService.evict.favorites().catch(console.error);
      return response.json();
    },
  };

  static remove = {
    async watchlist(payload: TraktSyncRequest) {
      const response = await TraktService.traktClient.sync.watchlist.remove(payload);
      TraktService.evict.watchlist().catch(console.error);
      return response.json();
    },

    async list(payload: TraktUserListItemRemoveRequest) {
      const response = await TraktService.traktClient.users.list.items.remove(payload);
      TraktService.evict.list().catch(console.error);
      return response.json();
    },

    async history(payload: TraktHistoryRemovedRequest) {
      const response = await TraktService.traktClient.sync.history.remove(payload);
      TraktService.evict.history().catch(console.error);
      if ('movies' in payload) TraktService.evict.progress.movie().catch(console.error);
      else TraktService.evict.progress.show().catch(console.error);
      return response.json();
    },

    async collection(payload: TraktSyncRequest) {
      const response = await TraktService.traktClient.sync.collection.remove(payload);
      if ('movies' in payload) TraktService.evict.collection.movie().catch(console.error);
      else TraktService.evict.collection.show().catch(console.error);
      return response.json();
    },

    async favorites(payload: TraktFavoriteRequest) {
      const response = await TraktService.traktClient.sync.favorites.remove(payload);
      TraktService.evict.favorites().catch(console.error);
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

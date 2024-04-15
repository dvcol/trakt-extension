import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref, toRaw } from 'vue';

import { Route } from '~/router';
import { TraktService } from '~/services/trakt.service';
import { logger } from '~/stores/settings/log.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { CacheRetention } from '~/utils/cache.utils';
import { debounce } from '~/utils/debounce.utils';

type CacheRetentionState = {
  trakt: number;
  tmdb: number;
  tvdb: number;
};

const DefaultCacheRetention: CacheRetentionState = {
  trakt: CacheRetention.Week,
  tmdb: CacheRetention.Year,
  tvdb: CacheRetention.Year,
} as const;

type RouteDictionary = Partial<Record<Route, boolean>>;

const DefaultRoutes: RouteDictionary = {
  [Route.Progress]: false,
  [Route.Calendar]: true,
  [Route.History]: true,
  [Route.Watchlist]: true,
  [Route.Search]: true,
};

type ExtensionSettings = {
  cacheRetention: CacheRetentionState;
  enabledRoutes: RouteDictionary;
  restoreRoute: boolean;
  progressTab: boolean;
  logLevel: string;
};

export const useExtensionSettingsStore = defineStore('settings.extension', () => {
  const cacheRetention = reactive<CacheRetentionState>(DefaultCacheRetention);
  const routeDictionary = reactive<RouteDictionary>(DefaultRoutes);
  const restoreRoute = ref(true);
  // todo: use each store value instead in settings page

  const clearState = () => {
    Object.assign(cacheRetention, DefaultCacheRetention);
    Object.assign(routeDictionary, DefaultRoutes);
    restoreRoute.value = true;
  };

  const saveState = debounce(
    () =>
      storage.sync.set('settings.extension', {
        cacheRetention: toRaw(cacheRetention),
        enabledRoutes: toRaw(routeDictionary),
        restoreRoute: restoreRoute.value,
      }),
    1000,
  );

  const setRetention = (retention: Partial<CacheRetentionState>, persist = true) => {
    if (retention.trakt !== undefined) cacheRetention.trakt = retention.trakt;
    if (retention.tmdb !== undefined) cacheRetention.tmdb = retention.tmdb;
    if (retention.tvdb !== undefined) cacheRetention.tvdb = retention.tvdb;
    TraktService.changeRetention(cacheRetention);
    if (persist) saveState().catch(err => logger.error('Failed to save extension settings', { retention, err }));
  };

  const restoreState = async () => {
    const restored = await storage.sync.get<ExtensionSettings>('settings.extension');

    if (restored?.cacheRetention !== undefined) setRetention(restored.cacheRetention, false);
    if (restored?.enabledRoutes !== undefined) Object.assign(routeDictionary, restored.enabledRoutes);
    if (restored?.restoreRoute !== undefined) restoreRoute.value = restored.restoreRoute;
  };

  const initExtensionSettingsStore = async () => {
    await restoreState();
  };

  const toggleTab = (tab: Route) => {
    routeDictionary[tab] = !routeDictionary[tab];
    saveState().catch(err => logger.error('Failed to save extension settings', { tab, err }));
  };

  return {
    initExtensionSettingsStore,
    saveState,
    clearState,
    restoreRoute,
    toggleTab,
    routeDictionary,
    enabledTabs: computed(() => Object.entries(routeDictionary).filter(([r]) => r !== Route.Calendar) as [Route, boolean][]),
    enabledRoutes: computed(() =>
      Object.entries(routeDictionary)
        .filter(([, value]) => value)
        .map(([key]) => key as Route),
    ),
    traktCacheRetention: computed({
      get: () => cacheRetention.trakt,
      set: (value: number) => setRetention({ trakt: value }),
    }),
    tmdbCacheRetention: computed({
      get: () => cacheRetention.tmdb,
      set: (value: number) => setRetention({ tmdb: value }),
    }),
  };
});

export const useExtensionSettingsStoreRefs = () => storeToRefs(useExtensionSettingsStore());

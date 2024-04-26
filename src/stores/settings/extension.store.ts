import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref, toRaw } from 'vue';

import { Route } from '~/models/router.model';
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
  restorePanel: boolean;
};

const ExtensionSettingsConstants = {
  Store: 'settings.extension',
  LocalDefaultTab: 'settings.extension.default-tab',
} as const;

export const useExtensionSettingsStore = defineStore(ExtensionSettingsConstants.Store, () => {
  const cacheRetention = reactive<CacheRetentionState>(DefaultCacheRetention);
  const routeDictionary = reactive<RouteDictionary>(DefaultRoutes);
  const restoreRoute = ref(true);
  const restorePanel = ref(false);
  const defaultTab = ref(Route.Calendar);
  const initialized = ref<Promise<boolean>>();

  const clearState = () => {
    Object.assign(cacheRetention, DefaultCacheRetention);
    Object.assign(routeDictionary, DefaultRoutes);
    restoreRoute.value = true;
  };

  const saveState = debounce(
    () =>
      storage.sync.set(ExtensionSettingsConstants.Store, {
        cacheRetention: toRaw(cacheRetention),
        enabledRoutes: toRaw(routeDictionary),
        restoreRoute: restoreRoute.value,
        restorePanel: restorePanel.value,
      }),
    500,
  );

  const setRetention = (retention: Partial<CacheRetentionState>, persist = true) => {
    if (retention.trakt !== undefined) cacheRetention.trakt = retention.trakt;
    if (retention.tmdb !== undefined) cacheRetention.tmdb = retention.tmdb;
    if (retention.tvdb !== undefined) cacheRetention.tvdb = retention.tvdb;
    TraktService.changeRetention(cacheRetention);
    if (persist) saveState().catch(err => logger.error('Failed to save extension settings', { retention, err }));
  };

  const restoreState = async () => {
    const restored = await storage.sync.get<ExtensionSettings>(ExtensionSettingsConstants.Store);

    if (restored?.cacheRetention !== undefined) setRetention(restored.cacheRetention, false);
    if (restored?.enabledRoutes !== undefined) Object.assign(routeDictionary, restored.enabledRoutes);
    if (restored?.restoreRoute !== undefined) restoreRoute.value = restored.restoreRoute;
    if (restored?.restorePanel !== undefined) restorePanel.value = restored.restorePanel;
  };

  const saveDefaultTab = debounce(() => storage.sync.set(ExtensionSettingsConstants.LocalDefaultTab, defaultTab.value), 500);

  const restoreDefaultTab = async () => {
    const restored = await storage.sync.get<Route>(ExtensionSettingsConstants.LocalDefaultTab);
    if (restored) defaultTab.value = restored;
  };

  const initExtensionSettingsStore = async () => {
    if (!initialized.value) initialized.value = Promise.all([restoreState(), restoreDefaultTab()]).then(() => true);
    return initialized.value;
  };

  const setDefaultTab = (value?: Route) => {
    if (!value) return;
    defaultTab.value = value;
    saveDefaultTab().catch(err => logger.error('Failed to save default tab in extension settings', { value, err }));
  };

  const toggleTab = (tab: Route) => {
    routeDictionary[tab] = !routeDictionary[tab];
    if (defaultTab.value === tab && !routeDictionary[tab]) {
      setDefaultTab((Object.keys(routeDictionary) as Route[]).find(key => routeDictionary[key]));
    }
    saveState().catch(err => logger.error('Failed to save enabled tab extension settings', { tab, err }));
  };

  return {
    initExtensionSettingsStore,
    restoreDefaultTab,
    saveState,
    clearState,
    restoreRoute: computed({
      get: () => restoreRoute.value,
      set: (value: boolean) => {
        restoreRoute.value = value;
        saveState().catch(err => logger.error('Failed to save restore route extension settings', { value, err }));
      },
    }),
    restorePanel: computed({
      get: () => restorePanel.value,
      set: (value: boolean) => {
        restorePanel.value = value;
        saveState().catch(err => logger.error('Failed to save restore panel extension settings', { value, err }));
      },
    }),
    toggleTab,
    routeDictionary,
    defaultTab: computed({
      get: () => defaultTab.value,
      set: setDefaultTab,
    }),
    enabledTabs: computed(() => Object.entries(routeDictionary) as [Route, boolean][]),
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

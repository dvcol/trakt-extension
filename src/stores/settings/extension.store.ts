import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref, toRaw } from 'vue';

import { TraktService } from '~/services/trakt.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { createTab } from '~/utils/browser/browser.utils';
import { CacheRetention } from '~/utils/cache.utils';
import { debounce } from '~/utils/debounce.utils';

type ExtensionSettings = {
  openLinksInNewTab: boolean;
  cacheRetention: number;
  restoreRoute: boolean;
  progressTab: boolean;
  logLevel: string;
};

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

export const useExtensionSettingsStore = defineStore('settings.extension', () => {
  const openLinksInNewTab = ref(true);
  const cacheRetention = reactive(DefaultCacheRetention);
  const restoreRoute = ref(true);
  const progressTab = ref(false);
  // todo: use each store value instead in settings page
  const logLevel = ref('info');

  const clearState = () => {
    Object.assign(cacheRetention, DefaultCacheRetention);
    openLinksInNewTab.value = true;
    restoreRoute.value = true;
    progressTab.value = false;
    logLevel.value = 'info';
  };

  const saveState = debounce(
    () =>
      storage.sync.set('settings.extension', {
        openLinksInNewTab: openLinksInNewTab.value,
        cacheRetention: toRaw(cacheRetention),
        restoreRoute: restoreRoute.value,
        progressTab: progressTab.value,
        logLevel: logLevel.value,
      }),
    1000,
  );

  const setRetention = (retention: Partial<CacheRetentionState>, persist = true) => {
    if (retention.trakt !== undefined) cacheRetention.trakt = retention.trakt;
    if (retention.tmdb !== undefined) cacheRetention.tmdb = retention.tmdb;
    if (retention.tvdb !== undefined) cacheRetention.tvdb = retention.tvdb;
    TraktService.changeRetention(cacheRetention);
    if (persist) saveState().catch(err => console.error('Failed to save extension settings', { value, err }));
  };

  const restoreState = async () => {
    const restored = await storage.sync.get<ExtensionSettings>('settings.extension');

    if (restored?.openLinksInNewTab !== undefined) openLinksInNewTab.value = restored.openLinksInNewTab;
    if (restored?.cacheRetention !== undefined) setRetention(restored.cacheRetention, false);
    if (restored?.restoreRoute !== undefined) restoreRoute.value = restored.restoreRoute;
    if (restored?.progressTab !== undefined) progressTab.value = restored.progressTab;
    if (restored?.logLevel) logLevel.value = restored.logLevel;
  };

  const initExtensionSettingsStore = async () => {
    await restoreState();
  };

  const openTab = (url?: string) => {
    if (!url) return;
    createTab({ url, active: openLinksInNewTab.value });
  };

  return {
    initExtensionSettingsStore,
    saveState,
    clearState,
    restoreRoute,
    openLinksInNewTab,
    openTab,
    progressTab,
    logLevel,
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

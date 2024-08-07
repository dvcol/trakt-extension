import { CacheRetention } from '@dvcol/common-utils/common/cache';
import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref, toRaw } from 'vue';

import { PageSize } from '~/models/page-size.model';
import { ProgressType, type ProgressTypes } from '~/models/progress-type.model';
import { Route } from '~/models/router.model';
import { Logger } from '~/services/logger.service';
import { TraktService } from '~/services/trakt.service';
import { type ListEntity } from '~/stores/data/list.store';
import { storage } from '~/utils/browser/browser-storage.utils';
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
  [Route.Releases]: false,
  [Route.History]: true,
  [Route.Watchlist]: true,
  [Route.Search]: true,
};

type ExtensionSettings = {
  cacheRetention: CacheRetentionState;
  enabledRoutes: RouteDictionary;
  restoreRoute: boolean;
  restorePanel: boolean;
  loadLists: ListEntity[];
  loadListsPageSize: number;
  progressType: ProgressTypes;
  enableRatings: boolean;
};

const ExtensionSettingsConstants = {
  Store: 'settings.extension',
  LocalDefaultTab: 'settings.extension.default-tab',
} as const;

export const useExtensionSettingsStore = defineStore(ExtensionSettingsConstants.Store, () => {
  const cacheRetention = reactive<ExtensionSettings['cacheRetention']>(DefaultCacheRetention);
  const routeDictionary = reactive<ExtensionSettings['enabledRoutes']>(DefaultRoutes);
  const restoreRoute = ref<ExtensionSettings['restoreRoute']>(true);
  const restorePanel = ref<ExtensionSettings['restorePanel']>(false);
  const loadLists = ref<ExtensionSettings['loadLists']>([]);
  const loadListsPageSize = ref<ExtensionSettings['loadListsPageSize']>(PageSize.p500);
  const defaultTab = ref<Route>(Route.Calendar);
  const initialized = ref<Promise<boolean>>();
  const progressType = ref<ExtensionSettings['progressType']>(ProgressType.Show);
  const enableRatings = ref(false);

  const clearState = () => {
    Object.assign(cacheRetention, DefaultCacheRetention);
    Object.assign(routeDictionary, DefaultRoutes);
    restoreRoute.value = true;
    restorePanel.value = false;
    loadLists.value = [];
    progressType.value = ProgressType.Show;
  };

  const saveState = debounce(
    () =>
      storage.sync.set<ExtensionSettings>(ExtensionSettingsConstants.Store, {
        cacheRetention: toRaw(cacheRetention),
        enabledRoutes: toRaw(routeDictionary),
        restoreRoute: restoreRoute.value,
        restorePanel: restorePanel.value,
        loadLists: loadLists.value,
        loadListsPageSize: loadListsPageSize.value,
        progressType: progressType.value,
        enableRatings: enableRatings.value,
      }),
    500,
  );

  const setRetention = (retention: Partial<CacheRetentionState>, persist = true) => {
    if (retention.trakt !== undefined) cacheRetention.trakt = retention.trakt;
    if (retention.tmdb !== undefined) cacheRetention.tmdb = retention.tmdb;
    if (retention.tvdb !== undefined) cacheRetention.tvdb = retention.tvdb;
    TraktService.changeRetention(cacheRetention);
    if (persist) saveState().catch(err => Logger.error('Failed to save extension settings', { retention, err }));
  };

  const restoreState = async () => {
    const restored = await storage.sync.get<ExtensionSettings>(ExtensionSettingsConstants.Store);

    if (restored?.cacheRetention !== undefined) setRetention(restored.cacheRetention, false);
    if (restored?.enabledRoutes !== undefined) Object.assign(routeDictionary, restored.enabledRoutes);
    if (restored?.restoreRoute !== undefined) restoreRoute.value = restored.restoreRoute;
    if (restored?.restorePanel !== undefined) restorePanel.value = restored.restorePanel;
    if (restored?.loadLists !== undefined) loadLists.value = Object.values(restored.loadLists);
    if (restored?.loadListsPageSize !== undefined) loadListsPageSize.value = restored.loadListsPageSize;
    if (restored?.progressType !== undefined) progressType.value = restored.progressType;
    if (restored?.enableRatings !== undefined) enableRatings.value = restored.enableRatings;
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
    saveDefaultTab().catch(err => Logger.error('Failed to save default tab in extension settings', { value, err }));
  };

  const toggleTab = (tab: Route) => {
    routeDictionary[tab] = !routeDictionary[tab];
    if (defaultTab.value === tab && !routeDictionary[tab]) {
      setDefaultTab((Object.keys(routeDictionary) as Route[]).find(key => routeDictionary[key]));
    }
    saveState().catch(err => Logger.error('Failed to save enabled tab extension settings', { tab, err }));
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
        saveState().catch(err => Logger.error('Failed to save restore route extension settings', { value, err }));
      },
    }),
    restorePanel: computed({
      get: () => restorePanel.value,
      set: (value: boolean) => {
        restorePanel.value = value;
        saveState().catch(err => Logger.error('Failed to save restore panel extension settings', { value, err }));
      },
    }),
    loadLists: computed({
      get: () => loadLists.value,
      set: (value: ListEntity[]) => {
        loadLists.value = value;
        saveState().catch(err => Logger.error('Failed to save load lists extension settings', { value, err }));
      },
    }),
    loadListsPageSize: computed({
      get: () => loadListsPageSize.value,
      set: (value: number) => {
        loadListsPageSize.value = value;
        saveState().catch(err => Logger.error('Failed to save load lists page size extension settings', { value, err }));
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
    progressType: computed({
      get: () => progressType.value,
      set: (value: ExtensionSettings['progressType']) => {
        progressType.value = value;
        saveState().catch(err => Logger.error('Failed to save progress type extension settings', { value, err }));
      },
    }),
    enableRatings: computed({
      get: () => enableRatings.value,
      set: (value: boolean) => {
        enableRatings.value = value;
        saveState().catch(err => Logger.error('Failed to save enable ratings extension settings', { value, err }));
      },
    }),
  };
});

export const useExtensionSettingsStoreRefs = () => storeToRefs(useExtensionSettingsStore());

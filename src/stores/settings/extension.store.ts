import { CacheRetention } from '@dvcol/common-utils/common/cache';
import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';
import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref, toRaw } from 'vue';

import type { ListEntity } from '~/models/list.model';

import type { PosterItem } from '~/models/poster.model';

import { NavbarPosition, type NavbarPositions } from '~/models/navbar-position.model';

import { PageSize } from '~/models/page-size.model';
import { ProgressType, type ProgressTypes } from '~/models/progress-type.model';
import { Route } from '~/models/router.model';
import { Logger } from '~/services/logger.service';
import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';
import { clearProxy } from '~/utils/vue.utils';

type CacheRetentionState = {
  trakt: number;
  simkl: number;
  tmdb: number;
};

const DefaultCacheRetention: CacheRetentionState = {
  trakt: CacheRetention.Week,
  simkl: CacheRetention.Week,
  tmdb: CacheRetention.Year,
} as const;

type RouteDictionary = Partial<Record<Route, boolean>>;

const DefaultRoutes: RouteDictionary = {
  [Route.Progress]: false,
  [Route.Calendar]: true,
  [Route.History]: true,
  [Route.Watchlist]: true,
  [Route.Releases]: false,
  [Route.Search]: true,
};

export type ImageType = PosterItem['type'] | 'default';
type ImageTypeDictionary = Partial<Record<Route, ImageType>>;

const DefaultImageTypes: ImageTypeDictionary = {
  [Route.Progress]: 'default',
  [Route.Calendar]: 'default',
  [Route.History]: 'default',
  [Route.Watchlist]: 'default',
  [Route.Releases]: 'default',
  [Route.Search]: 'default',
};

export type ImageFormat = 'backdrop' | 'poster';
type ImageFormatDictionary = Partial<Record<Route, ImageFormat>>;
const DefaultImageFormats: ImageFormatDictionary = {
  [Route.Progress]: 'backdrop',
  [Route.Calendar]: 'backdrop',
  [Route.History]: 'backdrop',
  [Route.Watchlist]: 'poster',
  [Route.Releases]: 'poster',
  [Route.Search]: 'poster',
};

type ExtensionSettings = {
  cacheRetention: CacheRetentionState;
  enabledRoutes: RouteDictionary;
  restoreRoute: boolean;
  restorePanel: boolean;
  loadLists: Record<string, ListEntity[]>;
  loadListsPageSize: number;
  progressType: ProgressTypes;
  enableRatings: boolean;
  backgroundColor: string;
  loadingHysteresis: number;
  navbarPosition: NavbarPositions;
  iconOnly: boolean;
  imageType: ImageTypeDictionary;
  imageFormat: ImageFormatDictionary;
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
  const loadLists = reactive<ExtensionSettings['loadLists']>({});
  const loadListsPageSize = ref<ExtensionSettings['loadListsPageSize']>(PageSize.p500);
  const defaultTab = ref<Route>(Route.Calendar);
  const initialized = ref<Promise<boolean>>();
  const progressType = ref<ExtensionSettings['progressType']>(ProgressType.Show);
  const enableRatings = ref(false);
  const backgroundColor = ref('transparent');
  const loadingHysteresis = ref(-1);
  const navbarPosition = ref<NavbarPositions>(NavbarPosition.Auto);
  const iconOnly = ref(true);
  const imageType = reactive<ExtensionSettings['imageType']>(DefaultImageTypes);
  const imageFormat = reactive<ExtensionSettings['imageFormat']>(DefaultImageFormats);

  const clearState = () => {
    Object.assign(cacheRetention, DefaultCacheRetention);
    Object.assign(routeDictionary, DefaultRoutes);
    Object.assign(imageType, DefaultImageTypes);
    Object.assign(imageFormat, DefaultImageFormats);
    restoreRoute.value = true;
    restorePanel.value = false;
    progressType.value = ProgressType.Show;
    clearProxy(loadLists);
  };

  const saveState = debounce(
    () =>
      storage.sync.set<ExtensionSettings>(ExtensionSettingsConstants.Store, {
        cacheRetention: toRaw(cacheRetention),
        enabledRoutes: toRaw(routeDictionary),
        restoreRoute: restoreRoute.value,
        restorePanel: restorePanel.value,
        loadLists: toRaw(loadLists),
        loadListsPageSize: loadListsPageSize.value,
        progressType: progressType.value,
        enableRatings: enableRatings.value,
        backgroundColor: backgroundColor.value,
        loadingHysteresis: loadingHysteresis.value,
        navbarPosition: navbarPosition.value,
        iconOnly: iconOnly.value,
        imageType: toRaw(imageType),
        imageFormat: toRaw(imageFormat),
      }),
    500,
  );

  const setRetention = (retention: Partial<CacheRetentionState>, persist = true) => {
    if (retention.trakt !== undefined) cacheRetention.trakt = retention.trakt;
    if (retention.tmdb !== undefined) cacheRetention.tmdb = retention.tmdb;
    if (retention.simkl !== undefined) cacheRetention.simkl = retention.simkl;
    TraktService.changeRetention(cacheRetention);
    if (persist) saveState().catch(err => Logger.error('Failed to save extension settings', { retention, err }));
  };

  const { user } = useAuthSettingsStoreRefs();
  const setLoadLists = (value: ListEntity[], _user = user.value) => {
    loadLists[_user] = value;
  };

  const restoreState = async () => {
    const restored = await storage.sync.get<ExtensionSettings>(ExtensionSettingsConstants.Store);

    if (restored?.cacheRetention !== undefined) setRetention(restored.cacheRetention, false);
    if (restored?.enabledRoutes !== undefined) Object.assign(routeDictionary, restored.enabledRoutes);
    if (restored?.restoreRoute !== undefined) restoreRoute.value = restored.restoreRoute;
    if (restored?.restorePanel !== undefined) restorePanel.value = restored.restorePanel;
    if (restored?.loadListsPageSize !== undefined) loadListsPageSize.value = restored.loadListsPageSize;
    if (restored?.progressType !== undefined) progressType.value = restored.progressType;
    if (restored?.enableRatings !== undefined) enableRatings.value = restored.enableRatings;
    if (restored?.loadLists !== undefined) {
      Object.entries(restored.loadLists).forEach(([key, value]) => {
        setLoadLists(Object.values(value), key);
      });
    }
    if (restored?.backgroundColor !== undefined) backgroundColor.value = restored.backgroundColor;
    if (restored?.loadingHysteresis !== undefined) loadingHysteresis.value = restored.loadingHysteresis;
    if (restored?.navbarPosition !== undefined) navbarPosition.value = restored.navbarPosition;
    if (restored?.iconOnly !== undefined) iconOnly.value = restored.iconOnly;
    if (restored?.imageType !== undefined) Object.assign(imageType, restored.imageType);
    if (restored?.imageFormat !== undefined) Object.assign(imageFormat, restored.imageFormat);

    if (!chromeRuntimeId) routeDictionary[Route.Progress] = false;
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

  const getImageSettings = (route: Route) =>
    computed(() => ({
      type: imageType[route] === 'default' ? undefined : imageType[route],
      backdrop: imageFormat[route] === 'backdrop',
    }));

  const setImageType = (route: Route, type: PosterItem['type'] | 'default') => {
    imageType[route] = type;
    saveState().catch(err => Logger.error('Failed to save image type extension settings', { route, type, err }));
  };

  const setImageFormat = (route: Route, format: 'backdrop' | 'poster') => {
    imageFormat[route] = format;
    saveState().catch(err => Logger.error('Failed to save image format extension settings', { route, format, err }));
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
      get: () => loadLists[user.value] ?? [],
      set: (value: ListEntity[]) => {
        setLoadLists(value);
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
    isProgressEnabled: computed(() => routeDictionary[Route.Progress]),
    enabledRoutes: computed(() =>
      Object.entries(routeDictionary)
        .filter(([, value]) => value)
        .map(([key]) => key as Route),
    ),
    traktCacheRetention: computed({
      get: () => cacheRetention.trakt,
      set: (value: number) => setRetention({ trakt: value }),
    }),
    simklCacheRetention: computed({
      get: () => cacheRetention.simkl,
      set: (value: number) => setRetention({ simkl: value }),
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
    backgroundColor: computed({
      get: () => backgroundColor.value,
      set: (value: string) => {
        backgroundColor.value = value;
        saveState().catch(err => Logger.error('Failed to save background color extension settings', { value, err }));
      },
    }),
    loadingHysteresis: computed({
      get: () => loadingHysteresis.value,
      set: (value: number) => {
        loadingHysteresis.value = value;
        saveState().catch(err => Logger.error('Failed to save loading hysteresis extension settings', { value, err }));
      },
    }),
    navbarPosition: computed({
      get: () => navbarPosition.value,
      set: (value: NavbarPositions) => {
        navbarPosition.value = value;
        saveState().catch(err => Logger.error('Failed to save navbar position extension settings', { value, err }));
      },
    }),
    iconOnly: computed({
      get: () => iconOnly.value,
      set: (value: boolean) => {
        iconOnly.value = value;
        saveState().catch(err => Logger.error('Failed to save icon only extension settings', { value, err }));
      },
    }),
    getImageSettings,
    setImageType,
    setImageFormat,
    imageType,
    imageFormat,
  };
});

export const useExtensionSettingsStoreRefs = () => storeToRefs(useExtensionSettingsStore());

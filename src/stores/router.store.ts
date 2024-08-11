import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

import type { RouteLocationNormalized } from 'vue-router';

import { RouterStorageKey } from '~/models/router.model';
import { storage } from '~/utils/browser/browser-storage.utils';

const parseQuery = (location: Location) => {
  const params = new URLSearchParams(location.href.split('?').at(1)?.replace(/#.*$/, ''));
  if (params.has('code')) {
    const url = new URL(location.href);
    url.searchParams.delete('code');
    window.history.replaceState({}, document.title, url);
  }
  return Object.fromEntries(params.entries());
};

export const useRouterStore = defineStore('router', () => {
  const initialLocation = ref({ ...window.location });
  const routeParam = ref<Record<string, string> | undefined>(parseQuery(initialLocation.value));
  const lastRoute = ref<RouteLocationNormalized>();

  const setRouteParam = (params?: Record<string, string>) => {
    routeParam.value = params;
  };

  const setLastRoute = (_route: RouteLocationNormalized) => {
    if (lastRoute.value?.name === _route.name) return;
    lastRoute.value = _route;
    const { matched, ...jsonSafeRoute } = _route;
    return storage.local.set(RouterStorageKey.LastRoute, jsonSafeRoute);
  };

  const restoreLastRoute = async () => {
    const _route = await storage.local.get<RouteLocationNormalized>(RouterStorageKey.LastRoute);
    if (_route) lastRoute.value = _route;
    return lastRoute.value;
  };

  const baseName = ref('');
  const setBaseName = (name: string) => {
    baseName.value = name;
  };

  const baseUrl = ref('');
  const setBaseUrl = (url: string) => {
    baseUrl.value = url;
  };

  return { baseName, setBaseName, baseUrl, setBaseUrl, initialLocation, routeParam, setRouteParam, lastRoute, setLastRoute, restoreLastRoute };
});

export const useRouterStoreRefs: () => ReturnType<typeof storeToRefs<ReturnType<typeof useRouterStore>>> = () => storeToRefs(useRouterStore());

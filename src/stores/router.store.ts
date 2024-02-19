import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

const parseQuery = (location: Location) => {
  const params = new URLSearchParams(location.href.split('?').at(1));
  return Object.fromEntries(params.entries());
};

export const useRouterStore = defineStore('router', () => {
  const initialLocation = ref({ ...window.location });
  const routeParam = ref<Record<string, string> | undefined>(parseQuery(initialLocation.value));
  const setRouteParam = (params?: Record<string, string>) => {
    routeParam.value = params;
  };

  const baseName = ref('');
  const setBaseName = (name: string) => {
    baseName.value = name;
  };

  const baseUrl = ref('');
  const setBaseUrl = (url: string) => {
    baseUrl.value = url;
  };

  return { baseName, setBaseName, baseUrl, setBaseUrl, initialLocation, routeParam, setRouteParam };
});

export const useRouterStoreRefs = () => storeToRefs(useRouterStore());

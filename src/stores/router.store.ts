import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRouterStore = defineStore('router', () => {
  const initialLocation = ref({ ...window.location });
  const routeParam = ref<Record<string, string> | undefined>(Object.fromEntries(new URLSearchParams(initialLocation.value.search).entries()));
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

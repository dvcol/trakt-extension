import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

import { createTab } from '~/utils/browser/browser.utils';

export const useExtensionSettingsStore = defineStore('settings.extension', () => {
  const openLinksInNewTab = ref(true);
  const restoreRoute = ref(true);

  const openTab = (url?: string) => {
    if (!url) return;
    createTab({ url, active: openLinksInNewTab.value });
  };

  return { restoreRoute, openLinksInNewTab, openTab };
});

export const useExtensionSettingsStoreRefs = () => storeToRefs(useExtensionSettingsStore());

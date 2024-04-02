import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

export const useExtensionSettingsStore = defineStore('settings.extension', () => {
  const openLinksInNewTab = ref(true);
  const restoreRoute = ref(true);

  return { openLinksInNewTab, restoreRoute };
});

export const useExtensionSettingsStoreRefs = () => storeToRefs(useExtensionSettingsStore());

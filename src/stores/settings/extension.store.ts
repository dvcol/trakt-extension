import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

export const useExtensionSettingsStore = defineStore('settings.extension', () => {
  const openLinksInNewTab = ref(true);

  return { openLinksInNewTab };
});

export const useExtensionSettingsStoreRefs = () => storeToRefs(useExtensionSettingsStore());

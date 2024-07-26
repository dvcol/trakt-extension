import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

export const useAppStateStore = defineStore('app.state', () => {
  const isAppReady = ref(false);
  const panelOpen = ref(false);
  const panelDirty = ref(false);
  const footerOpen = ref(false);

  let resolve: (value: boolean) => void;
  const waitAppReady = ref<Promise<boolean>>(
    new Promise(_resolve => {
      resolve = _resolve;
    }),
  );

  const setAppReady = (ready: boolean) => {
    isAppReady.value = ready;
    resolve(ready);
    waitAppReady.value = Promise.resolve(ready);
  };

  return { isAppReady, setAppReady, waitAppReady, panelOpen, panelDirty, footerOpen };
});

export const useAppStateStoreRefs = () => storeToRefs(useAppStateStore());

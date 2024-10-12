import { LogLevel } from '@dvcol/common-utils/common/logger';
import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import type { StorageChangeCallback } from '@dvcol/web-extension-utils/chrome/storage';

import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';

type LogSettings = {
  logLevel: LogLevel;
};

const LogStoreConstants = {
  Store: 'settings.logs',
} as const;

export const useLogStore = defineStore(LogStoreConstants.Store, () => {
  const logLevel = ref<LogLevel>(LogLevel.Warn);

  const clearState = () => {
    logLevel.value = LogLevel.Warn;
  };

  const saveState = debounce(() => storage.sync.set(LogStoreConstants.Store, { logLevel: logLevel.value }), 500);

  const restoreState = async () => {
    const restored = await storage.sync.get<LogSettings>(LogStoreConstants.Store);
    if (restored?.logLevel !== undefined) logLevel.value = restored.logLevel;
  };

  const getChangeCallback: (name: string) => StorageChangeCallback = (name: string) => changes => {
    if (logLevel.value < LogLevel.Debug) return;
    console.debug(`[${name}]: Storage changes`, changes);
  };

  let subs: (() => void)[] = [];
  const initLogStore = async () => {
    await restoreState();
    subs.push(storage.sync.listen(getChangeCallback('sync')));
    subs.push(storage.local.listen(getChangeCallback('local')));
    subs.push(storage.session.listen(getChangeCallback('session')));
  };

  const destroyLogStore = () => {
    subs.forEach(sub => sub());
    subs = [];
  };

  return {
    initLogStore,
    destroyLogStore,
    clearState,
    saveState,
    logLevel: computed({
      get: () => logLevel.value,
      set: async (value: LogLevel) => {
        logLevel.value = value;
        await saveState();
      },
    }),
  };
});

export const useLogStoreRefs = () => storeToRefs(useLogStore());

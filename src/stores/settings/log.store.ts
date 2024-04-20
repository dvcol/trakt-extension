import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';

export enum LogLevel {
  Error,
  Warn,
  Info,
  Debug,
}

type LogSettings = {
  logLevel: LogLevel;
};

export const useLogStore = defineStore('settings.logs', () => {
  const logLevel = ref<LogLevel>(LogLevel.Warn);

  const clearState = () => {
    logLevel.value = LogLevel.Warn;
  };

  const saveState = debounce(() => storage.sync.set('settings.logs', { logLevel: logLevel.value }), 500);

  const restoreState = async () => {
    const restored = await storage.sync.get<LogSettings>('settings.logs');
    if (restored?.logLevel !== undefined) logLevel.value = restored.logLevel;
  };

  const initLogStore = async () => {
    await restoreState();
  };

  return {
    initLogStore,
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

export const logger = {
  get debug() {
    if (useLogStore().logLevel < LogLevel.Debug) return () => {};
    return console.debug.bind(console);
  },
  get info() {
    if (useLogStore().logLevel < LogLevel.Info) return () => {};
    return console.info.bind(console);
  },
  get warn() {
    if (useLogStore().logLevel < LogLevel.Warn) return () => {};
    return console.warn.bind(console);
  },
  get error() {
    if (useLogStore().logLevel < LogLevel.Error) return () => {};
    return console.error.bind(console);
  },
};

import type { RecursiveRecord } from '~/utils/typescript.utils';

/**
 * @see [chrome.storage.sync](https://developer.chrome.com/docs/extensions/reference/storage/#type-SyncStorageArea)
 */
export const syncStorage: chrome.storage.SyncStorageArea = window?.chrome?.storage?.sync;

/**
 * @see [chrome.storage.local](https://developer.chrome.com/docs/extensions/reference/storage/#type-LocalStorageArea)
 */
export const localStorage: chrome.storage.LocalStorageArea = window?.chrome?.storage?.local;

/**
 * @see [chrome.storage.session](https://developer.chrome.com/docs/extensions/reference/storage/#type-StorageArea)
 */
export const sessionStorage: chrome.storage.StorageArea = window?.chrome?.storage?.session;

const filterObject = (object: Record<string, unknown>, regex: string | RegExp) =>
  Object.fromEntries(Object.entries(object).filter(([key]) => (typeof regex === 'string' ? new RegExp(regex) : regex).test(key)));

const reverseFilterObject = (object: Record<string, unknown>, regex: string | RegExp) =>
  Object.fromEntries(Object.entries(object).filter(([key]) => !(typeof regex === 'string' ? new RegExp(regex) : regex).test(key)));

/**
 * This function is used to wrap the storage areas to provide type inference and a more convenient interface.
 * @param area The storage area to wrap.
 * @param name The name of the storage area.
 */
export const storageWrapper = (area: chrome.storage.StorageArea, name: string) => {
  if (!window?.chrome?.storage) {
    console.warn('Storage API is not available, using local storage instead.');

    const storage = {
      id: `trakt-${name}-storage`,
      get values(): RecursiveRecord {
        const _value = window.localStorage.getItem(this.id);
        if (!_value) return {};
        return JSON.parse(_value);
      },
      set values(value: unknown) {
        window.localStorage.setItem(this.id, JSON.stringify(value));
      },
      setItem(key: string, value: unknown) {
        this.values = { ...this.values, [key]: value };
      },
      removeItem(key: string) {
        this.values = { ...this.values, [key]: undefined };
      },
      clear() {
        this.values = {};
      },
    };

    window.trakt = { ...window.trakt, [name]: storage };
    return {
      getAll: async <T>(regex?: string | RegExp): Promise<T> => (regex ? filterObject(storage.values, regex) : storage.values) as T,
      get: async <T>(key: string): Promise<T> => storage.values[key] as T,
      set: async <T>(key: string, value: T): Promise<void> => storage.setItem(key, value),
      remove: async (key: string): Promise<void> => storage.removeItem(key),
      removeAll: async (regex: string | RegExp): Promise<void> => {
        storage.values = reverseFilterObject(storage.values, regex);
      },
      clear: async (): Promise<void> => storage.clear(),
    };
  }
  return {
    getAll: <T>(regex?: string | RegExp): Promise<T> => area.get().then(data => (regex ? filterObject(data, regex) : data) as T),
    get: <T>(key: string): Promise<T> => area.get(key).then(({ [key]: value }) => value),
    set: <T>(key: string, value: T): Promise<void> => area.set({ [key]: value }),
    remove: (key: string): Promise<void> => area.remove(key),
    removeAll: async (regex: string | RegExp): Promise<void> => {
      const data = await area.get();
      const _regex = typeof regex === 'string' ? new RegExp(regex) : regex;
      await Promise.all(
        Object.keys(data).map(key => {
          if (_regex.test(key)) return area.remove(key);
          return Promise.resolve();
        }),
      );
    },
    clear: (): Promise<void> => area.clear(),
  };
};

export type StorageArea = ReturnType<typeof storageWrapper>;

/**
 * This object is used to access the storage areas.
 */
export const storage = {
  sync: storageWrapper(syncStorage, 'sync'),
  local: storageWrapper(localStorage, 'local'),
  session: storageWrapper(sessionStorage, 'session'),
};

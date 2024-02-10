/**
 * @see [chrome.storage.sync](https://developer.chrome.com/docs/extensions/reference/storage/#type-SyncStorageArea)
 */
export const syncStorage: chrome.storage.SyncStorageArea = chrome?.storage?.sync;

/**
 * @see [chrome.storage.local](https://developer.chrome.com/docs/extensions/reference/storage/#type-LocalStorageArea)
 */
export const localStorage: chrome.storage.LocalStorageArea = chrome?.storage?.local;

/**
 * @see [chrome.storage.session](https://developer.chrome.com/docs/extensions/reference/storage/#type-StorageArea)
 */
export const sessionStorage: chrome.storage.StorageArea = chrome?.storage?.session;

/**
 * This function is used to wrap the storage areas to provide type inference and a more convenient interface.
 * @param area The storage area to wrap.
 */
export const storageWrapper = (area: chrome.storage.StorageArea) => ({
  get: <T>(key: string): Promise<T> => area.get(key).then(({ [key]: value }) => value),
  set: <T>(key: string, value: T): Promise<void> => area.set({ [key]: value }),
  remove: (key: string): Promise<void> => area.remove(key),
  clear: (): Promise<void> => area.clear(),
});

/**
 * This object is used to access the storage areas.
 */
export const storage = {
  sync: storageWrapper(syncStorage),
  local: storageWrapper(localStorage),
  session: storageWrapper(sessionStorage),
};
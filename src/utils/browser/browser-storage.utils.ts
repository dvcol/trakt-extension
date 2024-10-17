import { localStorage, setStorageWrapper as _setStorageWrapper, storageWrapper, syncStorage } from '@dvcol/web-extension-utils/chrome/storage';

/**
 * This object is used to access the storage areas.
 */
export const storage = {
  sync: storageWrapper('sync', syncStorage, 'trakt'),
  local: storageWrapper('local', localStorage, 'trakt'),
};

/**
 * Wrapper around the storage set method with additional checks for the size of the storage and storage eviction.
 * @param key The key to store the value under.
 * @param value The payload to store.
 * @param regex An optional regex to filter the keys to remove when the storage is full.
 */
export const setStorageWrapper = <T>(key: string, value: T, regex?: string | RegExp) => _setStorageWrapper(key, value, regex, storage.local);

import { storage, type StorageArea } from '~/utils/browser/browser-storage.utils';

export type CacheStoreEntity<T = unknown> = {
  value: T;
  cachedAt: number;
  accessedAt?: number;
};

export type CacheStore<T = unknown> = {
  get(key: string): CacheStoreEntity<T> | Promise<CacheStoreEntity<T>> | undefined;
  set(key: string, value: CacheStoreEntity<T>): CacheStore<T> | Promise<CacheStore<T>>;
  delete(key: string): boolean | Promise<boolean>;
  clear(): void;
  /** the duration in milliseconds after which the cache will be cleared */
  retention?: number;
};

export class ChromeCacheStore<T> implements CacheStore<T> {
  retention?: number;
  store: StorageArea;
  prefix: string;

  constructor({
    retention = 24 * 60 * 60,
    store = storage.local,
    prefix = 'http-cache',
  }: {
    retention?: number;
    store?: StorageArea;
    prefix?: string;
  }) {
    this.retention = retention;
    this.store = store;
    this.prefix = prefix;
  }

  async get(key: string) {
    return this.store.get<CacheStoreEntity<T>>(`${this.prefix}:${key}`);
  }

  async set(key: string, value: CacheStoreEntity<T>) {
    await this.store.set(`${this.prefix}:${key}`, value);
    return this;
  }

  async delete(key: string) {
    await this.store.remove(`${this.prefix}:${key}`);
    return true;
  }

  async clear() {
    return this.store.clear();
  }
}

export type CacheStoreEntity<T> = {
  value: T;
  cachedAt: number;
  accessedAt?: number;
};

export type CacheStore<T> = {
  get(key: string): CacheStoreEntity<T> | Promise<CacheStoreEntity<T>> | undefined;
  set(key: string, value: CacheStoreEntity<T>): CacheStore<T> | Promise<CacheStore<T>>;
  delete(key: string): boolean | Promise<boolean>;
  clear(): void;
  /** the duration in milliseconds after which the cache will be cleared */
  retention?: number;
};

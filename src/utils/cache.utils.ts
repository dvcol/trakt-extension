import type { ResponseOrTypedResponse, TypedResponse } from '~/services/common/base-client';

import { storage, type StorageArea } from '~/utils/browser/browser-storage.utils';

export type CacheStoreEntity<V = unknown, T = string> = {
  value: V;
  type?: T;
  cachedAt: number;
  accessedAt?: number;
};

export type CacheStore<T = unknown> = {
  get(key: string): CacheStoreEntity<T> | Promise<CacheStoreEntity<T>> | undefined;
  set(key: string, value: CacheStoreEntity<T>): CacheStore<T> | Promise<CacheStore<T>>;
  delete(key: string): boolean | Promise<boolean>;
  clear(regex?: string): void;
  /** the duration in milliseconds after which the cache will be cleared */
  retention?: number;
  /** if true, the cache will be deleted if an error occurs */
  evictOnError?: boolean;
};

type FlatResponse<T extends Response = ResponseOrTypedResponse> = Record<keyof T, unknown>;

const flattenResponse = async <T extends Response = ResponseOrTypedResponse>(res: T): Promise<FlatResponse<T>> => {
  const body = await res.json();
  return {
    ...res,
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
    url: res.url,
    redirected: res.redirected,
    type: res.type,
    ok: res.ok,
    body,
  };
};

const parseFlatResponse = <T = unknown>(flat: FlatResponse): TypedResponse<T> => {
  const res = new Response(JSON.stringify(flat?.body ?? ''));

  Object.entries(flat).forEach(([_key, value]) => {
    Object.defineProperty(res, _key, { value });
  });

  res.clone = () => parseFlatResponse(flat);

  return res;
};

export class ChromeCacheStore<T> implements CacheStore<T> {
  retention?: number;
  store: StorageArea;
  prefix: string;

  constructor({
    retention = 24 * 60 * 60 * 1000,
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
    const restored = await this.store.get<CacheStoreEntity<T>>(`${this.prefix}:${key}`);
    if (restored?.type === 'response') {
      restored.value = parseFlatResponse(restored.value as FlatResponse) as T;
    }
    return restored;
  }

  async set(key: string, value: CacheStoreEntity<T>) {
    if (value.value instanceof Response) {
      value.type = 'response';
      value.value = (await flattenResponse(value.value)) as T;
    }
    await this.store.set(`${this.prefix}:${key}`, value);
    return this;
  }

  async delete(key: string) {
    await this.store.remove(`${this.prefix}:${key}`);
    return true;
  }

  async clear(regex: string = '') {
    return this.store.removeAll(`^${this.prefix}:${regex}`);
  }
}

import { CacheRetention } from '@dvcol/common-utils/common/cache';

import type { ResponseOrTypedResponse, TypedResponse } from '@dvcol/base-http-client';
import type { CacheStore, CacheStoreEntity } from '@dvcol/common-utils/common';

import { localCache, storage, type StorageArea } from '~/utils/browser/browser-storage.utils';

type FlatResponse<T extends Response = ResponseOrTypedResponse> = Record<keyof T, unknown>;

const flattenResponse = async <T extends Response = ResponseOrTypedResponse>(res: T): Promise<FlatResponse<T>> => {
  const body = await res.json();
  return {
    ...res,
    status: res.status,
    statusText: res.statusText,
    headers: Object.fromEntries(res.headers.entries()),
    url: res.url,
    redirected: res.redirected,
    type: res.type,
    ok: res.ok,
    body,
    bodyUsed: res.bodyUsed,
  };
};

const parseFlatResponse = <T = unknown>(flat: FlatResponse): TypedResponse<T> => {
  const res = new Response(JSON.stringify(flat?.body ?? ''));

  Object.entries(flat).forEach(([_key, value]) => {
    if (_key === 'body') return;
    if (_key === 'headers') {
      Object.entries(value as Record<string, string>).forEach(([key, val]) => res.headers.append(key, val));
      return;
    }
    Object.defineProperty(res, _key, { value });
  });

  res.clone = () => parseFlatResponse(flat);

  return res;
};

export class ChromeCacheStore<T> implements CacheStore<T> {
  evictOnError?: boolean;
  retention?: number;
  store: StorageArea;
  prefix: string;

  constructor({
    evictOnError = true,
    retention = CacheRetention.Month,
    store = storage.local,
    prefix = 'http-cache',
  }: {
    evictOnError?: boolean;
    retention?: number;
    store?: StorageArea;
    prefix?: string;
  }) {
    this.evictOnError = evictOnError;
    this.retention = retention;
    this.store = {
      ...store,
      set: <V>(key: string, value: V) => localCache(key, value, this.prefix),
    };
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

export const CachePrefix = {
  Trakt: 'trakt-cache' as const,
  Tmdb: 'tmdb-cache' as const,
  Tvdb: 'tvdb-cache' as const,
} as const;

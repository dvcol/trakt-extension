import { ChromeCacheStore } from '@dvcol/web-extension-utils/chrome/cache';

import type { ResponseOrTypedResponse, TypedResponse } from '@dvcol/base-http-client';
import type { CacheStoreEntity } from '@dvcol/common-utils/common';
import type { StorageAreaWrapper } from '@dvcol/web-extension-utils/chrome/storage';

import { storage } from '~/utils/browser/browser-storage.utils';

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

export class TraktChromeCacheStore<T> extends ChromeCacheStore<T> {
  constructor({
    saveRetention,
    saveAccess,
    evictOnError,
    retention,
    store,
    prefix,
  }: {
    saveRetention?: boolean;
    saveAccess?: boolean;
    evictOnError?: boolean;
    retention?: number;
    store?: StorageAreaWrapper;
    prefix?: string;
  }) {
    super({
      saveRetention,
      saveAccess,
      evictOnError,
      retention,
      store: store ?? storage.local,
      prefix,
    });
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
}

export const CachePrefix = {
  Trakt: 'trakt-cache' as const,
  Simkl: 'simkl-cache' as const,
  Tmdb: 'tmdb-cache' as const,
} as const;

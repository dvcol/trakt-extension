import { type BaseInit, ExactMatchRegex, getCachedFunction, type TypedResponse } from '@dvcol/base-http-client';
import { CacheRetention } from '@dvcol/common-utils/common/cache';

import { getJsonWriter } from '@dvcol/common-utils/common/save';

import { isResponseOk } from '@dvcol/trakt-http-client';

import { TraktApiExtended, type TraktApiParamsExtended, type TraktApiParamsPagination, type TraktApiResponse } from '@dvcol/trakt-http-client/models';

import { getCookie } from '@dvcol/web-extension-utils/chrome/cookie';

import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';
import { reactive, ref, type Ref } from 'vue';

import type { CacheStore } from '@dvcol/common-utils';
import type { RecursiveRecord } from '@dvcol/common-utils/common';
import type { JsonWriterOptions } from '@dvcol/common-utils/common/save';

import type { CancellablePromise } from '@dvcol/common-utils/http/fetch';

import type { StorePagination } from '~/models/pagination.model';

import type { ProgressItem } from '~/models/progress.model';

import { PageSize } from '~/models/page-size.model';

import { ExternaLinks } from '~/settings/external.links';

import { WebConfig } from '~/settings/web.config';
import { clearAssign } from '~/utils/vue.utils';

type PaginatedQuery = TraktApiParamsExtended & TraktApiParamsPagination;
export const paginatedWriteJson = async <Q extends PaginatedQuery = PaginatedQuery, T extends RecursiveRecord = RecursiveRecord>(
  fetch: (query: Q) => Promise<TraktApiResponse<T>>,
  query: Q = { extended: TraktApiExtended.Full, pagination: { limit: PageSize.p1000 } } as Q,
  writerOptions?: JsonWriterOptions,
  cancel?: Ref<boolean>,
  pagination?: StorePagination,
): Promise<FileSystemFileHandle> => {
  let response$ = fetch(query);
  const writer = await getJsonWriter(writerOptions);
  let response = await response$;
  if (pagination) clearAssign(pagination, response.pagination);
  let data = await response.json();

  /* eslint-disable no-await-in-loop */
  try {
    await writer.write(data);
    while (!cancel?.value && response.pagination?.page !== undefined && response.pagination.page < response.pagination.pageCount) {
      response$ = fetch({ ...query, pagination: { ...query.pagination, page: response.pagination.page + 1 } });
      response = await response$;
      if (pagination) clearAssign(pagination, response.pagination);
      data = await response.json();
      await writer.write(data);
    }
  } finally {
    await writer.close();
  }
  /* eslint-enable no-await-in-loop */
  return writer.handle;
};

export type CancellableWritePromise<T> = Promise<T> & { cancel: () => Promise<T>; pagination: StorePagination };
export const cancellablePaginatedWriteJson = <Q extends PaginatedQuery = PaginatedQuery, T extends RecursiveRecord = RecursiveRecord>(
  fetch: (query: Q) => Promise<TraktApiResponse<T>>,
  query: Q = { extended: TraktApiExtended.Full, pagination: { limit: PageSize.p1000 } } as Q,
  writerOptions?: JsonWriterOptions & { separator?: string },
): CancellableWritePromise<FileSystemFileHandle> => {
  const cancel = ref(false);
  const pagination = reactive<StorePagination>({});
  const promise = paginatedWriteJson(fetch, query, writerOptions, cancel, pagination) as CancellableWritePromise<FileSystemFileHandle>;
  promise.cancel = () => {
    cancel.value = true;
    return promise;
  };
  promise.pagination = pagination;
  return promise;
};

export const getSessionUser = async (): Promise<string | undefined> => {
  if (!getCookie) return;
  const cookie = await getCookie({
    url: ExternaLinks.trakt.onDeck(),
    name: 'trakt_username',
  });
  return cookie?.value;
};

export const getCachedProgressEndpoint = (cache: CacheStore<TraktApiResponse>) => {
  const origin = chromeRuntimeId ? undefined : `${WebConfig.CorsProxy}/${WebConfig.CorsPrefix.Trakt}`;
  const url: string = ExternaLinks.trakt.onDeck(origin);
  const template = { method: 'GET', url };
  const baseInit: BaseInit = { credentials: 'include' };
  return getCachedFunction(
    // @ts-expect-error -- CancellablePromise extends promise
    async (init?: BaseInit): CancellablePromise<TypedResponse<ProgressItem[]>> => {
      const response = await fetch(url, { ...baseInit, ...init });

      isResponseOk(response);

      const htmlString = await response.text();
      const htmlDoc = new DOMParser().parseFromString(htmlString, 'text/html');
      const data = Array.from(htmlDoc.querySelectorAll<HTMLAnchorElement>('a[class="watch"]')).map(
        a => ({ ...a.dataset }) as unknown as ProgressItem,
      );

      return new Response(JSON.stringify(data)) as TypedResponse<ProgressItem[]>;
    },
    {
      cache,
      retention: CacheRetention.Hour * 2,
      key: (param, init) => {
        return JSON.stringify({
          template,
          param,
          init: { ...baseInit, ...init },
        });
      },
      evictionKey: `{"template":${JSON.stringify(template).replace(ExactMatchRegex, '\\$&')}`,
    },
  );
};

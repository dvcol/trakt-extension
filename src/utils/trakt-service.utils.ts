import {
  TraktApiExtended,
  type TraktApiParamsExtended,
  type TraktApiParamsPagination,
  type TraktApiResponse,
  type TraktClientPagination,
} from '@dvcol/trakt-http-client/models';

import { reactive, ref, type Ref } from 'vue';

import type { RecursiveRecord } from '@dvcol/common-utils/common';

import { getJsonWriter, type JsonWriterOptions } from '~/utils/save.utils';

type PaginatedQuery = TraktApiParamsExtended & TraktApiParamsPagination;
export const paginatedWriteJson = async <Q extends PaginatedQuery = PaginatedQuery, T extends RecursiveRecord = RecursiveRecord>(
  fetch: (query: Q) => Promise<TraktApiResponse<T>>,
  query: Q = { extended: TraktApiExtended.Full, pagination: { limit: 1000 } } as Q,
  writerOptions?: JsonWriterOptions,
  cancel?: Ref<boolean>,
  pagination?: Partial<TraktClientPagination>,
): Promise<FileSystemFileHandle> => {
  let response$ = fetch(query);
  const writer = await getJsonWriter(writerOptions);
  let response = await response$;
  if (pagination) Object.assign(pagination, response.pagination);
  let data = await response.json();

  /* eslint-disable no-await-in-loop */
  try {
    await writer.write(data);
    while (!cancel?.value && response.pagination?.page !== undefined && response.pagination.page < response.pagination.pageCount) {
      response$ = fetch({ ...query, pagination: { ...query.pagination, page: response.pagination.page + 1 } });
      response = await response$;
      if (pagination) Object.assign(pagination, response.pagination);
      data = await response.json();
      await writer.write(data);
    }
  } finally {
    await writer.close();
  }
  /* eslint-enable no-await-in-loop */
  return writer.handle;
};

export type CancellableWritePromise<T> = Promise<T> & { cancel: () => Promise<T>; pagination: Partial<TraktClientPagination> };
export const cancellablePaginatedWriteJson = <Q extends PaginatedQuery = PaginatedQuery, T extends RecursiveRecord = RecursiveRecord>(
  fetch: (query: Q) => Promise<TraktApiResponse<T>>,
  query: Q = { extended: TraktApiExtended.Full, pagination: { limit: 1000 } } as Q,
  writerOptions?: JsonWriterOptions & { separator?: string },
): CancellableWritePromise<FileSystemFileHandle> => {
  const cancel = ref(false);
  const pagination = reactive<Partial<TraktClientPagination>>({});
  const promise = paginatedWriteJson(fetch, query, writerOptions, cancel, pagination) as CancellableWritePromise<FileSystemFileHandle>;
  promise.cancel = () => {
    cancel.value = true;
    return promise;
  };
  promise.pagination = pagination;
  return promise;
};

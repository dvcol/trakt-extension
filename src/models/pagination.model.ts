import type { TraktClientPagination } from '@dvcol/trakt-http-client/models';

export type StorePagination = Partial<TraktClientPagination>;

export const pageLoaded = (pagination?: StorePagination) => {
  if (!pagination) return false;
  const { page, pageCount: total } = pagination;
  if (page === undefined || total === undefined) return false;
  if (total === 0) return true;
  return page >= total;
};

export const pageNotLoaded = (pagination?: StorePagination) => {
  return !pageLoaded(pagination);
};

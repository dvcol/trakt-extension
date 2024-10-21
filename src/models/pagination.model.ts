import type { TmdbApiPagination } from '@dvcol/tmdb-http-client/dist/models/tmdb-client.model';
import type { TraktClientPagination } from '@dvcol/trakt-http-client/models';

export type StorePagination = Partial<TraktClientPagination> | Partial<TmdbApiPagination>;
export type LoadedStorePagination<T extends TraktClientPagination | TmdbApiPagination> = T &
  ('pageCount' extends keyof T ? { page: number; pageCount: number } : { page: number; total_pages: number });

export const pageLoaded = <T extends TraktClientPagination | TmdbApiPagination>(pagination?: T) => {
  if (!pagination) return false;
  const { page, pageCount, total_pages } = pagination;
  const _total = total_pages ?? pageCount;
  if (page === undefined || _total === undefined) return false;
  if (_total === 0) return true;
  return page >= _total;
};

export const pageNotLoaded = <T extends TraktClientPagination | TmdbApiPagination>(pagination?: T) => {
  return !pageLoaded(pagination);
};

import type { TraktApiIds } from '~/models/trakt-id.model';

export type TraktSeason = {
  number: number;
  ids: Pick<TraktApiIds, 'trakt' | 'tvdb' | 'tmdb'>;
};

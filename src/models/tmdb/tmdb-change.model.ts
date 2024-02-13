import type { RecursiveRecord } from '~/utils/typescript.utils';

export type TmdbChange<T = RecursiveRecord | string | number | boolean> = {
  id: string;
  action: string;
  /** * YYY-MM-DD HH:mm:ss UTC */
  time: string;
  /** ISO 639-1 language code */
  iso_639_1: string;
  /** ISO 3166-1 country code */
  iso_3166_1: string;
  original_value?: T;
  value?: T;
};

export type TmdbChanges<T extends RecursiveRecord = TmdbChange> = {
  changes: Array<{
    key: string;
    items: T[];
  }>;
};

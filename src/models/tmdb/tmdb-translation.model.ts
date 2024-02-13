import type { RecursiveRecord } from '~/utils/typescript.utils';

export type TmdbTranslationData = {
  title: string;
  overview: string;
  homepage: string;
};

export type TmdbTranslation<D extends RecursiveRecord = TmdbTranslationData> = {
  /** The ISO 3166-1 code of the country */
  iso_3166_1: string;
  /** The ISO 639-1 code of the language */
  iso_639_1: string;
  name: string;
  english_name: string;
  data: D;
};

export type TmdbTranslations<D extends RecursiveRecord = TmdbTranslationData> = {
  id: number;
  translations: TmdbTranslation<D>[];
};

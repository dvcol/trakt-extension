export type TmdbTranslation = {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: {
    title: string;
    overview: string;
    homepage: string;
  };
};

export type TmdbTranslations = {
  id: number;
  translations: TmdbTranslation[];
};

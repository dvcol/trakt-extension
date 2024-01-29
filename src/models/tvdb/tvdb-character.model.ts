import type { TvdbAlias, TvdbTagOption } from '~/models/tvdb/tvdb-entity.model';

export type TvdbCharacter = {
  id: number;
  name: string;
  image: string;
  sort: number;
  type: number;
  isFeatured: boolean;
  aliases: TvdbAlias[];
  nameTranslations: string[];
  overviewTranslations: string[];
  peopleId: number;
  peopleType: string;
  url: string;
  personName: string;
  personImgURL: string;
  tagOptions: TvdbTagOption[];
  episodeId: number;
  episode: {
    image: string;
    name: string;
    year: string;
  };
  movieId: number;
  movie: {
    image: string;
    name: string;
    year: string;
  };
  seriesId: number;
  series: {
    image: string;
    name: string;
    year: string;
  };
};

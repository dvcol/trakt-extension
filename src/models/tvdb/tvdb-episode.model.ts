import type { TvdbCharacter } from '~/models/tvdb/tvdb-character.model';
import type { TvdbCompany } from '~/models/tvdb/tvdb-company.model';
import type { Entity, EntityTypes, Extended, Short, TvdbRemoteId, TvdbTagOption } from '~/models/tvdb/tvdb-entity.model';
import type { TvdbNomination } from '~/models/tvdb/tvdb-nomination.model';
import type { TvdbRating } from '~/models/tvdb/tvdb-rating.model';
import type { TvdbSeason } from '~/models/tvdb/tvdb-season.model';
import type { TvdbTrailer } from '~/models/tvdb/tvdb-trailer.model';
import type { TvdbTranslation } from '~/models/tvdb/tvdb-translation.model';

export type TvdbEpisodeShort = {
  id: number;
  name: string;
  number: number;
  overview?: string;
  runtime: number;
  year?: string;
  aired: string;
  airsAfterSeason?: number;
  airsBeforeEpisode?: number;
  airsBeforeSeason?: number;
  lastUpdated: string;
  finaleType: string;
  image: string;
  imageType: number;
  isMovie: number;
  linkedMovie?: number;
  seriesId: number;
  seasonNumber: number;
  seasonName?: string;
  seasons?: TvdbSeason[];
  nameTranslations: string[];
  overviewTranslations?: string[];
};

export type TvdbEpisodeExtended = TvdbEpisodeShort & {
  awards: Entity[];
  characters: TvdbCharacter[];
  companies: TvdbCompany[];
  contentRatings: TvdbRating[];
  networks: TvdbCompany[];
  nominations: TvdbNomination[];
  productionCode: string;
  remoteIds: TvdbRemoteId[];
  seasons: TvdbSeason[];
  studios: TvdbCompany[];
  tagOptions: TvdbTagOption[];
  trailers: TvdbTrailer[];
  translations: {
    nameTranslations: TvdbTranslation[];
    overviewTranslations: TvdbTranslation[];
    alias: string[];
  };
};

export type TvdbEpisode<T extends EntityTypes = Short> = T extends Short
  ? TvdbEpisodeShort
  : T extends Extended
    ? TvdbEpisodeExtended
    : TvdbEpisodeShort | TvdbEpisodeExtended;

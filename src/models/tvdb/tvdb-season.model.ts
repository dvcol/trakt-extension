import type { TvdbArtwork } from '~/models/tvdb/tvdb-artwork.model';
import type { TvdbCompany } from '~/models/tvdb/tvdb-company.model';
import type { EntityTypes, Extended, Short, TvdbTagOption } from '~/models/tvdb/tvdb-entity.model';
import type { TvdbEpisode } from '~/models/tvdb/tvdb-episode.model';
import type { TvdbTrailer } from '~/models/tvdb/tvdb-trailer.model';
import type { TvdbTranslation } from '~/models/tvdb/tvdb-translation.model';

export type TvdbSeasonType = {
  alternateName: string;
  id: number;
  name: string;
  type: string;
};

export type TvdbSeasonShort = {
  id: number;
  name: string;
  number: number;
  year: string;
  image: string;
  imageType: number;
  nameTranslations: string[];
  overviewTranslations: string[];
  seriesId: number;
  type: TvdbSeasonType;
  companies: {
    studio: TvdbCompany;
    network: TvdbCompany;
    production: TvdbCompany;
    distributor: TvdbCompany;
    special_effects: TvdbCompany;
  };
  lastUpdated: string;
};

export type TvdbSeasonExtended = TvdbSeasonShort & {
  artwork: TvdbArtwork[];
  episodes: TvdbEpisode[];
  trailers: TvdbTrailer[];
  tagOptions: TvdbTagOption[];
  translations: TvdbTranslation[];
  year: 'string';
};

export type TvdbSeason<T extends EntityTypes = Short> = T extends Short
  ? TvdbSeasonShort
  : T extends Extended
    ? TvdbSeasonExtended
    : TvdbSeasonShort | TvdbSeasonExtended;

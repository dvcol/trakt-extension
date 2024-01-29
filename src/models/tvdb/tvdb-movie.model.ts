import type { TvdbArtwork } from '~/models/tvdb/tvdb-artwork.model';
import type { TvdbCharacter } from '~/models/tvdb/tvdb-character.model';
import type { TvdbCompany } from '~/models/tvdb/tvdb-company.model';
import type { Entity, EntityTypes, Extended, Short, TvdbAlias, TvdbRemoteId, TvdbStatus, TvdbTagOption } from '~/models/tvdb/tvdb-entity.model';
import type { TvdbGenre } from '~/models/tvdb/tvdb-genre.model';
import type { TvdbList } from '~/models/tvdb/tvdb-list.model';
import type { TvdbRating } from '~/models/tvdb/tvdb-rating.model';
import type { TvdbTrailer } from '~/models/tvdb/tvdb-trailer.model';
import type { TvdbTranslation } from '~/models/tvdb/tvdb-translation.model';

export type TvdbMovieShort = {
  id: number;
  name: string;
  slug: string;
  score: number;
  image: string;
  year: string;
  runtime: number;
  lastUpdated: string;
  aliases: TvdbAlias[];
  nameTranslations: string[];
  overviewTranslations: string[];
  status: TvdbStatus;
};

type TvdbMovieInspiration = {
  id: number;
  type: string;
  type_name: string;
  url: string;
};

type TvdbMovieProductionCountry = {
  id: number;
  country: string;
  name: string;
};

type TvdbMovieRelease = {
  country: string;
  date: string;
  detail: string;
};

type TvdbMovieStudio = {
  id: number;
  name: string;
  parentStudio: number;
};

export type TvdbMovieExtended = TvdbMovieShort & {
  artworks?: TvdbArtwork[];
  audioLanguages: ['string'];
  awards: Entity[];
  boxOffice: 'string';
  boxOfficeUS: 'string';
  budget: 'string';
  characters?: TvdbCharacter[];
  companies: {
    studio: TvdbCompany;
    network: TvdbCompany;
    production: TvdbCompany;
    distributor: TvdbCompany;
    special_effects: TvdbCompany;
  };
  contentRatings: TvdbRating[];
  first_release: {
    country: 'string';
    date: 'string';
    detail: 'string';
  };
  genres: TvdbGenre[];
  inspirations: TvdbMovieInspiration[];
  lists: TvdbList[];
  originalCountry: 'string';
  originalLanguage: 'string';
  production_countries: TvdbMovieProductionCountry[];
  releases: TvdbMovieRelease[];
  remoteIds: TvdbRemoteId[];
  spoken_languages: string[];
  studios: TvdbMovieStudio[];
  subtitleLanguages: string[];
  tagOptions: TvdbTagOption[];
  trailers?: TvdbTrailer[];
  translations: {
    nameTranslations: TvdbTranslation[];
    overviewTranslations: TvdbTranslation[];
    alias: string[];
  };
};

export type TvdbMovie<T extends EntityTypes = Short> = T extends Short
  ? TvdbMovieShort
  : T extends Extended
    ? TvdbMovieExtended
    : TvdbMovieShort | TvdbMovieExtended;

import type { TvdbArtwork } from '~/models/tvdb/tvdb-artwork.model';
import type { TvdbCharacter } from '~/models/tvdb/tvdb-character.model';
import type { TvdbCompany } from '~/models/tvdb/tvdb-company.model';
import type { EntityTypes, Extended, Short, TvdbAlias, TvdbRemoteId, TvdbStatus, TvdbTagOption } from '~/models/tvdb/tvdb-entity.model';
import type { TvdbEpisode } from '~/models/tvdb/tvdb-episode.model';
import type { TvdbGenre } from '~/models/tvdb/tvdb-genre.model';
import type { TvdbList } from '~/models/tvdb/tvdb-list.model';
import type { TvdbRating } from '~/models/tvdb/tvdb-rating.model';
import type { TvdbSeason, TvdbSeasonType } from '~/models/tvdb/tvdb-season.model';
import type { TvdbTrailer } from '~/models/tvdb/tvdb-trailer.model';
import type { TvdbTranslation } from '~/models/tvdb/tvdb-translation.model';

export type TvdbSeriesShort = {
  aliases: TvdbAlias[];
  averageRuntime: number;
  country: string;
  defaultSeasonType: number;
  episodes: TvdbEpisode[];
  firstAired: string;
  id: number;
  image: string;
  isOrderRandomized: boolean;
  lastAired: string;
  lastUpdated: string;
  name: string;
  nameTranslations: string[];
  nextAired?: string;
  originalCountry: string;
  originalLanguage: string;
  overviewTranslations: string[];
  score: number;
  slug: string;
  status: TvdbStatus;
  year: string;
};

type TvdbSeriesAirDays = {
  friday: boolean;
  monday: boolean;
  saturday: boolean;
  sunday: boolean;
  thursday: boolean;
  tuesday: boolean;
  wednesday: boolean;
};

export type TvdbSeriesExtended = TvdbSeriesShort & {
  abbreviation: 'string';
  airsDays: TvdbSeriesAirDays;
  airsTime: 'string';
  artworks: TvdbArtwork[];
  characters: TvdbCharacter[];
  contentRatings: TvdbRating[];
  lists: TvdbList[];
  genres: TvdbGenre[];
  companies: TvdbCompany[];
  originalNetwork: TvdbCompany;
  overview: 'string';
  latestNetwork: TvdbCompany;
  remoteIds: TvdbRemoteId[];
  seasons: TvdbSeason[];
  seasonTypes: TvdbSeasonType[];
  tags: TvdbTagOption[];
  trailers: TvdbTrailer[];
  translations: {
    nameTranslations: TvdbTranslation[];
    overviewTranslations: TvdbTranslation[];
    alias: ['string'];
  };
};

export type TvdbSeries<T extends EntityTypes = Short> = T extends Short
  ? TvdbSeriesShort
  : T extends Extended
    ? TvdbSeriesExtended
    : TvdbSeriesShort | TvdbSeriesExtended;

export type TvdbSeriesQuery = {
  /** Production company */
  company?: number;
  /** Content rating id base on a country */
  contentRating?: number;
  /**
   * Restrict results to a specific country of origin.
   * Should contain a 3 character country code. Currently only used for series and movies.
   */
  country?: string;
  /**
   * Genre id (between 1 and 36). This id can be found using /genres endpoint.
   * @see [genre]{@link https://thetvdb.github.io/v4-api/#/Genres/getAllGenres}
   */
  genre?: number;
  /**
   * Restrict results to a specific primary language.
   * Should include the 3 character language code. Currently only used for series and movies.
   */
  lang?: string;
  /** Sorts the results by key */
  sort?: 'score' | 'firstAired' | 'lastAired' | 'name';
  /** Sorts order */
  sortType?: 'asc' | 'desc';
  /**
   * Filter by status.
   * @see [status]{@link https://thetvdb.github.io/v4-api/#/Series%20Statuses/getAllSeriesStatuses}
   */
  status?: 1 | 2 | 3;
  /** Restrict results to a specific release year.. */
  year?: number;
};

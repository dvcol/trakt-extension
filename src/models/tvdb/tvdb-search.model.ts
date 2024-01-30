import type { TvdbCompany } from '~/models/tvdb/tvdb-company.model';
import type { TvdbRemoteId } from '~/models/tvdb/tvdb-entity.model';
import type { TvdbEpisode } from '~/models/tvdb/tvdb-episode.model';
import type { TvdbMovie } from '~/models/tvdb/tvdb-movie.model';
import type { TvdbPerson } from '~/models/tvdb/tvdb-person.model';
import type { TvdbSeries } from '~/models/tvdb/tvdb-series.model';

export type TvdbSearchQuery = {
  /** The primary search string, which can include the main title for a record including all translations and aliases. */
  query: string;
  /** Restrict results to a specific entity type. Can be movie, series, person, or company. */
  type?: 'movie' | 'series' | 'person' | 'company';
  /** Restrict results to a specific year. Currently only used for series and movies. */
  year?: number;
  /**
   * Restrict results to a specific company (original network, production company, studio, etc).
   * As an example, "The Walking Dead" would have companies of "AMC", "AMC+", and "Disney+".
   */
  company?: string;
  /**
   * Restrict results to a specific country of origin.
   * Should contain a 3 character country code. Currently only used for series and movies.
   */
  country?: string;
  /**
   * Restrict results to a specific director. Generally only used for movies.
   * Should include the full name of the director, such as "Steven Spielberg".
   */
  director?: string;
  /**
   * Restrict results to a specific primary language.
   * Should include the 3 character language code. Currently only used for series and movies.
   */
  language?: string;
  /**
   * Restrict results to a specific type of company. Only used for companies.
   * Should include the full name of the type of company, such as "Production Company".
   */
  primaryType?: string;
  /**
   * Restrict results to a specific network.
   * Used for TV and TV movies, and functions the same as the company parameter with more specificity.
   */
  network?: string;
  /** Search for a specific remote id. Allows searching for an IMDB or EIDR id, for example. */
  remoteId?: string;
  /** Offset results. */
  offset?: number;
  /** Limit results. */
  limit?: number;
};

export type TvdbSearch = {
  objectID: string;
  aliases: string[];
  companies: string[];
  companyType: string;
  country: string;
  director: string;
  first_air_time: string;
  genres: string[];
  id: string;
  image_url: string;
  name: string;
  is_official: boolean;
  name_translated: string;
  network: string;
  officialList: string;
  overview: string;
  /** Record of languages with their translations */
  overviews: Record<string, string>;
  overview_translated: string[];
  poster: string;
  posters: string[];
  primary_language: string;
  remote_ids: TvdbRemoteId[];
  status: string;
  slug: string;
  studios: string[];
  title: string;
  thumbnail: string;
  /** Record of languages with their translations */
  translations: Record<string, string>;
  translationsWithLang: string[];
  tvdb_id: string;
  type: string;
  year: string;
};

export type TvdbRemoteSearch = {
  series?: TvdbSeries;
  people?: TvdbPerson;
  movie?: TvdbMovie;
  episode?: TvdbEpisode;
  company?: TvdbCompany;
};

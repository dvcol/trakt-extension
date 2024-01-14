import type { TraktApiIds } from '~/models/trakt-id.model';

export const TraktEpisodeType = {
  Standard: 'standard',
  SeriesPremiere: 'series_premiere',
  SeasonPremiere: 'season_premiere',
  MidSeasonFinale: 'mid_season_finale',
  MidSeasonPremiere: 'mid_season_premiere',
  SeasonFinale: 'season_finale',
  SeriesFinale: 'series_finale',
};

export type TraktEpisodeTypes = (typeof TraktEpisodeType)[keyof typeof TraktEpisodeType];
export const TraktEpisodeTypeValues = Object.values(TraktEpisodeType);

export type TraktEpisodeShort = {
  season: number;
  number: number;
  title: string;
  ids: Pick<TraktApiIds, 'trakt' | 'tvdb' | 'imdb' | 'tmdb'>;
};

export type TraktEpisodeExtended = TraktEpisodeShort & {
  number_abs: number;
  overview: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  first_aired: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  rating: number;
  votes: number;
  comment_count: number;
  /** Array of 2 character language code. (ISO 639-1) */
  available_translations: string[];
  /** In minutes */
  runtime: number;
  episode_type: TraktEpisodeTypes;
};

export type TraktEpisode<T extends 'extended' | 'short' | 'any' = 'short'> = T extends 'extended'
  ? TraktEpisodeExtended
  : T extends 'short'
    ? TraktEpisodeShort
    : TraktEpisodeShort & Partial<TraktEpisodeExtended>;

export type TraktEpisodeTrending<T extends 'extended' | 'short' | 'any' = 'any'> = {
  watchers: number;
  episode: TraktEpisode<T>;
};

export type TraktEpisodeFavorited<T extends 'extended' | 'short' | 'any' = 'any'> = {
  user_count: number;
  episode: TraktEpisode<T>;
};

export type TraktEpisodePlayed<T extends 'extended' | 'short' | 'any' = 'any'> = {
  watcher_count: number;
  play_count: number;
  collected_count: number;
  episode: TraktEpisode<T>;
};

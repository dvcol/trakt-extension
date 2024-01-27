import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktApiIds } from '~/models/trakt/trakt-id.model';
import type { TraktCast } from '~/models/trakt/trakt-people.model';

export type TraktSeasonShort = {
  number: number;
  ids: Pick<TraktApiIds, 'trakt' | 'tvdb' | 'tmdb'>;
};

export type TraktSeasonExtended = TraktSeasonShort & {
  rating: number;
  votes: number;
  episode_count: number;
  aired_episodes: number;
  title: string;
  overview: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  first_aired: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  network: string;
};

export type TraktSeasonEpisodes = TraktSeasonShort & {
  episodes: TraktEpisode[];
};

export type TraktSeason<T extends 'extended' | 'episodes' | 'short' | 'any' = 'short'> = T extends 'extended'
  ? TraktSeasonExtended
  : T extends 'episodes'
    ? TraktSeasonEpisodes
    : T extends 'short'
      ? TraktSeasonShort
      : TraktSeasonShort & Partial<TraktSeasonExtended> & Partial<TraktSeasonEpisodes>;

export type TraktSeasonCast = TraktCast<'any', 'episodes', 'any'>;

export type TraktSeasonStats = {
  watchers: number;
  plays: number;
  collectors: number;
  collected_episodes: number;
  comments: number;
  lists: number;
  votes: number;
};

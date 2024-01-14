import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktApiIds } from '~/models/trakt-id.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktPerson } from '~/models/trakt-people.model';
import type { TraktSeason } from '~/models/trakt-season.model';
import type { TraktShow } from '~/models/trakt-show.model';
import type { TraktUser } from '~/models/trakt-user.model';

export type TraktList = {
  name: string;
  description: string;
  privacy: 'private' | 'friends' | 'public' | 'link';
  share_link: string;
  type: string;
  display_numbers: boolean;
  allow_comments: boolean;
  sort_by:
    | 'rank'
    | 'added'
    | 'title'
    | 'released'
    | 'runtime'
    | 'popularity'
    | 'percentage'
    | 'votes'
    | 'my_rating'
    | 'random'
    | 'watched'
    | 'collected';
  sort_how: 'asc' | 'desc';
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  created_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  item_count: number;
  comment_count: number;
  likes: number;
  ids: Pick<TraktApiIds, 'trakt' | 'slug'>;
  user: TraktUser;
};

export type TraktListList = {
  like_count: number;
  comment_count: number;
  list: TraktList;
};

export type BaseTraktListItem = {
  rank: number;
  id: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  listed_at: string;
  notes: string;
  type: 'movie' | 'show' | 'season' | 'episode' | 'person';
};

export type BaseTraktListMedia = {
  movie: TraktMovie;
  show: TraktShow;
  season: TraktSeason;
  episode: TraktEpisode;
  person: TraktPerson;
};

export type TraktListItem<T extends 'any' | 'movie' | 'show' | 'season' | 'episode' | 'person' = 'any'> = BaseTraktListItem &
  (T extends 'movie'
    ? Pick<BaseTraktListMedia, 'movie'> & { type: 'movie' }
    : T extends 'show'
      ? Pick<BaseTraktListMedia, 'show'> & { type: 'show' }
      : T extends 'season'
        ? Pick<BaseTraktListMedia, 'season' | 'show'> & { type: 'season' }
        : T extends 'episode'
          ? Pick<BaseTraktListMedia, 'episode' | 'show'> & { type: 'episode' }
          : T extends 'list'
            ? Pick<BaseTraktListMedia, 'person'> & { type: 'person' }
            : Partial<BaseTraktListMedia>);

import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktList } from '~/models/trakt-list.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktSeason } from '~/models/trakt-season.model';
import type { TraktShow } from '~/models/trakt-show.model';
import type { TraktUser } from '~/models/trakt-user.model';

export type TraktComment = {
  id: number;
  parent_id: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  created_at: string;

  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  comment: string;
  spoiler: boolean;
  review: boolean;
  replies: number;
  likes: number;
  user_stats: {
    rating: number;
    play_count: number;
    completed_count: number;
  };
  user: TraktUser;
};

type BaseTraktCommentMedia = {
  type: 'movie' | 'show' | 'season' | 'episode' | 'list';
  movie: TraktMovie;
  show: TraktShow;
  season: TraktSeason;
  episode: TraktEpisode;
  list: TraktList;
};

export type TraktCommentMedia<T extends 'any' | 'movie' | 'show' | 'season' | 'episode' | 'list' = 'any'> = T extends 'movie'
  ? Pick<BaseTraktCommentMedia, 'movie'> & { type: 'movie' }
  : T extends 'show'
    ? Pick<BaseTraktCommentMedia, 'show'> & { type: 'show' }
    : T extends 'season'
      ? Pick<BaseTraktCommentMedia, 'season'> & { type: 'season' }
      : T extends 'episode'
        ? Pick<BaseTraktCommentMedia, 'episode'> & { type: 'episode' }
        : T extends 'list'
          ? Pick<BaseTraktCommentMedia, 'list'> & { type: 'list' }
          : Partial<BaseTraktCommentMedia>;

export type TraktCommentItem<T extends 'any' | 'movie' | 'show' | 'season' | 'episode' | 'list' = 'any'> = TraktCommentMedia<T> & {
  comment: TraktComment;
};

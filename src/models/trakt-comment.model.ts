import type { TraktSharing } from '~/models/trakt-entity.model';
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
          :
              | {
                  type: 'movie';
                  movie: TraktMovie;
                }
              | {
                  type: 'show';
                  show: TraktShow;
                }
              | {
                  type: 'season';
                  season: TraktSeason;
                }
              | {
                  type: 'episode';
                  episode: TraktEpisode;
                }
              | {
                  type: 'list';
                  list: TraktList;
                };

export type TraktCommentItem<T extends 'any' | 'movie' | 'show' | 'season' | 'episode' | 'list' = 'any'> = TraktCommentMedia<T> & {
  comment: TraktComment;
};

type BaseTraktCommentRequest = {
  /** Movie to comment */
  movie: TraktMovie;
  /** Show to comment */
  show: TraktShow;
  /** Season to comment */
  season: TraktSeason;
  /** Episode to comment */
  episode: TraktEpisode;
  /** List to comment */
  list: Pick<TraktList, 'ids'>;
};

export type TraktCommentRequest<T extends 'any' | 'movie' | 'show' | 'season' | 'episode' | 'list' = 'any'> = {
  /** Text for the comment. */
  comment: string;
  /** Is this a spoiler? Defaults to false */
  spoiler?: boolean;
  /**
   * Control sharing to any connected social networks.
   *
   * The sharing object is optional and will apply the user's settings if not sent.
   * If sharing is sent, each key will override the user's setting for that social network.
   * Send true to post or false to not post on the indicated social network. You can see which social networks a user has connected with the /users/settings method.
   */
  sharing?: TraktSharing;
} & (T extends 'movie'
  ? Pick<BaseTraktCommentRequest, 'movie'>
  : T extends 'show'
    ? Pick<BaseTraktCommentRequest, 'show'>
    : T extends 'season'
      ? Pick<BaseTraktCommentRequest, 'season'>
      : T extends 'episode'
        ? Pick<BaseTraktCommentRequest, 'episode'>
        : T extends 'list'
          ? Pick<BaseTraktCommentRequest, 'list'>
          :
              | {
                  /** Movie to comment */
                  movie: TraktMovie;
                }
              | {
                  /** Show to comment */
                  show: TraktShow;
                }
              | {
                  /** Season to comment */
                  season: TraktSeason;
                }
              | {
                  /** Episode to comment */
                  episode: TraktEpisode;
                }
              | {
                  /** List to comment */
                  list: Pick<TraktList, 'ids'>;
                });

import type { TraktComment, TraktCommentMedia } from '~/models/trakt/trakt-comment.model';
import type { Any, EntityTypes, Extended, Short } from '~/models/trakt/trakt-entity.model';
import type { TraktApiIds } from '~/models/trakt/trakt-id.model';
import type { TraktList } from '~/models/trakt/trakt-list.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktSeason } from '~/models/trakt/trakt-season.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';
import type { RequireAtLeastOne } from '~/utils/typescript.utils';

export type TraktPrivateUser = {
  username: string;
  private: boolean;
  ids: Pick<TraktApiIds, 'slug'>;
};

export type TraktPublicUser = TraktPrivateUser & {
  name: string;
  vip: boolean;
  vip_ep: boolean;
};

export type TraktUserExtended = TraktPublicUser & {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  joined_at: string;
  /** 2 character location code. */
  location: string;
  about: string;
  gender: string;
  age: number;
  images: {
    avatar: {
      full: string;
    };
  };
};

export type TraktUserVip = TraktPublicUser & {
  vi_og: boolean;
  vip_years: number;
  vip_cover_image: string;
};

export type TraktUser<T extends Extended | 'vip' | 'private' | 'public' | Any = 'public'> = T extends Extended
  ? TraktUserExtended
  : T extends 'vip'
    ? TraktUserVip
    : T extends 'private'
      ? TraktPrivateUser
      : T extends 'public'
        ? TraktPublicUser
        : TraktPublicUser & Partial<TraktUserExtended & TraktUserVip>;

export type TraktUserAccount = {
  timezone: string;
  date_format: string;
  time_24hr: boolean;
  cover_image: string;
};

export type TraktUserConnections = {
  facebook: boolean;
  twitter: boolean;
  google: boolean;
  tumblr: boolean;
  medium: boolean;
  slack: boolean;
  apple: boolean;
  dropbox: boolean;
  microsoft: boolean;
};

export type TraktUserLimits = {
  list: {
    count: number;
    item_count: number;
  };
  watchlist: {
    item_count: number;
  };
  favorites: {
    item_count: number;
  };
};

export type TraktUserSettings = {
  user: TraktUserExtended;
  account: TraktUserAccount;
  connections: TraktUserConnections;
  sharing_text: {
    watching: string;
    watched: string;
    rated: string;
  };
  limits: TraktUserLimits;
};

export type TraktUserFollowRequest<T extends Extended | 'public' = 'public'> = {
  id: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  requested_at: string;
  user: T extends Extended ? TraktUser<Extended> : TraktUser<'public'>;
};

export type TraktUserFollower<T extends Extended | 'public' = 'public'> = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  followed_at: string;
  user: T extends Extended ? TraktUser<Extended> : TraktUser<'public'>;
};

export type TraktUserFollowing<T extends Extended | 'public' = 'public'> = TraktUserFollower<T>;

export type TraktUserFriend<T extends Extended | 'public' = 'public'> = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  friends_at: string;
  user: T extends Extended ? TraktUser<Extended> : TraktUser<'public'>;
};

export type TraktUserFollow<T extends Extended | 'public' = 'public'> = {
  /**
   * If the user has a private profile, the follow request will require approval (approved_at will be null).
   * If a user is public, they will be followed immediately (approved_at will have a date).
   *
   * If this user is already being followed, a 409 HTTP status code will returned.
   *
   * Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ)
   */
  approved_at?: string;
  user: T extends Extended ? TraktUser<Extended> : TraktUser<'public'>;
};

export type TraktUserFilter = {
  rank: number;
  id: number;
  section: 'movies' | 'shows' | 'calendars' | 'search';
  name: string;
  path: string;
  query: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
};

export type TraktUserHiddenItem<T extends 'movie' | 'show' | Any = Any> = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  hidden_at: string;
} & { type: T extends Any ? 'movie' | 'show' : T } & (T extends 'movie'
    ? { movie: TraktMovie }
    : T extends 'show'
      ? { show: TraktShow }
      : { movie: TraktMovie } | { show: TraktShow });

type BaseTraktUserHiddenRequestItem = {
  movies: (Partial<TraktMovie> & Pick<TraktMovie, 'ids'>)[];
  shows: (Partial<TraktShow> & Pick<TraktShow, 'ids'> & { seasons?: { number: number }[] })[];
  seasons: (Partial<TraktSeason> & Pick<TraktSeason, 'ids'>)[];
  users: (Partial<TraktUser> & Pick<TraktUser, 'ids'>)[];
};

export type TraktUserHiddenRequest<T extends 'calendar' | 'progress_watched' | 'progress_collected' | 'recommendations' | 'comments' | Any = Any> = {
  section: T extends Any ? 'calendar' | 'progress_watched' | 'progress_collected' | 'recommendations' | 'comments' : T;
} & (T extends 'calendar'
  ? RequireAtLeastOne<Pick<BaseTraktUserHiddenRequestItem, 'movies' | 'shows'>>
  : T extends 'progress_watched'
    ? RequireAtLeastOne<Pick<BaseTraktUserHiddenRequestItem, 'shows' | 'seasons'>>
    : T extends 'progress_collected'
      ? RequireAtLeastOne<Pick<BaseTraktUserHiddenRequestItem, 'shows' | 'seasons'>>
      : T extends 'recommendations'
        ? RequireAtLeastOne<Pick<BaseTraktUserHiddenRequestItem, 'movies' | 'shows'>>
        : T extends 'comments'
          ? Pick<BaseTraktUserHiddenRequestItem, 'users'>
          : RequireAtLeastOne<BaseTraktUserHiddenRequestItem>);

export type TraktUserHiddenAdded = {
  added: {
    movies: number;
    shows: number;
    seasons: number;
    users: number;
  };
  not_found: {
    movies: Pick<TraktMovie, 'ids'>[];
    shows: Pick<TraktShow, 'ids'>[];
    seasons: Pick<TraktSeason, 'ids'>[];
    users: Pick<TraktUser, 'ids'>[];
  };
};

export type TraktUserHiddenDeleted = {
  deleted: {
    movies: number;
    shows: number;
    seasons: number;
    users: number;
  };
  not_found: {
    movies: Pick<TraktMovie, 'ids'>[];
    shows: Pick<TraktShow, 'ids'>[];
    seasons: Pick<TraktSeason, 'ids'>[];
    users: Pick<TraktUser, 'ids'>[];
  };
};

export type TraktUserLike<
  T extends 'comment' | 'list' | Any = Any,
  E extends EntityTypes = Any,
  C extends Any | 'movie' | 'show' | 'season' | 'episode' | 'list' = Any,
> = T extends 'comment' ? TraktUserLikeComment<E, C> : T extends 'list' ? TraktUserLikeList : TraktUserLikeComment<E, C> | TraktUserLikeList;

export type TraktUserLikeList = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  liked_at: string;
  type: 'list';
  list: TraktList;
};

type BaseTraktUserLikeComment = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  liked_at: string;
  type: 'comment';
  comment: TraktComment;
};

type TraktUserLikeCommentExtended<T extends Any | 'movie' | 'show' | 'season' | 'episode' | 'list' = Any> = BaseTraktUserLikeComment & {
  comment_type: T extends Any ? 'movie' | 'show' | 'season' | 'episode' | 'list' : T;
} & Omit<TraktCommentMedia<T>, 'type'>;

export type TraktUserLikeComment<
  E extends EntityTypes = Any,
  C extends Any | 'movie' | 'show' | 'season' | 'episode' | 'list' = Any,
> = E extends Extended
  ? TraktUserLikeCommentExtended<C>
  : E extends Short
    ? BaseTraktUserLikeComment
    : TraktUserLikeCommentExtended<C> | BaseTraktUserLikeComment;

import type { TraktUser } from '~/models/trakt/trakt-user.model';

export type TraktLike = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  liked_at: string;
  user: TraktUser;
};

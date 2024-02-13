import type { EntityTypes, Extended, Short } from '~/models/tmdb/tmdb-entity.model';

export type TmdbReviewShort = {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string;
    rating: number;
  };
  content: string;
  /** UTC date when the review was created (YYYY-MM-DD HH:mm:ss UTC) */
  created_at: string;
  /** UTC date when the review was updated (YYYY-MM-DD HH:mm:ss UTC) */
  updated_at: string;
  url: string;
};

export type TmdbReviewExtended = TmdbReviewShort & {
  iso_639_1: string;
  media_id: number;
  media_title: string;
  media_type: string;
};

export type TmdbReview<T extends EntityTypes = Short> = T extends Short
  ? TmdbReviewShort
  : T extends Extended
    ? TmdbReviewExtended
    : TmdbReviewShort | TmdbReviewExtended;

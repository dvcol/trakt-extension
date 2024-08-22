import type { TraktSyncRatingValue } from '@dvcol/trakt-http-client/models';
import type { Component } from 'vue';

export const Rating: Record<string, TraktSyncRatingValue> = {
  Worst: 1,
  Terrible: 2,
  Bad: 3,
  Poor: 4,
  Mediocre: 5,
  Fair: 6,
  Good: 7,
  Great: 8,
  Excellent: 9,
  Perfect: 10,
} as const;

export const RatingLabel: Record<number, string> = Object.entries(Rating).reduce(
  (acc, [key, value]) => {
    acc[value] = key.toLowerCase();
    return acc;
  },
  {} as Record<TraktSyncRatingValue, string>,
);

export type RatingValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type RatingProp = {
  rating?: number;
  votes?: number;
  score?: number;
  duration?: number;
  precision?: number;
  loading?: boolean;
  url?: string;
};

export type RatingItem = {
  name: string;
  rating: RatingProp;
  icon?: Component | string;
};

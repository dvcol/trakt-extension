import type { TraktSyncRatingValue } from '@dvcol/trakt-http-client/models';

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

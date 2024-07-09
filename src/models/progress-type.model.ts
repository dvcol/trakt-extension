export const ProgressType = {
  Show: 'show',
  Season: 'season',
} as const;

export type ProgressTypes = (typeof ProgressType)[keyof typeof ProgressType];

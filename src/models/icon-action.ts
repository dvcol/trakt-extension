export const IconAction = {
  Popup: 'popup' as const,
  Panel: 'panel' as const,
} as const;

export type IconActions = (typeof IconAction)[keyof typeof IconAction];

import type { SelectOption } from 'naive-ui';

export const loadingHysteresisOptions: SelectOption[] = [
  { label: 'disabled', value: -1 } as const,
  { label: '0', value: 0 } as const,
  { label: '100', value: 100 } as const,
  { label: '200', value: 200 } as const,
  { label: '500', value: 500 } as const,
  { label: '1000', value: 1000 } as const,
  { label: '2000', value: 2000 } as const,
  { label: '5000', value: 5000 } as const,
  { label: '10000', value: 10000 } as const,
] as const;

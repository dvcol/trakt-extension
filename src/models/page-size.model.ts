import type { SelectOption } from 'naive-ui';

export const PageSize: Record<string, number> = {
  p0: 0,
  p50: 50,
  p100: 100,
  p200: 200,
  p500: 500,
  p1000: 1000,
} as const;

export const pageSizeOptions: SelectOption[] = [
  { label: '50', value: 50 },
  { label: '100', value: 100 },
  { label: '200', value: 200 },
  { label: '500', value: 500 },
  { label: '1000', value: 1000 },
] as const;

export const pageSizeOptionsWithZero: SelectOption[] = [{ label: '0', value: 0 }, ...pageSizeOptions] as const;

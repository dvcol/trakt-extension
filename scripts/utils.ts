import { resolve } from 'path';

export const enum environment {
  dev = 'development',
  prod = 'production',
}

export const isDev = process.env.NODE_ENV === environment.dev;
export const port = parseInt(process.env.PORT || '', 10) || 3303;
export const r = (...args: string[]) => resolve(__dirname, '..', ...args);

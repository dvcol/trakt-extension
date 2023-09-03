import { dirname, resolve } from 'path';

import { fileURLToPath } from 'url';

export const enum environment {
  dev = 'development',
  prod = 'production',
}

export const getDirName = () => dirname(fileURLToPath(import.meta.url));
export const isDev = process.env.NODE_ENV === environment.dev;
export const port = parseInt(process.env.PORT || '', 10) || 3303;
export const resolveParent = (...args: string[]) => resolve(getDirName(), '..', ...args);

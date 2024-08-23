import type { useI18nTranslate } from '~/utils/browser/browser-i18n.utils';

export type Locale = Record<string, { message: string; descriptions?: string }>;
export type Locales = Record<string, Locale>;
export type LocalesFetch = Record<string, Promise<Locale>>;
export type I18nParameters = { key: string; substitutions: string[] };
export type I18nFunction = ReturnType<typeof useI18nTranslate>;

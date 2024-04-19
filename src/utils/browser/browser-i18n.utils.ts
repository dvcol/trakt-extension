export type BrowserI18nInput = { key: string; substitutions: string[] };

/**
 * Convert translation using chrome i18n
 * @param value key string or object to translate
 * @param modules optionals modules names
 * @see chrome.i18n.getMessage
 * @see [chrome.i18n](https://developer.chrome.com/docs/extensions/reference/i18n/)
 */
export const i18nTranslate = (value: string | BrowserI18nInput, ...modules: string[]): string => {
  const path: string = Array.isArray(modules) ? modules.join('__') : modules;

  let key: string;
  let substitution;
  if (typeof value === 'string') {
    key = path ? `${path}__${value}` : value;
  } else {
    key = path ? `${path}__${value.key}` : value.key;
    substitution = value?.substitutions;
  }
  return globalThis?.chrome?.i18n.getMessage?.(key, substitution) || key;
};

/**
 * Setup i18n function with modules names
 * @param roots modules names
 * @see chrome.i18n.getMessage
 */
export const useI18nTranslate =
  (...roots: string[]): typeof i18nTranslate =>
  (value, ...modules): string =>
    i18nTranslate(value, ...(modules?.length ? modules : roots));

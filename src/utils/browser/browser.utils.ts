/**
 * The i18n API for the current browser.
 * @see [chrome.i18n](https://developer.chrome.com/docs/extensions/reference/i18n/)
 */
export const chromeI18n: typeof chrome.i18n | undefined = globalThis?.chrome?.i18n;

/**
 * Returns the short locale (ISO 639-1) of the current browser.
 * I.e. 'en' for 'en-US'.
 */
export const getShortLocale: () => string = () => navigator?.language?.split('-').at(0) ?? 'en';

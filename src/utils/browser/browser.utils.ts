/**
 * Open a new tab with the given options.
 *
 * This is a wrapper around `chrome.tabs.create` that falls back to `window.open` if the method is not available.
 *
 * @param options - The options for the new tab.
 */
const openTab = (options: chrome.tabs.CreateProperties) => window.open(options.url, options.active ? '_self' : '_blank');

/**
 * @see [chrome.tabs.create](https://developer.chrome.com/docs/extensions/reference/tabs/#method-create)
 */
export const createTab = (options: chrome.tabs.CreateProperties) => (globalThis?.chrome?.tabs?.create ?? openTab)(options);

/**
 * The ID of the current extension.
 * @see [chrome.runtime.id](https://developer.chrome.com/docs/extensions/reference/runtime/#property-id)
 */
export const chromeRuntimeId: typeof chrome.runtime.id | undefined = globalThis?.chrome?.runtime?.id;

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

import type { I18nFunction, Locale, Locales } from '~/models/i18n.model';

import { useI18nStore } from '~/stores/i18n.store';
import { useRouterStore } from '~/stores/router.store';
import { chromeI18n, useI18nTranslate } from '~/utils/browser/browser-i18n.utils';

let promise: Promise<Locales | void> | undefined;
let hotReload = false;
export const initLocalI18n = () => {
  const store = useI18nStore();
  const router = useRouterStore();
  if (hotReload || promise) return { store, router, promise };
  if (import.meta.hot) {
    console.debug('Listening to i18n HMR changes');
    import.meta.hot.send('fetch:i18n');
    import.meta.hot.on('update:i18n', (data: { lang: string; locale: Locale }[]) => {
      data?.forEach(({ lang, locale }) => store.addLocale(locale, lang, true));
    });
    hotReload = true;
  } else if (!store.locales?.[store.lang]) {
    promise = fetch(new URL(`${router.baseUrl ?? './'}_locales/${store.lang}/messages.json`, new URL(import.meta.url).origin))
      .then(r => r.json())
      .then((locale: Locale) => store.addLocale(locale))
      .catch(err => console.error(`Failed to fetch locale '${store.lang}'`, err));
  }

  return { store, router, promise };
};

/**
 * Setup i18n function to either use chrome i18n resolver or a local store (for web use).
 * @param roots modules names
 * @see chrome.i18n.getMessage
 */
export const useI18n = (...roots: string[]): I18nFunction => {
  if (!chromeI18n) {
    const { store } = initLocalI18n();
    return (value, ...modules) => store.i18n(value, ...(modules?.length ? modules : roots));
  }

  return useI18nTranslate(...roots);
};

export const i18nTearDown = () => {
  promise = undefined;
  hotReload = false;
};

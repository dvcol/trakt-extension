import { useI18n as chromeUseI18n } from '@dvcol/web-extension-utils/lib/chrome/utils/i18n.utils';

import type { Locale } from '~/models/i18n.model';

import { useI18nStore } from '~/stores/i18n.store';
import { useRouterStore } from '~/stores/router.store';

/**
 * Setup i18n function to either use chrome i18n resolver or a local store (for web use).
 * @param roots modules names
 * @see chrome.i18n.getMessage
 */
export const useI18n = (...roots: string[]): ReturnType<typeof chromeUseI18n> => {
  if (!window?.chrome?.i18n) {
    const store = useI18nStore();
    const router = useRouterStore();

    if (import.meta.hot) {
      console.info('Listening to i18n HMR changes');
      import.meta.hot.send('fetch:i18n');
      import.meta.hot.on('update:i18n', (data: { lang: string; locale: Locale }[]) => {
        data?.forEach(({ lang, locale }) => store.addLocale(locale, lang));
      });
    } else if (!store.locales?.[store.lang]) {
      fetch(new URL(`${router.baseUrl ?? './'}_locales/${store.lang}/messages.json`, new URL(import.meta.url).origin))
        .then(r => r.json())
        .then((locale: Locale) => store.addLocale(locale))
        .catch(err => console.error(`Failed to fetch locale '${store.lang}'`, err));
    }

    return (value, ...modules) => store.i18n(value, ...(modules?.length ? modules : roots));
  }

  return chromeUseI18n(...roots);
};

import { useI18n as chromeUseI18n } from '@dvcol/web-extension-utils/lib/chrome/utils/i18n.utils';

import type { Locale } from '~/models/i18n.model';

import { useI18nStore } from '~/stores/i18n.store';

export const useI18n = (...roots: string[]): ReturnType<typeof chromeUseI18n> => {
  if (!chrome?.i18n) {
    const store = useI18nStore();

    fetch(`${import.meta.env.BASE_URL}/_locales/${store.lang}/messages.json`)
      .then(r => r.json())
      .then((locale: Locale) => store.addLocale(locale))
      .catch(err => console.error(`Failed to fetch locale '${store.lang}'`, err));

    return (value, modules) => store.i18n(value, ...(modules?.length ? modules : roots));
  }

  return chromeUseI18n(...roots);
};

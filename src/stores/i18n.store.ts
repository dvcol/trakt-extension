import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { ChromeI18nInput } from '@dvcol/web-extension-utils/lib/chrome/models';

import type { Locale, Locales } from '~/models/i18n.model';

export const useI18nStore = defineStore('i18n', () => {
  const lang = ref<string>('en');
  const locales = ref<Locales>({});
  const locale = computed<Locale>(() => locales.value[lang.value]);

  const i18n = (value: string | ChromeI18nInput, ...modules: string[]) => {
    const path: string = Array.isArray(modules) ? modules.join('__') : modules;

    let key: string;
    let substitution: string[] = [];
    if (typeof value === 'string') {
      key = path ? `${path}__${value}` : value;
    } else {
      key = path ? `${path}__${value.key}` : value.key;
      substitution = value?.substitutions;
    }

    let result: string = locale.value?.[key]?.message || key;

    if (substitution?.length) {
      for (let i = 0; i < substitution.length; i += 1) {
        result = result?.replace(`$${i + 1}`, substitution[i]);
      }
    }

    console.info({
      value,
      key,
      result,
      locale: locale.value,
    });

    return result;
  };

  const addLocale = (_locale: Locale, _lang = lang.value) => {
    console.info('adding local', { _lang, _locale });
    locales.value[_lang] = _locale;
    return locales.value;
  };

  return { lang, locales, locale, i18n, addLocale };
});

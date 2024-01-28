import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import type { Locale, Locales } from '~/models/i18n.model';
import type { BrowserI18nInput } from '~/utils/browser/browser-i18n.utils';

export const useI18nStore = defineStore('i18n', () => {
  const lang = ref<string>('en');
  const locales = ref<Locales>({});
  const locale = computed<Locale>(() => locales.value[lang.value]);

  const i18n = (value: string | BrowserI18nInput, ...modules: string[]) => {
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

    return result;
  };

  const addLocale = (_locale: Locale, _lang = lang.value) => {
    locales.value[_lang] = _locale;
    return locales.value;
  };

  return { lang, locales, locale, i18n, addLocale };
});

export const useI18nStoreRefs = () => storeToRefs(useI18nStore());

export const getIntl = () => Intl.DateTimeFormat().resolvedOptions();
export const getIntlLocale = () => getIntl().locale;
export const getIntlLanguage = () => getIntlLocale().split('-').shift();
export const getIntlRegion = () => getIntlLocale().split('-').pop();

export const getNavigatorLanguage = () => navigator?.language?.split('-').shift();
export const getNavigatorRegion = () => navigator?.language?.split('-').pop();

import { Brand, useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';

export const Colors = {
  bgBlurBlack: 'rgba(0, 0, 0, 30%)',
  bgBlurBlackHover: 'rgba(0, 0, 0, 60%)',
  traktRed: '#ed1c24',
  traktRedDark: '#ba080f',
  traktRedDarker: '#80000a',
  traktPurple: '#9f42c6',
  traktPurpleDark: '#7802b7',
  traktPurpleDarker: '#4a0f7a',
  white: '#fff',
} as const;

export const Blurs = {
  blur: 'blur(2px)',
} as const;

export const BrandColors = {
  get trakt() {
    return useExtensionSettingsStoreRefs().brand.value === Brand.New ? Colors.traktPurple : Colors.traktRed;
  },
  get traktDark() {
    return useExtensionSettingsStoreRefs().brand.value === Brand.New ? Colors.traktPurpleDark : Colors.traktRedDark;
  },
  get traktDarker() {
    return useExtensionSettingsStoreRefs().brand.value === Brand.New ? Colors.traktPurpleDarker : Colors.traktRedDarker;
  },
};

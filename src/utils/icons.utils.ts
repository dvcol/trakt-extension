import AppleTouchNew from '~/assets/brand/apple-touch-icon.png';
import FaviconNew16 from '~/assets/brand/favicon-16x16.png';
import FaviconNew32 from '~/assets/brand/favicon-32x32.png';
import FaviconNew48 from '~/assets/brand/favicon-48x48.png';
import LogoNew from '~/assets/brand/favicon.svg';
import AppleTouchOld from '~/assets/favicon/apple-touch-icon.png';
import FaviconOld16 from '~/assets/favicon/favicon-16x16.png';
import FaviconOld32 from '~/assets/favicon/favicon-32x32.png';
import FaviconOld48 from '~/assets/favicon/favicon-48x48.png';
import LogoOld from '~/assets/logo.svg';

import { Colors } from '~/styles/colors.style';

type IconDefinition = Partial<Record<keyof HTMLLinkElement, string>> & { id: string; color?: string };
type MetaDefinition = Partial<Record<keyof HTMLMetaElement, string>> & { id: string };

export const oldIcons: IconDefinition[] = [
  {
    id: 'svg-icon',
    rel: 'icon',
    href: LogoOld,
    type: 'image/svg+xml',
  },
  {
    id: 'svg-fluid-icon',
    rel: 'fluid-icon',
    href: LogoOld,
    type: 'image/svg+xml',
  },
  {
    id: 'svg-mask-icon',
    rel: 'mask-icon',
    href: LogoOld,
    type: 'image/svg+xml',
    color: '#181818',
  },
  {
    id: 'png-icon-16x16',
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: FaviconOld16,
  },
  {
    id: 'png-icon-32x32',
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: FaviconOld32,
  },
  {
    id: 'png-icon-48x48',
    rel: 'icon',
    type: 'image/png',
    sizes: '48x48',
    href: FaviconOld48,
  },
  {
    id: 'apple-icon',
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: AppleTouchOld,
  },
];

export const newIcons: IconDefinition[] = [
  {
    id: 'svg-icon',
    rel: 'icon',
    href: LogoNew,
    type: 'image/svg+xml',
  },
  {
    id: 'svg-fluid-icon',
    rel: 'fluid-icon',
    href: LogoNew,
    type: 'image/svg+xml',
  },
  {
    id: 'svg-mask-icon',
    rel: 'mask-icon',
    href: LogoNew,
    type: 'image/svg+xml',
    color: '#181818',
  },
  {
    id: 'png-icon-16x16',
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: FaviconNew16,
  },
  {
    id: 'png-icon-32x32',
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: FaviconNew32,
  },
  {
    id: 'png-icon-48x48',
    rel: 'icon',
    type: 'image/png',
    sizes: '48x48',
    href: FaviconNew48,
  },
  {
    id: 'apple-icon',
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: AppleTouchNew,
  },
];

export const replaceIcon = (definition: IconDefinition) => {
  const svgIcon = document.head.querySelector(`#${definition.id}`);
  if (!svgIcon) return;

  const newIcon = document.createElement('link');
  Object.assign(newIcon, definition);

  document.head.replaceChild(newIcon, svgIcon);
};

export const oldThemeColor: MetaDefinition = {
  id: 'theme-color',
  name: 'theme-color',
  content: Colors.traktRedDarker,
};

export const newThemeColor: MetaDefinition = {
  id: 'theme-color',
  name: 'theme-color',
  content: Colors.traktPurpleDarker,
};

export const replaceMeta = (definition: MetaDefinition) => {
  const oldMeta = document.head.querySelector(`#${definition.id}`);
  if (!oldMeta) return;

  const newMeta = document.createElement('meta');
  Object.assign(newMeta, definition);

  document.head.replaceChild(newMeta, oldMeta);
};

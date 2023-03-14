import fs from 'fs-extra';

import pkg from '../package.json';

import { isDev, port, r } from './utils';

import type { Manifest } from 'webextension-polyfill';

export const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 3,
  name: 'Trakt Companion (client for Trakt.tv)' || pkg.name,
  version: pkg.version,
  description: pkg.description,
  // default_locale: 'en', // TODO i18n
  icons: {
    16: 'icons/icon-512.png',
    48: 'icons/icon-512.png',
    128: 'icons/icon-512.png',
  },
  options_ui: {
    page: 'views/options/index.html',
    open_in_tab: true,
  },
  action: {
    default_title: 'Trakt Companion',
    default_icon: 'icons/icon-512.png',
    default_popup: 'views/popup/index.html',
  },
  permissions: ['storage'],
  content_security_policy: {
    // Adds localhost for vite hot reload
    extension_pages: isDev
      ? `script-src 'self' http://localhost:${port}; object-src 'self' http://localhost:${port}`
      : "script-src 'self'; object-src 'self'",
  },
};

/**
 * Manifest V2 version for hot reload
 * @see https://bugs.chromium.org/p/chromium/issues/detail?id=1247690
 * @todo Remove when MV3 hot reload is fixed
 */
export const manifestV2: Manifest.WebExtensionManifest = {
  manifest_version: 2,
  name: manifest.name,
  version: manifest.version,
  description: manifest.description,
  browser_action: manifest.action,
  options_ui: manifest.options_ui,
  icons: manifest.icons,
  permissions: manifest.permissions,
  content_security_policy: (manifest.content_security_policy as { extension_pages: string })?.extension_pages,
};

export async function writeManifest() {
  fs.ensureDirSync(r(`dist`));
  fs.writeJSONSync(r('dist/manifest.json'), isDev ? manifestV2 : manifest, {
    spaces: 2,
  });
  console.log(`Writing manifest.json to '${__dirname}/dist/manifest.json'`);
}

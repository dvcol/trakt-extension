import fs from 'fs-extra';

import pkg from '../package.json';

import { isDev, port, resolveParent } from './utils';

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
  background: {
    service_worker: 'script/background.js',
  },
  permissions: ['storage'],
  content_security_policy: {
    // Adds localhost for vite hot reload
    extension_pages: isDev
      ? `script-src 'self' http://localhost:${port}; object-src 'self' http://localhost:${port}`
      : "script-src 'self'; object-src 'self'",
  },
};

export async function writeManifest() {
  fs.ensureDirSync(resolveParent(`dist`));
  fs.writeJSONSync(resolveParent('dist/manifest.json'), manifest, {
    spaces: 2,
  });
  console.log(`Writing manifest.json to '${__dirname}/dist/manifest.json'`);
}

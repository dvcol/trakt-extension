import fs from 'fs-extra';

import pkg from '../package.json';

import { getDirName, isDev, port, resolveParent } from './utils';

import type { Manifest } from 'webextension-polyfill';

export const Endpoints = {
  trakt: {
    Domain: 'https://trakt.tv',
    SubDomain: 'https://*.trakt.tv',
    Production: 'https://api.trakt.tv',
    Staging: 'https://api-staging.trakt.tv',
  },
  tvdb: 'https://api4.thetvdb.co',
  tmdb: {
    api: 'https://api.themoviedb.org',
    redirect: 'https://www.themoviedb.org',
  },
} as const;

export const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 3,
  name: pkg.title || pkg.name,
  version: pkg.version,
  description: pkg.description,
  default_locale: 'en',
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
    default_title: pkg.title || pkg.name,
    default_icon: 'icons/icon-512.png',
    default_popup: 'views/popup/index.html',
  },
  background: {
    service_worker: 'scripts/background.js',
  },
  permissions: ['storage', 'tabs'],
  web_accessible_resources: [
    {
      resources: ['/views/options/index.html'],
      matches: [`${Endpoints.trakt.Production}/*`, `${Endpoints.trakt.Staging}/*`, `${Endpoints.tvdb}/*`, `${Endpoints.tmdb.redirect}/*`],
    },
  ],
  host_permissions: [
    `${Endpoints.trakt.Domain}/*`,
    `${Endpoints.trakt.SubDomain}/*`,
    `${Endpoints.trakt.Production}/*`,
    `${Endpoints.trakt.Staging}/*`,
    `${Endpoints.tvdb}/*`,
    `${Endpoints.tmdb.api}/*`,
  ],
  content_security_policy: {
    // Adds localhost for vite hot reload
    extension_pages: isDev
      ? `script-src 'self' http://localhost:${port}; object-src 'self' http://localhost:${port}`
      : "script-src 'self'; object-src 'self'",
  },
};

export async function writeManifest() {
  fs.ensureDirSync(resolveParent('dist'));
  fs.writeJSONSync(resolveParent('dist/manifest.json'), manifest, {
    spaces: 2,
  });
  console.info(`Writing manifest.json to '${getDirName()}/dist/manifest.json'`);
}

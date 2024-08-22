import { Config as SimklConfig } from '@dvcol/simkl-http-client/config';
import { Config as TmdbConfig } from '@dvcol/tmdb-http-client/config';
import { Config as TraktConfig } from '@dvcol/trakt-http-client/config';
import fs from 'fs-extra';

import pkg from '../package.json';

import { getDirName, isDev, port, resolveParent } from './utils';

import type { Manifest } from 'webextension-polyfill';

const Endpoints = {
  Trakt: {
    Domain: TraktConfig.Website.Production,
    StagingDomain: TraktConfig.Website.Staging,
    SubDomain: 'https://*.trakt.tv',
    Api: TraktConfig.Endpoint.Production,
    StagingApi: TraktConfig.Endpoint.Staging,
  },
  Tmdb: {
    Api: TmdbConfig.Endpoint,
    Domain: TmdbConfig.Website,
  },
  Simkl: {
    Api: SimklConfig.Endpoint,
    Data: SimklConfig.Data,
    Domain: SimklConfig.Website,
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
    type: 'module',
  },
  permissions: ['storage', 'tabs', 'contextMenus', 'cookies'],
  web_accessible_resources: [
    {
      resources: ['/views/options/index.html'],
      matches: [
        `${Endpoints.Trakt.Api}/*`,
        `${Endpoints.Trakt.StagingApi}/*`,
        `${Endpoints.Trakt.Domain}/*`,
        `${Endpoints.Trakt.StagingDomain}/*`,
        `${Endpoints.Tmdb.Domain}/*`,
        `${Endpoints.Simkl.Domain}/*`,
      ],
    },
  ],
  host_permissions: [
    `${Endpoints.Trakt.Domain}/*`,
    `${Endpoints.Trakt.SubDomain}/*`,
    `${Endpoints.Trakt.Api}/*`,
    `${Endpoints.Trakt.StagingApi}/*`,
    `${Endpoints.Tmdb.Api}/*`,
    `${Endpoints.Tmdb.Domain}/*`,
    `${Endpoints.Simkl.Api}/*`,
    `${Endpoints.Simkl.Data}/*`,
    `${Endpoints.Simkl.Domain}/*`,
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

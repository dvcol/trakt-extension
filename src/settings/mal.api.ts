import { Config as MalConfig } from '@dvcol/mal-http-client/config';

import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';

import type { MalClientSettings } from '@dvcol/mal-http-client/models';

import { WebConfig } from '~/settings/web.config';

export const Config = {
  endpoint: MalConfig.endpoint,
  TokenTTL: MalConfig.TokenTTL,
  RefreshTokenTTL: MalConfig.RefreshTokenTTL,
  UserAgent: `${import.meta.env.PKG_NAME}/${import.meta.env.PKG_VERSION}`,
  ClientId: import.meta.env.VITE_MAL_CLIENT_ID,
  ClientSecret: import.meta.env.VITE_MAL_CLIENT_SECRET,
  RedirectionUrl: `chrome-extension://${chromeRuntimeId}/views/options/index.html`,
} as const;

const malClientSettings: MalClientSettings = {
  client_id: Config.ClientId,
  client_secret: Config.ClientSecret,
  redirect_uri: Config.RedirectionUrl,

  endpoint: Config.endpoint,
  TokenTTL: Config.TokenTTL,
  RefreshTokenTTL: Config.RefreshTokenTTL,

  useragent: Config.UserAgent,
};

if (!chromeRuntimeId) {
  malClientSettings.redirect_uri = new URL(window.location.pathname, window.location.origin).href.replace(/\/$/, '');
  malClientSettings.corsProxy = WebConfig.CorsProxy;
  malClientSettings.corsPrefix = WebConfig.CorsPrefix.ApiMal;
}

export { malClientSettings };

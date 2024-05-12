import { Config as TraktConfig } from '@dvcol/trakt-http-client/config';

import type { TraktClientSettings } from '@dvcol/trakt-http-client/models';

import { WebConfig } from '~/settings/web.config';
import { chromeRuntimeId } from '~/utils/browser/browser.utils';

export const Config = {
  UserAgent: `${import.meta.env.PKG_NAME}/${import.meta.env.PKG_VERSION}`,
};

export const Production = {
  ID: import.meta.env.VITE_TRAKT_PRODUCTION_ID,
  Secret: import.meta.env.VITE_TRAKT_PRODUCTION_SECRET,
  TraktEndpoint: TraktConfig.endpoint.Production,
  RedirectionUrl: `chrome-extension://${chromeRuntimeId}/views/options/index.html`,
} as const;

export const Staging = {
  ID: import.meta.env.VITE_TRAKT_STAGING_ID,
  Secret: import.meta.env.VITE_TRAKT_STAGING_SECRET,
  TraktEndpoint: TraktConfig.endpoint.Staging,
  RedirectionUrl: `chrome-extension://${chromeRuntimeId}/views/options/index.html`,
} as const;

const client = Production;

const traktClientSettings: TraktClientSettings = {
  client_id: client.ID,
  client_secret: client.Secret,
  redirect_uri: client.RedirectionUrl,
  endpoint: client.TraktEndpoint,

  useragent: Config.UserAgent,
};

if (!chromeRuntimeId) {
  traktClientSettings.redirect_uri = window.location.href.split('#').at(0)?.replace(/\/$/, '') ?? traktClientSettings.redirect_uri;
  traktClientSettings.corsProxy = WebConfig.CorsProxy;
  traktClientSettings.corsPrefix = WebConfig.CorsPrefix.trakt;
}

export { traktClientSettings };

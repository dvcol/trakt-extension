import type { TraktClientSettings } from '~/models/trakt/trakt-client.model';

import { WebConfig } from '~/settings/web.config';
import { chromeRuntimeId } from '~/utils/browser/browser.utils';

export const Config = {
  UserAgent: `${import.meta.env.PKG_NAME}/${import.meta.env.PKG_VERSION}`,
};

export const Production = {
  ID: '4f2745eb6a58949bd35f4948b70d0dd7184462841052fa11f24d85edc1256a22',
  Secret: '322d3d1a6d6d9214a1fc120903c8722b266e7643bd708e437ddbb68f5c737fa2',
  TraktEndpoint: 'https://api.trakt.tv',
  RedirectionUrl: 'chrome-extension://eiljcfkgmgjbjglhhhnchonnjefhncad/views/options/index.html',
} as const;

export const Staging = {
  ID: 'e3fe38d76cbd787f74ada8f043a69dfc8b20a86569e51ee125bf0c084d6c553c',
  Secret: '14780b6623c64337f442b06603a5484b9422c4fe3ced7e109a1e0f795a708752',
  TraktEndpoint: 'https://api-staging.trakt.tv',
  RedirectionUrl: 'chrome-extension://eiljcfkgmgjbjglhhhnchonnjefhncad/views/options/index.html',
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
  traktClientSettings.redirect_uri = window.location.href.split('#').at(0)!;
  traktClientSettings.corsProxy = WebConfig.CorsProxy;
  traktClientSettings.corsPrefix = WebConfig.CorsPrefix.trakt;
}

export { traktClientSettings };

import { Config } from '@dvcol/simkl-http-client/config';

import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';

import type { SimklClientSettings } from '@dvcol/simkl-http-client/models';

import { WebConfig } from '~/settings/web.config';

const simklClientSettings: SimklClientSettings = {
  client_id: import.meta.env.VITE_SIMKL_CLIENT_ID,
  client_secret: import.meta.env.VITE_SIMKL_CLIENT_SECRET,
  redirect_uri: `chrome-extension://${chromeRuntimeId}/views/options/index.html?simkl=true`,

  endpoint: Config.Endpoint,

  useragent: `${import.meta.env.PKG_NAME}/${import.meta.env.PKG_VERSION}`,
};

if (!chromeRuntimeId) {
  simklClientSettings.redirect_uri = `${new URL(window.location.pathname, window.location.origin).href.replace(/\/$/, '')}?simkl=true`;
  simklClientSettings.corsProxy = WebConfig.CorsProxy;
  simklClientSettings.corsPrefix = WebConfig.CorsPrefix.ApiSimkl;
}

export { simklClientSettings };

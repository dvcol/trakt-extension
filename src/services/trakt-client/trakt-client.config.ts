import type { TraktClientSettings } from '~/models/trakt/trakt-client.model';

import { Config, Production, Staging } from '~/settings/traktv.api';

const isProd = import.meta.env.PROD;

const client = isProd ? Production : Staging;

export const traktClientSettings: TraktClientSettings = {
  client_id: client.ID,
  client_secret: client.Secret,
  redirect_uri: client.RedirectionUrl,
  endpoint: client.TraktEndpoint,

  useragent: Config.UserAgent,
};

import { describe, it } from 'vitest';

import { Client, Config } from '../../../settings/traktv.api';

import { BaseTraktClient } from './base-trakt-client';

describe('baseTraktClient', () => {
  const client = new BaseTraktClient({
    client_id: Client.ID,
    client_secret: Client.Secret,
    redirect_uri: Config.RedirectionUrl,

    useragent: Config.UserAgent,
    endpoint: Config.TraktEndpoint,
  });

  it('should be defined', () => {
    expect.assertions(1);

    expect(client).toBeDefined();
  });
});

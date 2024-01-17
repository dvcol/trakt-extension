import { describe, it } from 'vitest';

import { traktClientSettings } from '../trakt-client.service';

import { BaseTraktClient } from './base-trakt-client';

describe('baseTraktClient', () => {
  const client = new BaseTraktClient(traktClientSettings);

  it('should be defined', () => {
    expect.assertions(1);

    expect(client).toBeDefined();
  });
});

import { describe } from 'vitest';

import { tmdbClientSettings } from '../../../settings/tmdb.api';

import { TmdbClient } from './tmdb-client';

describe('tmdb-client.ts', () => {
  const tmdbClient = new TmdbClient(tmdbClientSettings);

  it.skip('should have every endpoint', async () => {
    const res = await tmdbClient.v4.account.lists();

    const data = await res.json();

    expect(data).toBeDefined();
  });
});

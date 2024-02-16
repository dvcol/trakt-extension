import type { TmdbApiResponse } from '~/models/tmdb/tmdb-client.model';

import { TmdbClient } from '~/services/tmdb-client/clients/tmdb-client';
import { tmdbClientSettings } from '~/settings/tmdb.api';
import { ChromeCacheStore } from '~/utils/cache.utils';

const cacheStore = new ChromeCacheStore<TmdbApiResponse>({ prefix: 'tmdb-cache' });
export const tmdbService = new TmdbClient({ ...tmdbClientSettings, cacheStore });

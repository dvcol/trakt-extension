import type { TvdbApiResponse } from '~/models/tvdb/tvdb-client.model';

import { TvdbClient } from '~/services/tvdb-client/clients/tvdb-client';
import { tvdbClientSettings } from '~/settings/tvdb.api';
import { ChromeCacheStore } from '~/utils/cache.utils';

const cacheStore = new ChromeCacheStore<TvdbApiResponse>({ prefix: 'tmdb-cache' });
export const tvdbService = new TvdbClient({ ...tvdbClientSettings, cacheStore });

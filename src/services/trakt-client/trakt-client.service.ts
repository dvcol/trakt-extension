import type { TraktApiResponse } from '~/models/trakt/trakt-client.model';

import { traktApi } from '~/services/trakt-client/api/trakt-api.endpoints';
import { TraktClient } from '~/services/trakt-client/clients/trakt-client';
import { traktClientSettings } from '~/settings/traktv.api';
import { ChromeCacheStore } from '~/utils/cache.utils';

const cacheStore = new ChromeCacheStore<TraktApiResponse>({ prefix: 'trakt-cache' });
export const traktService = new TraktClient({ ...traktClientSettings, cacheStore }, {}, traktApi);

import { TvdbClient } from '~/services/tvdb-client/clients/tvdb-client';
import { tvdbClientSettings } from '~/settings/tvdb.api';

export const tvdbService = new TvdbClient(tvdbClientSettings);

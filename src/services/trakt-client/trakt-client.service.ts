import { TraktClient } from '~/services/trakt-client/clients/trakt-client';
import { traktClientSettings } from '~/settings/traktv.api';

export const traktService = new TraktClient(traktClientSettings);

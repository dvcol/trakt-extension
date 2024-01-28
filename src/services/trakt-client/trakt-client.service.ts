import { TraktClient } from '~/services/trakt-client/clients/trakt-client';
import { traktClientSettings } from '~/services/trakt-client/trakt-client.config';

export const traktService = new TraktClient(traktClientSettings);

import { TmdbClient } from '~/services/tmdb-client/clients/tmdb-client';
import { tmdbClientSettings } from '~/settings/tmdb.api';

export const tmdbService = new TmdbClient(tmdbClientSettings);

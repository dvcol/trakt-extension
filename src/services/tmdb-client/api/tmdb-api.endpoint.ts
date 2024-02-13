import { v3 } from '~/services/tmdb-client/api/endpoints/v3';
import { v4 } from '~/services/tmdb-client/api/endpoints/v4';

export const tmdbApi = {
  v3,
  v4,
};

const { auth } = v4;
export const minimalTmdbApi = { v4: { auth } };

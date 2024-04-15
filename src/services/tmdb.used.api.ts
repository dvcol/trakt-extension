import { configuration } from '~/services/tmdb-client/api/endpoints/v3/configuration.endpoint';
import { episodes } from '~/services/tmdb-client/api/endpoints/v3/episodes.endpoint';
import { movies } from '~/services/tmdb-client/api/endpoints/v3/movies.endpoint';
import { people } from '~/services/tmdb-client/api/endpoints/v3/people.endpoint';
import { seasons } from '~/services/tmdb-client/api/endpoints/v3/sesons.endpoint';
import { shows } from '~/services/tmdb-client/api/endpoints/v3/shows.endpoint';
import { minimalTmdbApi } from '~/services/tmdb-client/api/tmdb-minimal-api.endpoints';

export const tmdbUsedApi = {
  ...minimalTmdbApi,
  v3: {
    configuration,
    movies,
    shows,
    seasons,
    episodes,
    people,
  },
};

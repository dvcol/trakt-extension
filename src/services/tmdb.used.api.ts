import { minimalTmdbApi } from '@dvcol/tmdb-http-client/api/minimal';
import { configuration } from '@dvcol/tmdb-http-client/api/v3/configuration';
import { discover } from '@dvcol/tmdb-http-client/api/v3/discover';
import { episodes } from '@dvcol/tmdb-http-client/api/v3/episodes';
import { movies } from '@dvcol/tmdb-http-client/api/v3/movies';
import { people } from '@dvcol/tmdb-http-client/api/v3/people';
import { providers } from '@dvcol/tmdb-http-client/api/v3/providers';
import { seasons } from '@dvcol/tmdb-http-client/api/v3/seasons';
import { shows } from '@dvcol/tmdb-http-client/api/v3/shows';

export const tmdbUsedApi = {
  ...minimalTmdbApi,
  v3: {
    configuration,
    movies,
    shows,
    seasons,
    episodes,
    people,
    discover,
    providers,
  },
};

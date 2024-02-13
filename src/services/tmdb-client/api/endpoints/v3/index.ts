import { account } from '~/services/tmdb-client/api/endpoints/v3/account.endpoint';
import { authentification } from '~/services/tmdb-client/api/endpoints/v3/authentication.endpoint';
import { certifications } from '~/services/tmdb-client/api/endpoints/v3/certifications.endpoint';
import { changes } from '~/services/tmdb-client/api/endpoints/v3/changes.endpoint';
import { collections } from '~/services/tmdb-client/api/endpoints/v3/collections.endpoint';
import { companies } from '~/services/tmdb-client/api/endpoints/v3/companies.endpoint';
import { configuration } from '~/services/tmdb-client/api/endpoints/v3/configuration.endpoint';
import { credits } from '~/services/tmdb-client/api/endpoints/v3/credits.endpoint';
import { discover } from '~/services/tmdb-client/api/endpoints/v3/discover.endpoint';
import { episodes } from '~/services/tmdb-client/api/endpoints/v3/episodes.endpoint';
import { find } from '~/services/tmdb-client/api/endpoints/v3/find.endpoint';
import { genres } from '~/services/tmdb-client/api/endpoints/v3/genres.endpoint';
import { keywords } from '~/services/tmdb-client/api/endpoints/v3/keywords.endpoint';
import { list } from '~/services/tmdb-client/api/endpoints/v3/lists.endpoint';
import { movies } from '~/services/tmdb-client/api/endpoints/v3/movies.endpoint';
import { networks } from '~/services/tmdb-client/api/endpoints/v3/networks.endpoint';
import { people } from '~/services/tmdb-client/api/endpoints/v3/people.endpoint';
import { reviews } from '~/services/tmdb-client/api/endpoints/v3/reviews.endpoint';
import { search } from '~/services/tmdb-client/api/endpoints/v3/search.endpoint';
import { seasons } from '~/services/tmdb-client/api/endpoints/v3/sesons.endpoint';
import { shows } from '~/services/tmdb-client/api/endpoints/v3/shows.endpoint';
import { trending } from '~/services/tmdb-client/api/endpoints/v3/trending.endpoint';

export const v3 = {
  account,
  authentification,
  certifications,
  changes,
  collections,
  companies,
  configuration,
  credits,
  discover,
  find,
  genres,
  keywords,
  list,
  movies,
  networks,
  people,
  reviews,
  search,
  trending,
  shows,
  seasons,
  episodes,
};

import { account } from '~/services/tmdb-client/api/endpoints/v3/account.endpoint';
import { authentification } from '~/services/tmdb-client/api/endpoints/v3/authentication.endpoint';
import { certifications } from '~/services/tmdb-client/api/endpoints/v3/certifications.endpoint';
import { changes } from '~/services/tmdb-client/api/endpoints/v3/changes.endpoint';
import { collections } from '~/services/tmdb-client/api/endpoints/v3/collections.endpoint';
import { companies } from '~/services/tmdb-client/api/endpoints/v3/companies.endpoint';
import { configuration } from '~/services/tmdb-client/api/endpoints/v3/configuration.endpoint';
import { credits } from '~/services/tmdb-client/api/endpoints/v3/credits.endpoint';
import { discover } from '~/services/tmdb-client/api/endpoints/v3/discover.endpoint';
import { find } from '~/services/tmdb-client/api/endpoints/v3/find.endpoint';
import { genres } from '~/services/tmdb-client/api/endpoints/v3/genres.endpoint';
import { keywords } from '~/services/tmdb-client/api/endpoints/v3/keywords.endpoint';
import { list } from '~/services/tmdb-client/api/endpoints/v3/lists.endpoint';
import { movies } from '~/services/tmdb-client/api/endpoints/v3/movies.endpoint';

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
};

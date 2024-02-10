import { account } from '~/services/tmdb-client/api/endpoints/v3/account.endpoint';
import { authentification } from '~/services/tmdb-client/api/endpoints/v3/authentication.endpoint';
import { certifications } from '~/services/tmdb-client/api/endpoints/v3/certifications.endpoint';
import { changes } from '~/services/tmdb-client/api/endpoints/v3/changes.endpoint';

export const v3 = {
  account,
  authentification,
  certifications,
  changes,
};

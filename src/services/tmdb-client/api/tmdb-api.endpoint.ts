import { account } from '~/services/tmdb-client/api/endpoints/v4/account.endpoint';
import { auth } from '~/services/tmdb-client/api/endpoints/v4/auth.endpoint';

export const tmdbApi = {
  v3: {},
  v4: {
    auth,
    account,
  },
};

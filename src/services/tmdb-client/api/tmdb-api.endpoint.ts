import { account } from '~/services/tmdb-client/api/endpoints/v4/account.endpoint';
import { auth } from '~/services/tmdb-client/api/endpoints/v4/auth.endpoint';
import { lists } from '~/services/tmdb-client/api/endpoints/v4/lists.endpoint';

const v4 = {
  account,
  auth,
  lists,
};

export const tmdbApi = {
  v3: {},
  v4,
};

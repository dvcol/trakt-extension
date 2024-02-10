import { account } from '~/services/tmdb-client/api/endpoints/v4/account.endpoint';
import { auth } from '~/services/tmdb-client/api/endpoints/v4/auth.endpoint';
import { lists } from '~/services/tmdb-client/api/endpoints/v4/lists.endpoint';

export const v4 = {
  account,
  auth,
  lists,
};

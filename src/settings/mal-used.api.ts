import { anime } from '@dvcol/mal-http-client/api/anime';
import { minimalMalApi } from '@dvcol/mal-http-client/api/minimal';
import { user } from '@dvcol/mal-http-client/api/user';

export const malUsedApi = {
  ...minimalMalApi,
  anime,
  user,
};

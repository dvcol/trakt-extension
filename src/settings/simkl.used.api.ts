import { minimalSimklApi } from '@dvcol/simkl-http-client/api/minimal';
import { movie } from '@dvcol/simkl-http-client/api/movie';
import { show } from '@dvcol/simkl-http-client/api/show';
import { user } from '@dvcol/simkl-http-client/api/user';

export const simklUsedApi = {
  ...minimalSimklApi,
  user,
  show,
  movie,
};

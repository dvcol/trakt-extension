import { TvdbClientEndpoint } from '~/models/tvdb/tvdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Create an auth token. The token has one month validation length.
 *
 * @see [login]{@link https://thetvdb.github.io/v4-api/#/Login}
 */
export const login = new TvdbClientEndpoint<
  {
    apiKey: string;
    pin?: string;
  },
  {
    token: string;
  },
  false
>({
  method: HttpMethod.POST,
  url: '/login',
  opts: {
    cache: false,
  },
  body: {
    apiKey: true,
    pin: false,
  },
});

import { calendars } from '@dvcol/trakt-http-client/api/calendar';
import { episodes } from '@dvcol/trakt-http-client/api/episodes';
import { minimalTraktApi } from '@dvcol/trakt-http-client/api/minimal';
import { movies } from '@dvcol/trakt-http-client/api/movies';
import { people } from '@dvcol/trakt-http-client/api/people';
import { search } from '@dvcol/trakt-http-client/api/search';
import { seasons } from '@dvcol/trakt-http-client/api/seasons';
import { shows } from '@dvcol/trakt-http-client/api/shows';
import { sync } from '@dvcol/trakt-http-client/api/sync';
import { users } from '@dvcol/trakt-http-client/api/users';

export const traktUsedApi = {
  ...minimalTraktApi,
  users,
  sync,
  calendars,
  search,
  shows,
  seasons,
  episodes,
  movies,
  people,
};

import { calendars } from '~/services/trakt-client/api/endpoints/calendar.endpoint';
import { episodes } from '~/services/trakt-client/api/endpoints/episodes.endpoint';
import { movies } from '~/services/trakt-client/api/endpoints/movies.endpoint';
import { people } from '~/services/trakt-client/api/endpoints/people.endpoint';
import { search } from '~/services/trakt-client/api/endpoints/search.endpoint';
import { seasons } from '~/services/trakt-client/api/endpoints/seasons.endpoint';
import { shows } from '~/services/trakt-client/api/endpoints/shows.endpoint';
import { sync } from '~/services/trakt-client/api/endpoints/sync.endpoint';
import { users } from '~/services/trakt-client/api/endpoints/users.endpoint';
import { minimalTraktApi } from '~/services/trakt-client/api/trakt-api-minimal.endpoints';

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

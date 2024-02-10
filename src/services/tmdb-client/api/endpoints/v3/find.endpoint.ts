import type { TmdbEpisodeShort } from '~/models/tmdb/tmdb-episode.model';
import type { TmdbMovieShort } from '~/models/tmdb/tmdb-movie.model';
import type { TmdbPersonShort } from '~/models/tmdb/tmdb-person.model';

import type { TmdbSeasonShort } from '~/models/tmdb/tmdb-season.model';
import type { TmdbShowShort } from '~/models/tmdb/tmdb-show.model';

import { TmdbClientEndpoint } from '~/models/tmdb/tmdb-client.model';

/**
 * Find v3 endpoints.
 */
export const find = {
  /**
   * Find data by external ID's.
   *
   * The find method makes it easy to search for objects in our database by an external identifier.
   *
   * This method will search all objects (movies, TV shows and people) and return the results in a single response.
   *
   * The supported external sources for each object are as follows:
   *
   * | Source   | Movies | TV Shows | TV Seasons | TV Episodes | People |
   * |----------|:------:|:--------:|:----------:|:-----------:|:------:|
   * | IMDb     |   ✅   |    ✅    |            |      ✅     |   ✅   |
   * | Facebook |   ✅   |    ✅    |            |             |   ✅   |
   * | Instagram|   ✅   |    ✅    |            |             |   ✅   |
   * | TheTVDB  |        |    ✅    |     ✅     |      ✅     |        |
   * | TikTok   |   ✅   |    ✅    |            |             |   ✅   |
   * | Twitter  |   ✅   |    ✅    |            |             |   ✅   |
   * | Wikidata |   ✅   |    ✅    |     ✅     |      ✅     |   ✅   |
   * | YouTube  |   ✅   |    ✅    |            |             |   ✅   |
   *
   * @version 3
   *
   * @see [find-by-external-id]{@link https://developer.themoviedb.org/reference/find-by-id}
   */
  id: new TmdbClientEndpoint<
    {
      external_id: string;
      external_source: string;
      language?: string;
    },
    {
      movie_results: TmdbMovieShort[];
      person_results: TmdbPersonShort[];
      tv_results: TmdbShowShort[];
      tv_episode_results: TmdbEpisodeShort[];
      tv_season_results: TmdbSeasonShort[];
    }
  >({
    method: 'GET',
    url: '/find/:external_id?external_source=&language=',
    opts: {
      version: 3,
      parameters: {
        path: {
          external_id: true,
        },
        query: {
          external_source: true,
          language: false,
        },
      },
    },
  }),
};

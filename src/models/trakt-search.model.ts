import type { TraktApiExtended, TraktApiParams, TraktApiParamsExtended, TraktApiParamsPagination } from '~/models/trakt-client.model';
import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktList } from '~/models/trakt-list.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktPerson } from '~/models/trakt-people.model';
import type { TraktShow } from '~/models/trakt-show.model';
import type { TraktApiCommonFilters } from '~/services/trakt-client/api/trakt-api.filters';

export type TraktSearchType = 'movie' | 'show' | 'episode' | 'person' | 'list';

export type TraktSearchField = {
  movie: 'title' | 'tagline' | 'overview' | 'people' | 'translations' | 'aliases';
  show: 'title' | 'overview' | 'people' | 'translations' | 'aliases';
  episode: 'title' | 'overview';
  person: 'name' | 'biography';
  list: 'name' | 'description';
};

export type TraktSearchFields = TraktSearchField[keyof TraktSearchField];

/**
 * Trakt Search request
 * @see search [Trakt API Documentation](https://trakt.docs.apiary.io/#reference/search)
 */
export type TraktSearch = TraktApiParams<
  {
    /** Search type */
    type: TraktSearchType | TraktSearchType[];
    /** Search all text based fields. */
    query: string;
    /** Filter search on (a) specific field(s) */
    fields?: TraktSearchFields | TraktSearchFields[];
  },
  typeof TraktApiExtended.Full,
  TraktApiCommonFilters,
  true
>;

/**
 * Search all text fields that a media object contains (i.e. title, overview, etc).
 * Results are ordered by the most relevant score.
 * Specify the type of results by sending a single value or a comma delimited string for multiple types.
 *
 * @see [search]{@link https://trakt.docs.apiary.io/#reference/search}
 */
export type TraktSearchResult<T extends 'movie' | 'show' | 'episode' | 'person' | 'list' | 'any' = 'any'> = { score: number } & (T extends 'movie'
  ? { type: 'movie'; movie: TraktMovie }
  : T extends 'show'
    ? { type: 'show'; show: TraktShow }
    : T extends 'episode'
      ? { type: 'episode'; show: TraktShow; episode: TraktEpisode }
      : T extends 'person'
        ? { type: 'person'; person: TraktPerson }
        : T extends 'list'
          ? { type: 'list'; list: TraktList }
          : { type: 'movie' | 'show' | 'episode' | 'person' | 'list' } & (
              | { movie: TraktMovie }
              | { show: TraktShow }
              | { show: TraktShow; episode: TraktEpisode }
              | { person: TraktPerson }
              | { list: TraktList }
            ));

export type TraktIdLookupType = 'trakt' | 'imdb' | 'tmdb' | 'tvdb';

export type TraktIdLookup = {
  id_type: TraktIdLookupType;
  id: string;
  type?: TraktSearchType | TraktSearchType[];
} & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
  TraktApiParamsPagination;

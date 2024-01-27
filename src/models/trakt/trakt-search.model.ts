import type { TraktApiExtended, TraktApiParams, TraktApiParamsExtended, TraktApiParamsPagination } from '~/models/trakt/trakt-client.model';
import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktList } from '~/models/trakt/trakt-list.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktPerson } from '~/models/trakt/trakt-people.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';
import type { TraktApiCommonFilters } from '~/services/trakt-client/api/trakt-api.filters';
import type { RequireAtLeastOne } from '~/utils/typescript.utils';

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

type BaseTraktSearchResultItem<I extends 'extended' | 'short' | 'any' = 'any'> = {
  movie: TraktMovie<I>;
  show: TraktShow<I>;
  episode: TraktEpisode<I>;
  person: TraktPerson<I>;
  list: TraktList<I>;
};

/**
 * Search all text fields that a media object contains (i.e. title, overview, etc).
 * Results are ordered by the most relevant score.
 * Specify the type of results by sending a single value or a comma delimited string for multiple types.
 *
 * @see [search]{@link https://trakt.docs.apiary.io/#reference/search}
 */
export type TraktSearchResult<
  T extends 'movie' | 'show' | 'episode' | 'person' | 'list' | 'any' = 'any',
  I extends 'extended' | 'short' | 'any' = 'any',
> = { score: number; type: T extends 'any' ? 'movie' | 'show' | 'episode' | 'person' | 'list' : T } & (T extends 'movie'
  ? Pick<BaseTraktSearchResultItem<I>, 'movie'>
  : T extends 'show'
    ? Pick<BaseTraktSearchResultItem<I>, 'show'>
    : T extends 'episode'
      ? Pick<BaseTraktSearchResultItem<I>, 'show' | 'episode'>
      : T extends 'person'
        ? Pick<BaseTraktSearchResultItem<I>, 'person'>
        : T extends 'list'
          ? Pick<BaseTraktSearchResultItem<I>, 'list'>
          : { show: TraktShow<I>; episode: TraktEpisode<I> } | RequireAtLeastOne<Omit<BaseTraktSearchResultItem<I>, 'episode'>>);

export type TraktIdLookupType = 'trakt' | 'imdb' | 'tmdb' | 'tvdb';

export type TraktIdLookup = {
  id_type: TraktIdLookupType;
  id: string;
  type?: TraktSearchType | TraktSearchType[];
} & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
  TraktApiParamsPagination;

import type { TraktApiExtended, TraktApiParams, TraktApiParamsExtended, TraktApiParamsPagination } from '~/models/trakt/trakt-client.model';
import type { Any, EntityTypes } from '~/models/trakt/trakt-entity.model';
import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktList } from '~/models/trakt/trakt-list.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktPerson } from '~/models/trakt/trakt-people.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';
import type { TraktApiCommonFilters } from '~/services/trakt-client/api/trakt-api.filters';
import type { RequireAtLeastOne } from '~/utils/typescript.utils';

export type TraktSearchField = {
  movie: 'title' | 'overview' | 'aliases' | 'people' | 'translations' | 'tagline';
  show: 'title' | 'overview' | 'aliases' | 'people' | 'translations';
  episode: 'title' | 'overview';
  person: 'name' | 'biography';
  list: 'name' | 'description';
};

export type TraktSearchType = keyof TraktSearchField;

/**
 * Trakt Search request
 * @see search [Trakt API Documentation](https://trakt.docs.apiary.io/#reference/search)
 */
export type TraktSearch<T extends TraktSearchType = TraktSearchType> = TraktApiParams<
  {
    /** Search type */
    type: T | T[];
    /** Search all text based fields. */
    query: string;
    /** Filter search on (a) specific field(s) */
    fields?: TraktSearchField[T] | TraktSearchField[T][];
    /** Escape special characters in the query string. */
    escape?: boolean;
  },
  typeof TraktApiExtended.Full,
  TraktApiCommonFilters,
  true
>;

type BaseTraktSearchResultItem<I extends EntityTypes = Any> = {
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
export type TraktSearchResult<T extends 'movie' | 'show' | 'episode' | 'person' | 'list' | Any = Any, I extends EntityTypes = Any> = {
  score: number;
  type: T extends Any ? 'movie' | 'show' | 'episode' | 'person' | 'list' : T;
} & (T extends 'movie'
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

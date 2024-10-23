import type { TraktApiIds, TraktCollection, TraktFavoriteItem, TraktListItem, TraktUser, TraktWatchlist } from '@dvcol/trakt-http-client/models';

import type { ListScrollItemType } from '~/models/list-scroll.model';

export type AnyList =
  | TraktListItem
  | TraktWatchlist
  | TraktFavoriteItem
  | (TraktCollection & { id: number | string; type?: typeof ListScrollItemType.Loading });

export const ListType = {
  List: 'list',
  Collaboration: 'collaboration',
  Collection: 'collection',
  Watchlist: 'watchlist',
  Favorites: 'favorites',
  History: 'history',
} as const;

export type ListTypes = (typeof ListType)[keyof typeof ListType];

export type ListEntity = {
  type: ListTypes;
  id: number | string | DefaultListIds;
  name: string;
  owner?: TraktUser;
  scope?: 'movies' | 'shows';
};

export type AnyListDateTypes = 'listed_at' | 'last_collected_at' | 'collected_at';

export const DefaultListId = {
  Watchlist: 'watchlist',
  Favorites: 'favorites',
  MovieCollection: 'movie-collection',
  ShowCollection: 'show-collection',
  History: 'history',
} as const;

export type DefaultListIds = (typeof DefaultListId)[keyof typeof DefaultListId];

export const isCollectionList = (list?: ListEntity) =>
  !!list && [DefaultListId.MovieCollection, DefaultListId.ShowCollection].map(String).includes(list.id?.toString());

export const DefaultLists = {
  Watchlist: { type: ListType.Watchlist, id: DefaultListId.Watchlist, name: 'list_type__watchlist' },
  Favorites: { type: ListType.Favorites, id: DefaultListId.Favorites, name: 'list_type__favorites' },
  MovieCollection: { type: ListType.Collection, id: DefaultListId.MovieCollection, scope: 'movies', name: 'list_type__collection_movie' },
  ShowCollection: { type: ListType.Collection, id: DefaultListId.ShowCollection, scope: 'shows', name: 'list_type__collection_show' },
} as const satisfies Record<string, ListEntity>;

export const DefaultListsTypes: ListTypes[] = Object.values(DefaultLists).map(l => l.type);

export const isDefaultList = (list: ListEntity | ListTypes) => DefaultListsTypes.includes(typeof list === 'string' ? list : list.type);

export type ListItemTypes = 'show' | 'season' | 'episode' | 'movie';
export const isListItemType = (type?: string): type is ListItemTypes => !!type && ['show', 'season', 'episode', 'movie'].includes(type);
export const canFavorite = (type?: string) => type === 'show' || type === 'movie';

export type AddOrRemoveIds = Pick<TraktApiIds, 'trakt'> | Pick<TraktApiIds, 'trakt'>[];

export type AddOrRemoveListQuery = {
  list: ListEntity;
  itemType: ListItemTypes;
  itemIds: AddOrRemoveIds;
  date?: Date | string | number;
  remove?: boolean;
};

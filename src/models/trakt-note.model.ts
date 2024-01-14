import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktPerson } from '~/models/trakt-people.model';
import type { TraktSeason } from '~/models/trakt-season.model';
import type { TraktShow } from '~/models/trakt-show.model';
import type { TraktUser } from '~/models/trakt-user.model';
import type { RequireAtLeastOne } from '~/utils/typescript.utils';

type BaseTraktNote = {
  /** Text for the notes */
  notes: string;
  /** Is this a spoiler ? (defaults to false) */
  spoiler?: boolean;
  /** Is this a public note ? (defaults to private) */
  privacy?: 'private' | 'friends' | 'public';
};

type BaseTraktNoteRequestItem = {
  movie: TraktMovie;
  show: Pick<TraktShow, 'title' | 'ids'>;
  season: Pick<TraktSeason, 'ids'>;
  episode: Pick<TraktEpisode, 'ids'>;
  person: Pick<TraktPerson, 'ids'>;
};

export const TraktNoteItemType = {
  Movie: 'movie',
  Show: 'show',
  Season: 'season',
  Episode: 'episode',
  Person: 'person',
} as const;

export type TraktNoteItemTypes = (typeof TraktNoteItemType)[keyof typeof TraktNoteItemType];

export const TraktNoteType = {
  Movie: 'movie',
  Show: 'show',
  Season: 'season',
  Episode: 'episode',
  Person: 'person',
  History: 'history',
  Collection: 'collection',
  Rating: 'rating',
} as const;

export type TraktNoteTypes = (typeof TraktNoteType)[keyof typeof TraktNoteType];

type TraktNoteRequestItem<T extends TraktNoteTypes | 'any' = 'any'> = T extends 'movie'
  ? Pick<BaseTraktNoteRequestItem, 'movie'>
  : T extends 'show'
    ? Pick<BaseTraktNoteRequestItem, 'show'>
    : T extends 'season'
      ? Pick<BaseTraktNoteRequestItem, 'season'>
      : T extends 'episode'
        ? Pick<BaseTraktNoteRequestItem, 'episode'>
        : T extends 'person'
          ? Pick<BaseTraktNoteRequestItem, 'person'>
          : RequireAtLeastOne<BaseTraktNoteRequestItem>;

export type TraktNoteRequest<T extends TraktNoteTypes | 'any' = 'any', I extends TraktNoteItemTypes | 'any' = 'any'> = BaseTraktNote &
  (T extends 'movie'
    ? TraktNoteRequestItem<'movie'>
    : T extends 'show'
      ? TraktNoteRequestItem<'show'>
      : T extends 'season'
        ? TraktNoteRequestItem<'season'>
        : T extends 'episode'
          ? TraktNoteRequestItem<'episode'>
          : T extends 'person'
            ? TraktNoteRequestItem<'person'>
            : T extends 'history'
              ? {
                  attached_to: {
                    type: 'history';
                    id: number;
                  };
                }
              : T extends 'collection'
                ? {
                    attached_to: {
                      type: 'collection';
                    };
                  } & TraktNoteRequestItem<I>
                : T extends 'rating'
                  ? {
                      attached_to: {
                        type: 'rating';
                      };
                    } & TraktNoteRequestItem<I>
                  : TraktNoteRequestItem<I> & {
                      attached_to?: {
                        type: 'history' | 'collection' | 'rating';
                        id?: number;
                      };
                    });

type BaseTraktNoteItem = {
  movie: TraktMovie;
  show: TraktShow;
  season: TraktSeason;
  episode: TraktEpisode;
  person: TraktPerson;
};

export type TraktNoteItem<T extends TraktNoteTypes | 'any' = 'any'> = T extends 'movie'
  ? Pick<BaseTraktNoteItem, 'movie'> & { type: 'movie'; attached_to: { type: 'movie' } }
  : T extends 'show'
    ? Pick<BaseTraktNoteItem, 'show'> & { type: 'show'; attached_to: { type: 'show' } }
    : T extends 'season'
      ? Pick<BaseTraktNoteItem, 'season'> & { type: 'season'; attached_to: { type: 'season' } }
      : T extends 'episode'
        ? Pick<BaseTraktNoteItem, 'episode'> & { type: 'episode'; attached_to: { type: 'episode' } }
        : T extends 'person'
          ? Pick<BaseTraktNoteItem, 'person'> & { type: 'person'; attached_to: { type: 'person' } }
          : T extends 'history'
            ? RequireAtLeastOne<BaseTraktNoteItem> & { type: 'history'; id: number; attached_to: { type: TraktNoteItemTypes } }
            : T extends 'collection'
              ? RequireAtLeastOne<BaseTraktNoteItem> & { type: 'collection'; attached_to: { type: TraktNoteItemTypes } }
              : T extends 'rating'
                ? RequireAtLeastOne<BaseTraktNoteItem> & { type: 'rating'; attached_to: { type: TraktNoteItemTypes } }
                : BaseTraktNoteItem & {
                    type: TraktNoteTypes;
                    attached_to: {
                      type: TraktNoteTypes;
                      id?: number;
                    };
                  };

export type TraktNote = BaseTraktNote & {
  id: number;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  created_at: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  user: TraktUser;
};

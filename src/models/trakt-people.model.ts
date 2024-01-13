import type { TraktApiIds } from '~/models/trakt-id.model';

export type TraktPerson = {
  name: string;
  ids: TraktApiIds;
};

type BaseTraktCastMember = {
  characters: string[];
  person: TraktPerson;
};

export type TraktCastMember<T extends 'episodes' | 'any' | 'short' = 'any'> = T extends 'episodes'
  ? BaseTraktCastMember & { episode_count: number }
  : T extends 'short'
    ? BaseTraktCastMember
    : BaseTraktCastMember & { episode_count?: number };

type BaseTraktCrewMember = {
  jobs: string[];
  person: TraktPerson;
};

export type TraktCrewMember<T extends 'episodes' | 'any' | 'short' = 'any'> = T extends 'episodes'
  ? BaseTraktCrewMember & { episode_count: number }
  : T extends 'short'
    ? BaseTraktCrewMember
    : BaseTraktCrewMember & { episode_count?: number };

export type TraktCrew<T extends 'episodes' | 'any' | 'short' = 'any'> = Partial<
  Record<
    | 'production'
    | 'art'
    | 'crew'
    | 'costume & make-up'
    | 'directing'
    | 'writing'
    | 'sound'
    | 'camera'
    | 'visual effects'
    | 'lighting'
    | 'editing'
    | 'created-by',
    TraktCrewMember<T>[]
  >
>;

type BaseTraktCast<T extends 'episodes' | 'any' | 'short' = 'any'> = {
  cast: TraktCastMember<T>[];
  crew: TraktCrew<T>;
};

type TraktCastExtended<T extends 'episodes' | 'any' | 'short' = 'any'> = BaseTraktCast<T> & {
  guest_stars: TraktCastMember<T>[];
};

export type TraktCast<T extends 'extended' | 'short' | 'any' = 'short', E extends 'episodes' | 'any' | 'short' = 'any'> = T extends 'extended'
  ? TraktCastExtended<E>
  : T extends 'short'
    ? BaseTraktCast<E>
    : BaseTraktCast<E> & Partial<TraktCastExtended<E>>;

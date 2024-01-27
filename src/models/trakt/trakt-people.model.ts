import type { TraktApiIds } from '~/models/trakt/trakt-id.model';

export type BaseTraktPerson = {
  name: string;
  ids: TraktApiIds;
};

export const TraktPersonJob = {
  Production: 'production',
  Art: 'art',
  Crew: 'crew',
  CostumeAndMakeUp: 'costume & make-up',
  Directing: 'directing',
  Writing: 'writing',
  Sound: 'sound',
  Camera: 'camera',
  VisualEffects: 'visual effects',
  Lighting: 'lighting',
  Editing: 'editing',
} as const;

export type TraktPersonJobs = (typeof TraktPersonJob)[keyof typeof TraktPersonJob];

export type TraktPersonExtended = BaseTraktPerson & {
  social_ids: {
    twitter: string;
    facebook: string;
    instagram: string;
    wikipedia: string;
  };
  biography: string;
  /** Calendar Date in ISO 8601 format (YYYY-MM-DD) */
  birthday: string;
  death: string;
  birthplace: string;
  homepage: string;
  gender: 'male' | 'female' | 'non_binary';
  known_for_department: TraktPersonJobs;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
};

export type TraktPerson<P extends 'short' | 'extended' | 'any' = 'short'> = P extends 'short'
  ? BaseTraktPerson
  : P extends 'extended'
    ? TraktPersonExtended
    : BaseTraktPerson & Partial<TraktPersonExtended>;

type BaseTraktCastMember<P extends 'short' | 'extended' | 'any' = 'short'> = {
  characters: string[];
  person: TraktPerson<P>;
};

export type TraktCastMember<T extends 'episodes' | 'any' | 'short' = 'any', P extends 'short' | 'extended' | 'any' = 'short'> = T extends 'episodes'
  ? BaseTraktCastMember<P> & { episode_count: number; series_regular?: boolean }
  : T extends 'short'
    ? BaseTraktCastMember<P>
    : BaseTraktCastMember<P> & { episode_count?: number; series_regular?: boolean };

type BaseTraktCrewMember<P extends 'short' | 'extended' | 'any' = 'short'> = {
  jobs: string[];
  person: TraktPerson<P>;
};

export type TraktCrewMember<T extends 'episodes' | 'any' | 'short' = 'any', P extends 'short' | 'extended' | 'any' = 'short'> = T extends 'episodes'
  ? BaseTraktCrewMember<P> & { episode_count: number }
  : T extends 'short'
    ? BaseTraktCrewMember<P>
    : BaseTraktCrewMember<P> & { episode_count?: number };

export type TraktCrew<T extends 'episodes' | 'any' | 'short' = 'any', P extends 'short' | 'extended' | 'any' = 'short'> = Partial<
  Record<TraktPersonJobs | 'created-by', TraktCrewMember<T, P>[]>
>;

type BaseTraktCast<T extends 'episodes' | 'any' | 'short' = 'any', P extends 'short' | 'extended' | 'any' = 'short'> = {
  cast: TraktCastMember<T, P>[];
  crew: TraktCrew<T, P>;
};

type TraktCastExtended<T extends 'episodes' | 'any' | 'short' = 'any', P extends 'short' | 'extended' | 'any' = 'short'> = BaseTraktCast<T, P> & {
  guest_stars: TraktCastMember<T, P>[];
};

export type TraktCast<
  T extends 'guest_stars' | 'short' | 'any' = 'short',
  E extends 'episodes' | 'any' | 'short' = 'any',
  P extends 'short' | 'extended' | 'any' = 'short',
> = T extends 'guest_stars'
  ? TraktCastExtended<E, P>
  : T extends 'short'
    ? BaseTraktCast<E, P>
    : BaseTraktCast<E, P> & Partial<TraktCastExtended<E, P>>;

export type TraktPersonUpdate<P extends 'short' | 'extended' | 'any' = 'any'> = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  person: TraktPerson<P>;
};

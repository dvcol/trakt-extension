import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktShow } from '~/models/trakt-show.model';
import type { TraktUser } from '~/models/trakt-user.model';
import type { ExclusiveUnion } from '~/utils/typescript.utils';

type BaseTraktRecommendation = {
  favorited_by: (TraktUser & { notes: string })[];
};

type TraktRecommendationItem<T extends 'extended' | 'short' | 'any' = 'any'> = {
  movie: TraktMovie<T>;
  show: TraktShow<T>;
};

export type TraktRecommendation<T extends 'movie' | 'show' | 'any' = 'any', I extends 'extended' | 'short' | 'any' = 'any'> = T extends 'movie'
  ? BaseTraktRecommendation & Pick<TraktRecommendationItem<I>, 'movie'>
  : T extends 'show'
    ? BaseTraktRecommendation & Pick<TraktRecommendationItem<I>, 'show'>
    : BaseTraktRecommendation & ExclusiveUnion<TraktRecommendationItem<I>>;

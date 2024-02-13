import type { TmdbEpisodeShort } from '~/models/tmdb/tmdb-episode.model';
import type { TmdbPersonShort } from '~/models/tmdb/tmdb-person.model';
import type { TmdbSeasonShort } from '~/models/tmdb/tmdb-season.model';
import type { TmdbShowShort } from '~/models/tmdb/tmdb-show.model';
import type { RecursiveRecord } from '~/utils/typescript.utils';

export type TmdbCreditSeason = Omit<TmdbSeasonShort, 'vote_average'> & {
  show_id: number;
};

export type TmdbCreditPerson = TmdbPersonShort & {
  original_name: string;
  media_type: string;
};

export type TmdbCreditEpisode = TmdbEpisodeShort & {
  show_id: number;
  episode_type: string;
};

export type TmdbCreditMedia = TmdbShowShort & {
  character: string;
  episodes: TmdbCreditEpisode[];
  seasons: TmdbCreditSeason[];
};

export type TmdbCredit = {
  credit_type: string;
  department: string;
  job: string;
  media: TmdbCreditMedia;
  media_type: string;
  id: string;
  person: TmdbCreditPerson;
};

export type TmdbMovieCreditCast = TmdbPersonShort & {
  original_name: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
};

export type TmdbMovieCreditCrew = TmdbPersonShort & {
  original_name: string;
  credit_id: string;
  department: string;
  job: string;
};

export type TmdbMovieCredit = {
  id: number;
  cast: TmdbMovieCreditCast[];
  crew: TmdbMovieCreditCrew[];
};

type BasePersonCredit = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  credit_id: string;
};

export type TmdbPersonCredit = BasePersonCredit & {
  original_title: string;
  release_date: string;
  title: string;
  video: boolean;
};

export type TmdbCombinedPerson = TmdbPersonCredit & {
  media_type: string;
};

export type TmdbCombinedCast<T extends RecursiveRecord> = {
  character: string;
  order?: number;
} & T;

export type TmdbCombinedCrew<T extends RecursiveRecord> = {
  department: string;
  job: string;
} & T;

export type TmdbCombinedCredit = {
  id: number;
  cast: TmdbCombinedCast<TmdbCombinedPerson>[];
  crew: TmdbCombinedCrew<TmdbCombinedPerson>[];
};

export type TmdbPersonMovieCredits = {
  id: number;
  cast: TmdbCombinedCast<TmdbPersonCredit>[];
  crew: TmdbCombinedCrew<TmdbPersonCredit>[];
};

type TmdbPersonShowCredit = BasePersonCredit & {
  origin_country: string[];
  original_name: string;
  first_air_date: string;
  name: string;
  episode_count: number;
};

export type TmdbPersonShowCredits = {
  id: number;
  cast: TmdbCombinedCast<TmdbPersonShowCredit>[];
  crew: TmdbCombinedCrew<TmdbPersonShowCredit>[];
};

export type TmdbShowAggregateCreditRole = {
  credit_id: string;
  character: string;
  episode_count: number;
};

export type TmdbAggregateCreditCast = TmdbPersonShort & {
  roles: TmdbShowAggregateCreditRole[];
  total_episode_count: number;
  order: number;
};

export type TmdbAggregateCreditJob = {
  credit_id: string;
  job: string;
  episode_count: number;
};

export type TmdbAggregateCreditCrew = TmdbPersonShort & {
  jobs: TmdbAggregateCreditJob[];
  department: string;
  total_episode_count: number;
};

export type TmdbAggregateCredits = {
  id: number;
  cast: TmdbAggregateCreditCast[];
  crew: TmdbAggregateCreditCrew[];
};

export type TmdbShowCreditCast = TmdbPersonShort & {
  original_name: string;
  character: string;
  credit_id: string;
  order: number;
};

export type TmdbShowCreditCrew = TmdbPersonShort & {
  original_name: string;
  credit_id: string;
  department: string;
  job: string;
};

export type TmdbShowCredits = {
  id: number;
  cast: TmdbShowCreditCast[];
  crew: TmdbShowCreditCrew[];
};

export type TmdbEpisodeCredits = {
  id: number;
  cast: TmdbShowCreditCast[];
  crew: TmdbShowCreditCrew[];
  guest_stars: TmdbShowCreditCast[];
};

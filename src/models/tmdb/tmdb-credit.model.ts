import type { TmdbEpisodeShort } from '~/models/tmdb/tmdb-episode.model';
import type { TmdbPersonShort } from '~/models/tmdb/tmdb-person.model';
import type { TmdbSeasonShort } from '~/models/tmdb/tmdb-season.model';
import type { TmdbShowShort } from '~/models/tmdb/tmdb-show.model';

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

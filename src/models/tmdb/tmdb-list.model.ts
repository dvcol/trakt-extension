import type { TmdbUser } from '~/models/tmdb/tmdb-user.model';

type BaseTmdbList = {
  id: number;
  /** The ISO 3166-1 code of the country */
  iso_3166_1: string;
  /** The ISO 639-1 code of the language */
  iso_639_1: string;
  name: string;
  average_rating: number;
  description: string;
  poster_path: string;
  backdrop_path: string;
  public: number;
  revenue: number;
  runtime: string;
  sort_by: number;
};

export type TmdbAccountListV4 = BaseTmdbList & {
  account_object_id: string;
  adult: number;
  /** UTC date when the list was created (YYYY-MM-DD HH:mm:ss UTC) */
  created_at: string;
  featured: number;
  number_of_items: number;
  sort_by: number;
  /** UTC date when the list was updated (YYYY-MM-DD HH:mm:ss UTC) */
  updated_at: string;
};

export type TmdbListV4 = BaseTmdbList & {
  comments: Record<string, string>;
  created_by: TmdbUser;
  item_count: number;
  object_ids: Record<string, string>;
  sort_by: string;
};

export type TmdbListV3 = {
  id: number;
  item_count: number;
  description: string;
  favorite_count: number;
  /** The ISO 639-1 code of the language */
  iso_639_1: string;
  list_type: 'movie' | 'tv';
  name: string;
  poster_path: string;
};

export type TmdbShowListV3 = Omit<TmdbListV3, 'list_type'> & {
  iso_3166_1: string;
};

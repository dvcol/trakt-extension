export type TmdbList = {
  account_object_id: string;
  adult: number;
  average_rating: number;
  backdrop_path: string;
  /** UTC date when the list was created (YYYY-MM-DD HH:mm:ss UTC) */
  created_at: string;
  description: string;
  featured: number;
  id: number;
  /** The ISO 3166-1 code of the country */
  iso_3166_1: string;
  /** The ISO 639-1 code of the language */
  iso_639_1: string;
  name: string;
  number_of_items: number;
  poster_path: string;
  public: number;
  revenue: number;
  runtime: string;
  sort_by: number;
  /** UTC date when the list was updated (YYYY-MM-DD HH:mm:ss UTC) */
  updated_at: string;
};

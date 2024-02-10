export type TmdbDiscoverMovieQuery = {
  /** use in conjunction with region */
  certification: string;
  /** use in conjunction with region */
  'certification.gte': string;
  /** use in conjunction with region */
  'certification.lte': string;
  /** use in conjunction with the certification, certification.gte and certification.lte filters */
  certification_country: string;
  include_adult: boolean;
  include_video: boolean;
  language: string;
  primary_release_year: number;
  'primary_release_date.gte': string;
  'primary_release_date.lte': string;
  region: string;
  'release_date.gte': string;
  'release_date.lte': string;
  /** Default: popularity.desc */
  sort_by:
    | 'original_title.asc'
    | 'original_title.desc'
    | 'popularity.asc'
    | 'popularity.desc'
    | 'revenue.asc'
    | 'revenue.desc'
    | 'primary_release_date.asc'
    | 'title.asc'
    | 'title.desc'
    | 'primary_release_date.desc'
    | 'vote_average.asc'
    | 'vote_average.desc'
    | 'vote_count.asc'
    | 'vote_count.desc';
  'vote_average.gte': number;
  'vote_average.lte': number;
  'vote_count.gte': number;
  'vote_count.lte': number;
  watch_region: string;
  /** can be a comma (AND) or pipe (OR) separated query */
  with_cast: string;
  /** can be a comma (AND) or pipe (OR) separated query */
  with_companies: string;
  /** can be a comma (AND) or pipe (OR) separated query */
  with_crew: string;
  /** can be a comma (AND) or pipe (OR) separated query */
  with_genres: string;
  /** can be a comma (AND) or pipe (OR) separated query */
  with_keywords: string;
  with_origin_country: string;
  with_original_language: string;
  /** can be a comma (AND) or pipe (OR) separated query */
  with_people: string;
  /** possible values are: [1, 2, 3, 4, 5, 6] can be a comma (AND) or pipe (OR) separated query, can be used in conjunction with region */
  with_release_type: string;
  'with_runtime.gte': number;
  'with_runtime.lte': number;
  /** possible values are: [flatrate, free, ads, rent, buy] use in conjunction with watch_region, can be a comma (AND) or pipe (OR) separated query */
  with_watch_monetization_types: string;
  /** use in conjunction with watch_region, can be a comma (AND) or pipe (OR) separated query */
  with_watch_providers: string;
  without_companies: string;
  without_genres: string;
  without_keywords: string;
  without_watch_providers: string;
  year: number;
};

export type TmdbDiscoverTvQuery = {
  'air_date.gte': string;
  'air_date.lte': string;
  first_air_date_year: number;
  'first_air_date.gte': string;
  'first_air_date.lte': string;
  include_adult: boolean;
  include_null_first_air_dates: boolean;
  language: string;
  screened_theatrically: boolean;
  /** Default: popularity.desc */
  sort_by:
    | 'first_air_date.asc'
    | 'first_air_date.desc'
    | 'name.asc'
    | 'name.desc'
    | 'original_name.asc'
    | 'original_name.desc'
    | 'popularity.asc'
    | 'popularity.desc'
    | 'vote_average.asc'
    | 'vote_average.desc'
    | 'vote_count.asc'
    | 'vote_count.desc';
  timezone: string;
  'vote_average.gte': number;
  'vote_average.lte': number;
  'vote_count.gte': number;
  'vote_count.lte': number;
  watch_region: string;
  /** can be a comma (AND) or pipe (OR) separated query */
  with_companies: string;
  /** can be a comma (AND) or pipe (OR) separated query */
  with_genres: string;
  /** can be a comma (AND) or pipe (OR) separated query */
  with_keywords: string;
  with_networks: string;
  with_origin_country: string;
  with_original_language: string;
  'with_runtime.gte': number;
  'with_runtime.lte': number;
  /** possible values are: [0, 1, 2, 3, 4, 5], can be a comma (AND) or pipe (OR) separated query */
  with_status: string;
  /** possible values are: [flatrate, free, ads, rent, buy] use in conjunction with watch_region, can be a comma (AND) or pipe (OR) separated query */
  with_watch_monetization_types: string;
  /** use in conjunction with watch_region, can be a comma (AND) or pipe (OR) separated query */
  with_watch_providers: string;
  without_companies: string;
  without_genres: string;
  without_keywords: string;
  without_watch_providers: string;
  /** possible values are: [0, 1, 2, 3, 4, 5, 6], can be a comma (AND) or pipe (OR) separated query */
  with_type: string;
};

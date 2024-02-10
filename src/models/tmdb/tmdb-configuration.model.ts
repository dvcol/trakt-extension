export type TmdbConfiguration = {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
  change_keys: string[];
};

export type TmdbConfigurationCounty = {
  /** The ISO 3166-1 code of the country */
  iso_3166_1: string;
  english_name: string;
  native_name: string;
};

export type TmdbConfigurationJobs = {
  department: string;
  jobs: string[];
};

export type TmdbConfigurationTimezones = {
  /** The ISO 3166-1 code of the country */
  iso_3166_1: string;
  zones: string[];
};

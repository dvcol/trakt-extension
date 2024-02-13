export type TmdbProvider = {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
};

export type TmdbProviders = {
  id: number;
  results: Record<
    string,
    {
      link: string;
      flatrate: TmdbProvider[];
      rent: TmdbProvider[];
      buy: TmdbProvider[];
    }
  >;
};

export type TmdbProviderExtended = TmdbProvider & {
  display_priorities: Record<string, number>;
};

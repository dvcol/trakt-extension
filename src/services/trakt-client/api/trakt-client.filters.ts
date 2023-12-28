export const TraktApiFilter = {
  Query: 'query',
  Years: 'years',
  Genres: 'genres',
  Languages: 'languages',
  Countries: 'countries',
  Runtimes: 'runtimes',
  Ratings: 'ratings',
  Certifications: 'certifications',
  Networks: 'networks',
  Status: 'status',
} as const;

export const TraktApiFilterValues = Object.values(TraktApiFilter);

export type TraktApiFilters = keyof typeof TraktApiFilter;

export const ExternaLinks = {
  trakt: {
    production: 'https://trakt.tv/',
    staging: 'https://staging.trakt.tv/',
  },
  tmdb: 'https://www.themoviedb.org/',
  imdb: 'https://www.imdb.com/',
  tvdb: 'https://thetvdb.com/',
  omdb: 'https://www.omdbapi.com/',
  fanart: 'https://fanart.tv/',
  justwatch: 'https://www.justwatch.com/',
  rottenTomatoes: 'https://www.rottentomatoes.com/',
  metacritic: 'https://www.metacritic.com/',
  wikipedia: 'https://www.wikipedia.org/',
  facebook: 'https://www.facebook.com/',
  twitter: 'https://twitter.com/',
  instagram: 'https://www.instagram.com/',
  youtube: 'https://www.youtube.com/',
  reddit: 'https://www.reddit.com/',
  discord: 'https://discord.com/',
} as const;

export const ResolveExternalLinks = {
  trakt: ({
    type,
    slug,
    season,
    episode,
    base = ExternaLinks.trakt.production,
  }: {
    type: 'movies' | 'shows' | 'season' | 'episode' | 'person' | 'comment' | 'list';
    slug: string;
    season?: number;
    episode?: number;
    base?: string;
  }) => {
    if (type === 'episode') return `${base}shows/${slug}/seasons/${season}/episodes/${episode}`;
    if (type === 'season') return `${base}shows/${slug}/seasons/${season}`;
    return `${base}${type}/${slug}`;
  },
  search: ({
    id,
    type,
    source,
    base = ExternaLinks.trakt.production,
  }: {
    id: string | number;
    type?: 'movie' | 'show' | 'season' | 'episode' | 'person';
    source: 'trakt' | 'imdb' | 'tmdb' | 'tvdb';
    base?: string;
  }) => `${base}search/${source}/${id}${type ? `?id_type=${type}` : ''}`,
};

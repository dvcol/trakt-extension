export const ExternaLinks = {
  trakt: {
    production: 'https://trakt.tv/',
    staging: 'https://staging.trakt.tv/',
    onDeck: 'https://trakt.tv/dashboard/on_deck',
    signOut: 'https://trakt.tv/auth/signout',
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
  github: 'https://github.com/dvcol/trakt-extension',
  donate: 'https://paypal.me/dvcol/5',
  support: 'https://github.com/dvcol/trakt-extension/issues',
  store: 'https://chrome.google.com/webstore/detail/pdodapikbijcfickiofjkjgkkmlcnbba',
  privacy: 'https://github.com/dvcol/trakt-extension/blob/main/PRIVACY.md',
  release: 'https://github.com/dvcol/trakt-extension/releases',
} as const;

export const ResolveExternalLinks = {
  release: (version: string) => `${ExternaLinks.github}/releases/tag/v${version}`,
  trakt: {
    item: ({
      type,
      slug,
      season,
      episode,
      base = ExternaLinks.trakt.production,
      suffix,
    }: {
      type: 'movies' | 'shows' | 'season' | 'episode' | 'person' | 'comment' | 'list';
      slug: string;
      season?: number;
      episode?: number;
      base?: string;
      suffix?: string;
    }) => {
      if (type === 'episode') return `${base}shows/${slug}/seasons/${season}/episodes/${episode}${suffix ?? ''}`;
      if (type === 'season') return `${base}shows/${slug}/seasons/${season}${suffix ?? ''}`;
      return `${base}${type}/${slug}${suffix ?? ''}`;
    },
    query: (query: string) => `${ExternaLinks.trakt.production}search?query=${query}`,
    watchlist: (user: string) => `${ExternaLinks.trakt.production}users/${user}/watchlist`,
    favorites: (user: string) => `${ExternaLinks.trakt.production}users/${user}/favorites`,
    list: (user: string, list: string) => `${ExternaLinks.trakt.production}users/${user}/lists/${list}`,
    collection: (user: string, type?: 'movies' | 'shows' | 'episodes') => {
      const url = `${ExternaLinks.trakt.production}users/${user}/collection`;
      if (type) return `${url}/${type}`;
      return url;
    },
    history: ({ user, start, end }: { user: string; start?: string; end?: string }) => {
      let url = `${ExternaLinks.trakt.production}users/${user}/history`;
      if (start) url += `?start_at=${start}`;
      if (end) url += `${start ? '&' : '?'}end_at=${end}`;
      return url;
    },
    calendar: (date?: string) => `${ExternaLinks.trakt.production}calendars/my/shows-movies/${date ?? ''}`,
    account: (user: string) => `${ExternaLinks.trakt.production}users/${user}`,
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
  imdb: (id: string | number) => {
    if (id.toString().startsWith('tt')) return `${ExternaLinks.imdb}title/${id}`;
    if (id.toString().startsWith('nm')) return `${ExternaLinks.imdb}name/${id}`;
  },
  tmdb: ({
    id,
    season,
    episode,
    type,
  }: {
    id: string | number;
    season?: string | number;
    episode?: string | number;
    type: 'movie' | 'show' | 'season' | 'episode' | 'person';
  }) => {
    if (type === 'person') return `${ExternaLinks.tmdb}person/${id}`;
    if (type === 'movie') return `${ExternaLinks.tmdb}movie/${id}`;
    if (type === 'show') return `${ExternaLinks.tmdb}tv/${id}`;
    if (type === 'season') return `${ExternaLinks.tmdb}tv/${id}/season/${season}`;
    if (type === 'episode') return `${ExternaLinks.tmdb}tv/${id}/season/${season}/episode/${episode}`;
  },
  tvdb: (id: string | number, type: 'movie' | 'show' | 'season' | 'episode' | 'person') => {
    if (type === 'person') return `${ExternaLinks.tvdb}dereferrer/people/${id}`;
    if (type === 'movie') return `${ExternaLinks.tvdb}dereferrer/movies/${id}`;
    if (type === 'show') return `${ExternaLinks.tvdb}dereferrer/series/${id}`;
    if (type === 'season') return `${ExternaLinks.tvdb}dereferrer/season/${id}`;
    if (type === 'episode') return `${ExternaLinks.tvdb}dereferrer/episode/${id}`;
  },
  facebook: (id: string) => `${ExternaLinks.facebook}${id}`,
  twitter: (id: string) => `${ExternaLinks.twitter}${id}`,
  instagram: (id: string) => `${ExternaLinks.instagram}${id}`,
  wikipedia: (id: string) => `${ExternaLinks.wikipedia}wiki/${id}`,
};

export const TraktShowStatus = {
  /** Airing right now */
  ReturningSeries: 'returning series',
  /** Airing right now */
  Continuing: 'continuing',
  /** Airing soon */
  InProduction: 'in production',
  /** In development */
  Planned: 'planned',
  /** In development */
  Upcoming: 'upcoming',
  Pilot: 'pilot',
  Canceled: 'canceled',
  Ended: 'ended',
};

export type TraktShowStatuses = (typeof TraktShowStatus)[keyof typeof TraktShowStatus];
export const TraktShowStatusValues = Object.values(TraktShowStatus);

export type TraktShow = {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    tvdb: number;
    imdb: string;
    tmdb: number;
  };
};

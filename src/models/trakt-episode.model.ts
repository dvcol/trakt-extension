export const TraktEpisodeType = {
  Standard: 'standard',
  SeriesPremiere: 'series_premiere',
  SeasonPremiere: 'season_premiere',
  MidSeasonFinale: 'mid_season_finale',
  MidSeasonPremiere: 'mid_season_premiere',
  SeasonFinale: 'season_finale',
  SeriesFinale: 'series_finale',
};

export type TraktEpisodeTypes = (typeof TraktEpisodeType)[keyof typeof TraktEpisodeType];
export const TraktEpisodeTypeValues = Object.values(TraktEpisodeType);

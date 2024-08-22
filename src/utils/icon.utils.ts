import type { Component } from 'vue';

import IconIMDb from '~/components/icons/IconIMDb.vue';
import IconMyAnimeList from '~/components/icons/IconMyAnimeList.vue';
import IconSimkl from '~/components/icons/IconSimkl.vue';
import IconStarFilledHalf from '~/components/icons/IconStarFilledHalf.vue';
import IconTMDb from '~/components/icons/IconTMDb.vue';
import IconTrakt from '~/components/icons/IconTrakt.vue';

export const DataSource = {
  Trakt: 'trakt',
  Tmdb: 'tmdb',
  Imdb: 'imdb',
  Simkl: 'simkl',
  Mal: 'mal',
} as const;

export type DataSources = (typeof DataSource)[keyof typeof DataSource];

export const getIconFromSource = (source: DataSources | string): Component => {
  switch (source) {
    case DataSource.Trakt:
      return IconTrakt;
    case DataSource.Tmdb:
      return IconTMDb;
    case DataSource.Imdb:
      return IconIMDb;
    case DataSource.Simkl:
      return IconSimkl;
    case DataSource.Mal:
      return IconMyAnimeList;
    default:
      return IconStarFilledHalf;
  }
};

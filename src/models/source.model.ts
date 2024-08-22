import type { Component } from 'vue';

import IconIMDb from '~/components/icons/IconIMDb.vue';
import IconMyAnimeList from '~/components/icons/IconMyAnimeList.vue';
import IconSimkl from '~/components/icons/IconSimkl.vue';
import IconStarFilledHalf from '~/components/icons/IconStarFilledHalf.vue';
import IconTMDb from '~/components/icons/IconTMDb.vue';
import IconTVDb from '~/components/icons/IconTVDb.vue';
import IconTrakt from '~/components/icons/IconTrakt.vue';
import { ResolveExternalLinks } from '~/settings/external.links';

export const DataSource = {
  Trakt: 'trakt',
  Tmdb: 'tmdb',
  Imdb: 'imdb',
  Tvdb: 'tvdb',
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
    case DataSource.Tvdb:
      return IconTVDb;
    case DataSource.Simkl:
      return IconSimkl;
    case DataSource.Mal:
      return IconMyAnimeList;
    default:
      return IconStarFilledHalf;
  }
};

export const getUrlFromSource = (
  source: DataSources | string,
  ids?: Record<DataSources | string, number | string>,
  metadata: {
    season?: string | number;
    episode?: string | number;
    type?: 'movie' | 'show' | 'season' | 'episode' | 'person' | 'anime';
  } = {},
): string | undefined => {
  if (!ids) return undefined;
  switch (source) {
    case DataSource.Mal:
      if (!ids[source]) return undefined;
      return ResolveExternalLinks.mal(ids[source]);
    case DataSource.Tmdb:
      if (!metadata.type || !ids[source]) return undefined;
      return ResolveExternalLinks.tmdb({ id: ids[source], type: metadata.type, ...metadata });
    case DataSource.Tvdb:
      if (!metadata.type || !ids[source]) return undefined;
      return ResolveExternalLinks.tvdb(ids[source], metadata.type);
    case DataSource.Imdb:
      if (!ids[source]) return undefined;
      return ResolveExternalLinks.imdb(ids[source]);
    case DataSource.Simkl:
      if (!metadata.type || !ids[source]) return undefined;
      return ResolveExternalLinks.simkl.item(ids[source], metadata.type);
    default:
      return undefined;
  }
};

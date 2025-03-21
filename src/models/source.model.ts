import type { Component } from 'vue';

import type { I18nFunction } from '~/models/i18n.model';

import type { Brands } from '~/stores/settings/extension.store';

import IconExternalLinkRounded from '~/components/icons/IconExternalLinkRounded.vue';
import IconIMDb from '~/components/icons/IconIMDb.vue';
import IconMeta from '~/components/icons/IconMeta.vue';
import IconMyAnimeList from '~/components/icons/IconMyAnimeList.vue';
import IconRT from '~/components/icons/IconRT.vue';
import IconSimkl from '~/components/icons/IconSimkl.vue';
import IconTMDb from '~/components/icons/IconTMDb.vue';
import IconTVDb from '~/components/icons/IconTVDb.vue';
import IconTrakt from '~/components/icons/IconTrakt.vue';
import IconTraktNew from '~/components/icons/IconTraktNew.vue';
import { ResolveExternalLinks } from '~/settings/external.links';
import { Brand } from '~/stores/settings/extension.store';

export const DataSource = {
  Trakt: 'trakt',
  Tmdb: 'tmdb',
  Imdb: 'imdb',
  Tvdb: 'tvdb',
  Simkl: 'simkl',
  Mal: 'mal',
  RottenTomatoes: 'rotten_tomatoes',
  Metascore: 'metascore',
} as const;

export type DataSources = (typeof DataSource)[keyof typeof DataSource];

export const AllDataSources: string[] = Object.values(DataSource);
export const isKnownSource = (source: string): source is DataSources => AllDataSources.includes(source);

export const getIconFromSource = (source: DataSources | string, brand?: Brands, fallback: Component = IconExternalLinkRounded): Component => {
  switch (source) {
    case DataSource.Trakt:
      return brand === Brand.New ? IconTraktNew : IconTrakt;
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
    case DataSource.RottenTomatoes:
      return IconRT;
    case DataSource.Metascore:
      return IconMeta;
    default:
      return fallback;
  }
};

export const sortSources = (a: DataSources | string, b: DataSources | string): number => {
  if (a.toLowerCase() === DataSource.Trakt) return -1;
  if (b.toLowerCase() === DataSource.Trakt) return 1;
  return a.localeCompare(b);
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
    case DataSource.Trakt:
      if (!ids[source]) return undefined;
      return ResolveExternalLinks.search({ id: ids[source], source, type: metadata.type === 'anime' ? 'show' : metadata.type });
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
    case DataSource.Mal:
      if (!ids[source]) return undefined;
      return ResolveExternalLinks.mal(ids[source]);
    default:
      return undefined;
  }
};

export const normalizeSource = (source: DataSources | string, rating: number): number => {
  switch (source) {
    case DataSource.RottenTomatoes:
      return rating / 10;
    case DataSource.Metascore:
      return rating / 10;
    default:
      return rating;
  }
};

export const getLabelKeyFromSource = (
  i18n: I18nFunction,
  source: DataSources | string,
  type?: 'movie' | 'show' | 'season' | 'episode' | 'person' | 'anime',
) => {
  const label = type ? `open_${type}_in` : 'open_in';
  const _source = isKnownSource(source) ? i18n(source, 'common', 'source', 'name') : source;
  return i18n({ key: label, substitutions: [_source] }, 'common', 'tooltip');
};

export const getSortedDataSources = ({ trakt, tmdb, imdb, tvdb, simkl, mal, ...rest }: Record<DataSources | string, number | string>) => {
  const _sources = [];
  if (trakt) _sources.push(DataSource.Trakt);
  if (imdb) _sources.push(DataSource.Imdb);
  if (tmdb) _sources.push(DataSource.Tmdb);
  if (tvdb) _sources.push(DataSource.Tvdb);
  if (simkl) _sources.push(DataSource.Simkl);
  if (mal) _sources.push(DataSource.Mal);
  if (rest) _sources.push(...Object.keys(rest).sort());
  return _sources;
};

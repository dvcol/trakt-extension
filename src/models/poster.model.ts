import type { TmdbImage } from '@dvcol/tmdb-http-client/models';
import type { Ref } from 'vue';
import type { ImageQuery, ImageStoreMedias, ImageStoreTypes } from '~/stores/data/image.store';

export type PosterItem = {
  id: string | number;
  key: string;
  type: ImageStoreTypes;

  poster?: string;
  posterRef?: Ref<ImageStoreMedias | undefined>;
  getPosterQuery?: () => ImageQuery | undefined;
};

export type ImagePayload = {
  posters?: TmdbImage[]; // movie, show, season
  backdrops?: TmdbImage[]; // movie or shows
  stills?: TmdbImage[]; // episodes
  profiles?: TmdbImage[]; // profiles
};

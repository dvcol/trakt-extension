import type { Ref } from 'vue';
import type { ImageQuery, ImageStoreMedias, ImageStoreTypes } from '~/stores/data/image.store';

export type PosterItem = {
  type?: ImageStoreTypes;

  poster?: string;
  posterRef?: Ref<ImageStoreMedias | undefined>;
  getPosterQuery?: () => ImageQuery | undefined;
};

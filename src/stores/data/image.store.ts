import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, ref } from 'vue';

import type { TmdbConfiguration } from '~/models/tmdb/tmdb-configuration.model';

import type { TmdbImage } from '~/models/tmdb/tmdb-image.model';

import { TraktService } from '~/services/trakt.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';
import { arrayMax } from '~/utils/math.utils';

type ImageStore = {
  movie: Record<string, string>;
  show: Record<string, string>;
  season: Record<string, string>;
  episode: Record<string, string>;
  person: Record<string, string>;
};

export type ImageQuery = {
  id: number;
  season?: number;
  episode?: number;
  type: keyof ImageStore;
};

type ImagePayload = { posters?: TmdbImage[]; stills?: TmdbImage[]; profiles?: TmdbImage[] };

const EmptyImageStore: ImageStore = {
  movie: {},
  show: {},
  season: {},
  episode: {},
  person: {},
};

export const useImageStore = defineStore('data.image', () => {
  const tmdbConfig = ref<TmdbConfiguration>();
  const images = reactive<ImageStore>(EmptyImageStore);

  const syncSaveImageStore = debounce(
    (_images = images) =>
      Promise.all([
        storage.sync.set(`data.image-store.movie`, _images.movie),
        storage.sync.set(`data.image-store.show`, _images.show),
        storage.sync.set(`data.image-store.season`, _images.season),
        storage.sync.set(`data.image-store.episode`, _images.episode),
        storage.sync.set(`data.image-store.person`, _images.person),
      ]),
    1000,
  );

  const syncRestoreImageStore = async (seed?: Partial<ImageStore>) => {
    const [movie, show, season, episode, person] = await Promise.all([
      storage.sync.get<Record<string, string>>(`data.image-store.movie`),
      storage.sync.get<Record<string, string>>(`data.image-store.show`),
      storage.sync.get<Record<string, string>>(`data.image-store.season`),
      storage.sync.get<Record<string, string>>(`data.image-store.episode`),
      storage.sync.get<Record<string, string>>(`data.image-store.person`),
    ]);
    if (seed) Object.assign(images, seed);
    if (movie) Object.assign(images.movie, movie);
    if (show) Object.assign(images.show, show);
    if (season) Object.assign(images.season, season);
    if (episode) Object.assign(images.episode, episode);
    if (person) Object.assign(images.person, person);

    console.info('Restored Image Store', images);
  };

  const initImageStore = async (config?: TmdbConfiguration) => {
    if (!config) config = await TraktService.tmdbConfiguration();
    tmdbConfig.value = config;
    return syncRestoreImageStore();
  };

  const imageSizes = computed(() => ({
    poster: tmdbConfig.value?.images?.poster_sizes,
    still: tmdbConfig.value?.images?.still_sizes,
  }));

  const queue: Record<string, Promise<ImagePayload>> = {};

  const queueRequest = async (key: string, request: () => Promise<ImagePayload>) => {
    if (!(key in queue)) queue[key] = request();
    return queue[key];
  };

  const fetchImageUrl = async (key: string, { id, season, episode, type }: ImageQuery) => {
    let payload: ImagePayload;
    if (type === 'movie') {
      payload = await queueRequest(`${type}-${id}`, () => TraktService.posters.movie(id));
    } else if (type === 'person') {
      payload = await queueRequest(`${type}-${id}`, () => TraktService.posters.person(id));
    } else if (type === 'episode' && season && episode) {
      payload = await queueRequest(`${type}-${id}-${season}-${episode}`, () => TraktService.posters.episode(id, season, episode));
    } else if (type === 'season' && season) {
      payload = await queueRequest(`${type}-${id}-${season}`, () => TraktService.posters.season(id, season));
    } else if (['show', 'episode', 'season'].includes(type)) {
      payload = await queueRequest(`${type}-${id}`, () => TraktService.posters.show(id));
    } else throw new Error('Unsupported type or missing parameters for fetchImageUrl');

    const fetchedImages = payload.posters ?? payload.stills ?? payload.profiles;
    if (!fetchedImages?.length) {
      console.warn('No images found for', { id, season, episode, type });
      return;
    }
    const image = arrayMax(fetchedImages, 'vote_average', i => !!i.file_path)?.file_path;
    if (!image) return;
    images[type][key] = image;
    await syncSaveImageStore();
  };

  const getImageUrl = ({ id, season, episode, type }: ImageQuery, size: string = 'original') => {
    if (!tmdbConfig.value) throw new Error('TmdbConfiguration not initialized');
    const key = [id, season, episode].filter(Boolean).join('-');
    const imageRef = computed(() => images[type][key]);
    if (!imageRef.value) fetchImageUrl(key, { id, season, episode, type }).catch(console.error);

    return computed(() => {
      if (!imageRef.value) return;
      if (!tmdbConfig.value?.images?.secure_base_url) return;
      return `${tmdbConfig.value.images.secure_base_url}${size}${imageRef.value}`;
    });
  };

  return { initImageStore, getImageUrl, imageSizes };
});

export const useImageStoreRefs = () => storeToRefs(useImageStore());
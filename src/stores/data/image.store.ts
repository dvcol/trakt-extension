import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, type Ref, ref } from 'vue';

import type { TmdbConfiguration } from '~/models/tmdb/tmdb-configuration.model';

import type { TmdbImage } from '~/models/tmdb/tmdb-image.model';

import { TraktService } from '~/services/trakt.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';
import { arrayMax, findClosestMatch } from '~/utils/math.utils';

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

type ImagePayload = {
  posters?: TmdbImage[];
  stills?: TmdbImage[];
  profiles?: TmdbImage[];
};

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

  const getKeyAndType = ({ id, season, episode, type }: ImageQuery): { key: string; type: ImageQuery['type'] } => {
    if (type === 'episode' && season && episode) return { key: `${type}-${id}-${season}-${episode}`, type };
    if (['episode', 'season'].includes(type) && season) return { key: `${type}-${id}-${season}`, type: 'season' };
    if (['episode', 'season', 'show'].includes(type)) return { key: `${type}-${id}`, type: 'show' };
    return { key: `${type}-${id}`, type };
  };

  const fetchImageUrl = async (
    key: string,
    { id, season, episode, type }: ImageQuery,
  ): Promise<{ image: string; key: string; type: ImageQuery['type'] } | undefined> => {
    let payload: ImagePayload;
    if (type === 'movie') {
      payload = await queueRequest(key, () => TraktService.posters.movie(id));
    } else if (type === 'person') {
      payload = await queueRequest(key, () => TraktService.posters.person(id));
    } else if (type === 'episode' && season && episode) {
      payload = await queueRequest(key, () => TraktService.posters.episode(id, season, episode));
    } else if (type === 'season' && season) {
      payload = await queueRequest(key, () => TraktService.posters.season(id, season));
    } else if (type === 'show') {
      payload = await queueRequest(key, () => TraktService.posters.show(id));
    } else throw new Error('Unsupported type or missing parameters for fetchImageUrl');

    const fetchedImages = payload.posters ?? payload.stills ?? payload.profiles;
    if (!fetchedImages?.length) {
      if (type === 'episode') {
        const eType = 'season';
        const eKey = `${eType}-${id}-${season}`;
        if (images[eType][eKey]) return { image: images[eType][eKey], key: eKey, type: eType };
        return fetchImageUrl(eKey, { id, season, type: eType });
      }
      if (type === 'season') {
        const sType = 'show';
        const sKey = `${sType}-${id}`;
        if (images[sType][sKey]) return { image: images[sType][sKey], key: sKey, type: sType };
        return fetchImageUrl(sKey, { id, type: sType });
      }
      return;
    }
    const image = arrayMax(fetchedImages, 'vote_average', i => !!i.file_path)?.file_path;
    if (!image) return;
    images[type][key] = image;
    syncSaveImageStore().catch(err => console.error('Failed to save image store', err));
    return { image, key, type };
  };

  const getImageSize = (type: ImageQuery['type'], size: number) => {
    if (type === 'person') return findClosestMatch(size, imageSizes.value.poster);
    if (type === 'episode') return findClosestMatch(size, imageSizes.value.still);
    return findClosestMatch(size, imageSizes.value.poster);
  };

  const getImageUrl = async (query: ImageQuery, size: number, response: Ref<string | undefined> = ref()) => {
    if (!tmdbConfig.value) throw new Error('TmdbConfiguration not initialized');
    if (!tmdbConfig.value?.images?.secure_base_url) throw new Error('TmdbConfiguration missing secure_base_url');

    const { key, type } = getKeyAndType(query);

    const baseUrl = tmdbConfig.value.images.secure_base_url;

    if (images[type][key]) {
      response.value = `${baseUrl}${getImageSize(type, size)}${images[type][key]}`;
      return response;
    }

    const image = await fetchImageUrl(key, query);
    if (!image) return response;
    response.value = `${baseUrl}${getImageSize(image.type, size)}${image.image}`;

    return response;
  };

  return { initImageStore, getImageUrl, imageSizes };
});

export const useImageStoreRefs = () => storeToRefs(useImageStore());

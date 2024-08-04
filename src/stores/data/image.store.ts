import { arrayMax, findClosestMatch } from '@dvcol/common-utils/common/math';
import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, type Ref, ref } from 'vue';

import type { TmdbConfiguration, TmdbImage } from '@dvcol/tmdb-http-client/models';

import type { ImagePayload } from '~/models/poster.model';

import { ErrorService } from '~/services/error.service';
import { Logger } from '~/services/logger.service';
import { TraktService } from '~/services/trakt.service';
import { setStorageWrapper, storage } from '~/utils/browser/browser-storage.utils';
import { getShortLocale } from '~/utils/browser/browser.utils';
import { CachePrefix } from '~/utils/cache.utils';
import { debounce } from '~/utils/debounce.utils';
import { ErrorCount, type ErrorDictionary } from '~/utils/retry.utils';
import { clearProxy } from '~/utils/vue.utils';

type ImageStoreMedia = {
  poster?: string;
  backdrop?: string;
};

type ImageStore = {
  movie: Record<string, ImageStoreMedia>;
  show: Record<string, ImageStoreMedia>;
  season: Record<string, string>;
  episode: Record<string, string>;
  person: Record<string, string>;
};

type ImageStoreErrors = {
  movie: ErrorDictionary;
  show: ErrorDictionary;
  season: ErrorDictionary;
  episode: ErrorDictionary;
  person: ErrorDictionary;
};

const ImageStoreConstants = {
  Store: 'data.image',
  LocalMovie: `data.image-store.movie`,
  LocalShow: `data.image-store.show`,
  LocalSeason: `data.image-store.season`,
  LocalEpisode: `data.image-store.episode`,
  LocalPerson: `data.image-store.person`,
} as const;

export type ImageStoreTypes = keyof ImageStore;

export type ImageStoreMedias = ImageStoreMedia | string;

export type ImageQuery = {
  id: string | number;
  season?: number;
  episode?: number;
  type: ImageStoreTypes;
};

const emptyImageStore = {
  movie: {},
  show: {},
  season: {},
  episode: {},
  person: {},
};

const localArrayMax = (
  array: Array<TmdbImage>,
  prop: keyof TmdbImage = 'vote_average',
  filter: (item: TmdbImage) => boolean = i => !!i.file_path,
) => {
  const lang = getShortLocale();

  const localArray = array.filter(i => i.iso_639_1 === lang);
  if (localArray.length) return arrayMax(localArray, prop, filter);

  if (lang !== 'en') {
    const enArray = array.filter(i => i.iso_639_1 === 'en');
    if (enArray.length) return arrayMax(enArray, prop, filter);
  }

  return arrayMax(array, prop, filter);
};

export const useImageStore = defineStore(ImageStoreConstants.Store, () => {
  const tmdbConfig = ref<TmdbConfiguration>();
  const images = reactive<ImageStore>(emptyImageStore);

  const imageErrors = reactive<Partial<ImageStoreErrors>>({});
  ErrorService.registerDictionary('image', imageErrors);

  const saveState = debounce(
    (_images = images) =>
      Promise.all([
        setStorageWrapper(ImageStoreConstants.LocalMovie, _images.movie, CachePrefix.Tmdb),
        setStorageWrapper(ImageStoreConstants.LocalShow, _images.show, CachePrefix.Tmdb),
        setStorageWrapper(ImageStoreConstants.LocalSeason, _images.season, CachePrefix.Tmdb),
        setStorageWrapper(ImageStoreConstants.LocalEpisode, _images.episode, CachePrefix.Tmdb),
        setStorageWrapper(ImageStoreConstants.LocalPerson, _images.person, CachePrefix.Tmdb),
      ]),
    1000,
  );

  const restoreState = async (seed?: Partial<ImageStore>) => {
    const [movie, show, season, episode, person] = await Promise.all([
      storage.local.get<Record<string, string>>(ImageStoreConstants.LocalMovie),
      storage.local.get<Record<string, string>>(ImageStoreConstants.LocalShow),
      storage.local.get<Record<string, string>>(ImageStoreConstants.LocalSeason),
      storage.local.get<Record<string, string>>(ImageStoreConstants.LocalEpisode),
      storage.local.get<Record<string, string>>(ImageStoreConstants.LocalPerson),
    ]);
    if (seed) Object.assign(images, seed);
    if (movie) Object.assign(images.movie, movie);
    if (show) Object.assign(images.show, show);
    if (season) Object.assign(images.season, season);
    if (episode) Object.assign(images.episode, episode);
    if (person) Object.assign(images.person, person);
  };

  const clearState = async () => {
    clearProxy(images.movie);
    clearProxy(images.show);
    clearProxy(images.season);
    clearProxy(images.episode);
    clearProxy(images.person);
    clearProxy(imageErrors);
    return saveState().catch(err => Logger.error('Failed to save image store', err));
  };

  const initImageStore = async (config?: TmdbConfiguration) => {
    if (!config) config = await TraktService.tmdbConfiguration();
    tmdbConfig.value = config;
    return restoreState();
  };

  const imageSizes = computed(() => ({
    poster: tmdbConfig.value?.images?.poster_sizes,
    still: tmdbConfig.value?.images?.still_sizes,
  }));

  const queue: Record<string, Promise<ImagePayload>> = {};

  const queueRequest = async ({ key, type }: { key: string; type: ImageQuery['type'] }, request: () => Promise<ImagePayload>) => {
    try {
      if (!(key in queue)) queue[key] = request();
      const response = await queue[key];
      delete imageErrors[type]?.[key];
      return response;
    } catch (error) {
      Logger.error('Failed to queue image request', { key, type });
      if (!imageErrors[type]) imageErrors[type] = {};
      imageErrors[type]![key] = ErrorCount.fromDictionary(imageErrors[type]!, key, error);
      throw error;
    }
  };

  const getKeyAndType = ({ id, season, episode, type }: ImageQuery): { key: string; type: ImageQuery['type'] } => {
    if (type === 'episode' && season !== undefined && episode !== undefined) return { key: `${type}-${id}-${season}-${episode}`, type };
    if (['episode', 'season'].includes(type) && season !== undefined) return { key: `${type}-${id}-${season}`, type: 'season' };
    if (['episode', 'season', 'show'].includes(type)) return { key: `${type}-${id}`, type: 'show' };
    return { key: `${type}-${id}`, type };
  };

  const fetchImageUrl = async (
    key: string,
    { id, season, episode, type }: ImageQuery,
  ): Promise<{ image: ImageStoreMedias; key: string; type: ImageQuery['type'] } | undefined> => {
    let payload: ImagePayload;
    if (type === 'movie') {
      payload = await queueRequest({ key, type }, () => TraktService.posters.movie(id));
    } else if (type === 'person') {
      payload = await queueRequest({ key, type }, () => TraktService.posters.person(id));
    } else if (type === 'episode' && season !== undefined && episode !== undefined) {
      payload = await queueRequest({ key, type }, () => TraktService.posters.episode(id, season, episode));
    } else if (type === 'season' && season !== undefined) {
      payload = await queueRequest({ key, type }, () => TraktService.posters.season(id, season));
    } else if (type === 'show') {
      payload = await queueRequest({ key, type }, () => TraktService.posters.show(id));
    } else {
      Logger.error('Unsupported type or missing parameters for fetchImageUrl', { key, id, season, episode, type });
      throw new Error('Unsupported type or missing parameters for fetchImageUrl');
    }

    if ((type === 'episode' && !payload.stills?.length) || (type === 'season' && !payload.posters?.length)) {
      const sType = 'show';
      const sKey = `${sType}-${id}`;
      if (images[sType][sKey]) return { image: images[sType][sKey], key: sKey, type: sType };
      return fetchImageUrl(sKey, { id, type: sType });
    }

    if (['movie', 'show'].includes(type)) {
      if (!payload.backdrops?.length && !payload.posters?.length) return;
      const image = {
        poster: localArrayMax(payload.posters ?? [], 'vote_average', i => !!i.file_path)?.file_path,
        backdrop: localArrayMax(payload.backdrops ?? [], 'vote_average', i => !!i.file_path)?.file_path,
      };
      if (!image.poster && !image.backdrop) return;
      images[type][key] = image;

      saveState().catch(err => Logger.error('Failed to save image store', err));
      return { image, key, type };
    }

    if (type === 'person' && !payload.profiles?.length) return;
    if (type === 'season' && !payload.posters?.length) return;
    if (type === 'episode' && !payload.stills?.length) return;

    const fetchedImages = payload.profiles ?? payload.posters ?? payload.stills;

    if (!fetchedImages?.length) return;

    const image = arrayMax(fetchedImages, 'vote_average', i => !!i.file_path)?.file_path;
    if (!image) return;
    images[type][key] = image;
    saveState().catch(err => Logger.error('Failed to save image store', err));
    return { image, key, type };
  };

  const getImageSize = (type: ImageQuery['type'], size: number | 'original') => {
    if (typeof size === 'string') return size;
    if (type === 'person') return findClosestMatch(size, imageSizes.value.poster);
    if (type === 'episode') return findClosestMatch(size, imageSizes.value.still);
    return findClosestMatch(size, imageSizes.value.poster);
  };

  const buildImageUrl = ({ url, baseUrl, type, size }: { url: string; baseUrl: string; type: ImageQuery['type']; size: number | 'original' }) =>
    `${baseUrl}${getImageSize(type, size)}${url}`;

  const setResponseValue = (
    { image, baseUrl, type, size }: { image: ImageStoreMedias; baseUrl: string; type: ImageQuery['type']; size: number | 'original' },
    response: Ref<ImageStoreMedias | undefined> = ref(),
  ) => {
    if (typeof image === 'string') response.value = buildImageUrl({ url: image, baseUrl, type, size });
    else {
      response.value = {
        poster: image.poster ? buildImageUrl({ url: image.poster, baseUrl, type, size }) : undefined,
        backdrop: image.backdrop ? buildImageUrl({ url: image.backdrop, baseUrl, type, size }) : undefined,
      };
    }
    return response;
  };

  const getImageUrl = async (query: ImageQuery, size: number | 'original', response: Ref<ImageStoreMedias | undefined> = ref()) => {
    if (!tmdbConfig.value) throw new Error('TmdbConfiguration not initialized');
    if (!tmdbConfig.value?.images?.secure_base_url) throw new Error('TmdbConfiguration missing secure_base_url');

    const { key, type } = getKeyAndType(query);

    const baseUrl = tmdbConfig.value.images.secure_base_url;

    const image = images[type][key];
    if (image) return setResponseValue({ image, baseUrl, type, size }, response);

    const result = await fetchImageUrl(key, query);
    if (!result?.image) return response;
    return setResponseValue({ image: result.image, baseUrl, type, size }, response);
  };

  return { initImageStore, getImageUrl, imageSizes, clearState, buildImageUrl };
});

export const useImageStoreRefs = () => storeToRefs(useImageStore());

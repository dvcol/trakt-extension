<script lang="ts" setup>
import { NImage } from 'naive-ui';

import {
  computed,
  onBeforeUnmount,
  type PropType,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';

import type { PosterItem } from '~/models/poster.model';

import PosterPlaceholderNew from '~/assets/images/poster-placeholder-new.webp';
import PosterPlaceholder from '~/assets/images/poster-placholder.webp';

import { Logger } from '~/services/logger.service';
import { type ImageStoreMedias, useImageStore } from '~/stores/data/image.store';
import { Brand, useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';

const props = defineProps({
  item: {
    type: Object as PropType<PosterItem>,
    required: true,
  },
  type: {
    type: String as PropType<PosterItem['type']>,
    required: false,
  },
  poster: {
    type: String,
    required: false,
  },
  backdrop: {
    type: Boolean,
    required: false,
    default: false,
  },
  size: {
    type: [Number, String] as PropType<number | 'original'>,
    required: false,
    default: 300,
  },
});

const { backdrop, poster, item, size, type } = toRefs(props);

// cache poster image to prevent flickering
const cache = reactive<Record<string, ImageStoreMedias>>({});

const resolvedPoster = computed<string | undefined>(() => {
  if (poster?.value) return poster.value;
  if (item.value.poster) return item.value.poster;

  let image: ImageStoreMedias | undefined = item.value.posterRef?.value;
  if (!image) {
    if (!item.value.key) return;
    const key = [item.value.key, backdrop.value, type?.value].filter(Boolean).join('-');
    image = cache[key];
  }
  if (!image) return;
  if (typeof image === 'string') return image;
  if (backdrop.value && 'backdrop' in image) return image.backdrop ?? image.poster;
  return image.poster ?? image.backdrop;
});

const transition = ref(false);

const imgLoaded = ref(false);
const loading = computed(() => !imgLoaded.value || !resolvedPoster.value);

const imageRef = ref<typeof NImage>();
const dimensions = ref<{ width: number; height: number; ratio: number }>();
const portrait = computed(() => dimensions.value?.ratio && dimensions.value.ratio < 1);

const objectFit = computed(() =>
  resolvedPoster.value === PosterPlaceholder ? 'contain' : 'cover',
);

const onLoad = () => {
  const { naturalWidth, naturalHeight }: HTMLImageElement =
    imageRef.value?.$el?.firstElementChild ?? {};
  dimensions.value = {
    width: naturalWidth,
    height: naturalHeight,
    ratio: Math.round((naturalWidth / naturalHeight) * 100) / 100,
  };
  imgLoaded.value = true;
};

const { brand } = useExtensionSettingsStoreRefs();
const placeholder = computed(() => {
  if (brand.value === Brand.New) return PosterPlaceholderNew;
  return PosterPlaceholder;
});

const { getImageUrl } = useImageStore();

const timeout = ref();
const getPosters = async (
  _item: PosterItem = item.value,
  _type: PosterItem['type'] | undefined = type?.value,
) => {
  if (resolvedPoster.value) return;

  const query = _item.getPosterQuery?.();
  if (!query) return;
  if (
    (_type === 'show' || !backdrop.value) &&
    (_item.type === 'season' || _item.type === 'episode')
  ) {
    query.type = 'show';
    if (_item.type === 'episode') delete query.episode;
    if (_item.type === 'season') delete query.season;
  }
  // If the image is not loaded after 100ms, show transition
  clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    if (!loading.value) return;
    transition.value = true;
  }, 100);
  try {
    const response = await getImageUrl({
      query,
      size: size.value,
    });
    if (!_item?.key || !response) return;
    const key = [item.value.key, backdrop.value, type?.value].filter(Boolean).join('-');
    cache[key] = response;
  } catch (error) {
    Logger.error('Failed to fetch poster', error);
  }
};

watch([item, type, backdrop], () => getPosters(), { immediate: true, flush: 'pre' });

onBeforeUnmount(() => {
  clearTimeout(timeout.value);
});
</script>

<template>
  <NImage
    ref="imageRef"
    alt="poster-image"
    class="poster"
    :class="{
      portrait,
      backdrop,
      loading,
      transition,
    }"
    :object-fit="objectFit"
    width="100%"
    lazy
    preview-disabled
    :src="resolvedPoster"
    :fallback-src="placeholder"
    :on-load="onLoad"
  />
  <NImage
    alt="poster-image-fallback"
    class="poster placeholder"
    :class="{
      portrait,
      backdrop,
    }"
    object-fit="contain"
    width="100%"
    lazy
    preview-disabled
    :src="placeholder"
    :fallback-src="placeholder"
  />
</template>

<style lang="scss" scoped>
@use '~/styles/z-index' as layers;

.poster {
  flex: 0 0 var(--poster-width, 5.3125rem);
  justify-content: center;
  width: var(--poster-width, 5.3125rem);
  height: var(--poster-height, 8rem);
  border-radius: var(--poster-radius, 8px);
  opacity: 1;

  &.loading {
    opacity: 0;
  }

  &.transition {
    transition: opacity 0.3s var(--n-bezier);
  }

  &.backdrop {
    flex: 0 0 var(--poster-width, 14.23rem);
    width: var(--poster-width, 14.23rem);
  }

  &.placeholder {
    position: absolute;
    background-color: #111;
    border-radius: var(--poster-radius, 8px);
  }

  &:not(.placeholder) {
    z-index: layers.$in-front;
  }
}
</style>

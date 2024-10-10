<script lang="ts" setup>
import { NImage } from 'naive-ui';

import { computed, onBeforeUnmount, type PropType, ref, toRefs, watch } from 'vue';

import type { PosterItem } from '~/models/poster.model';

import PosterPlaceholder from '~/assets/images/poster-placholder.webp';
import { Logger } from '~/services/logger.service';
import { type ImageStoreMedias, useImageStore } from '~/stores/data/image.store';

const props = defineProps({
  item: {
    type: Object as PropType<PosterItem>,
    required: true,
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

const { backdrop, poster, item, size } = toRefs(props);

const imgLoaded = ref(true);

const onLoad = () => {
  imgLoaded.value = true;
};

// Local poster is used when the item has no poster ref of its own.
const localPoster = ref<ImageStoreMedias>();

// cache poster image to prevent flickering
const cache: Map<string, ImageStoreMedias> = new Map();

const resolvedPoster = computed(() => {
  if (poster?.value) return poster.value;
  if (item.value.poster) return item.value.poster;
  let image = (item.value.posterRef ?? localPoster)?.value;
  if (item?.value?.key) {
    if (image) cache.set(item.value.key, image);
    else image = cache.get(item.value.key);
  }
  if (!image) return;
  if (typeof image === 'string') return image;
  if (backdrop.value && 'backdrop' in image) return image.backdrop;
  return image.poster;
});

const objectFit = computed(() =>
  resolvedPoster.value === PosterPlaceholder ? 'contain' : 'cover',
);

const transition = ref(false);
const timeout = ref();

const { getImageUrl } = useImageStore();

const getPosters = async (_item: PosterItem) => {
  if (resolvedPoster.value) return;

  imgLoaded.value = false;
  const query = _item.getPosterQuery?.();
  if (!query) return;
  if (!backdrop.value && _item.type === 'episode') {
    query.type = 'show';
    delete query.episode;
  }
  setTimeout(() => {
    if (imgLoaded.value) return;
    transition.value = true;
  }, 100);
  try {
    await getImageUrl({
      query,
      size: size.value,
      response: _item.posterRef ?? localPoster,
    });
  } catch (error) {
    Logger.error('Failed to fetch poster', error);
  }
};

watch(item, getPosters, { immediate: true, flush: 'pre' });

onBeforeUnmount(() => {
  clearTimeout(timeout.value);
});
</script>

<template>
  <NImage
    alt="poster-image"
    class="poster"
    :class="{
      backdrop,
      loading: !imgLoaded,
      transition,
    }"
    :object-fit="objectFit"
    width="100%"
    lazy
    preview-disabled
    :src="resolvedPoster"
    :fallback-src="PosterPlaceholder"
    :on-load="onLoad"
  />
  <NImage
    alt="poster-image-fallback"
    class="poster placeholder"
    :class="{ backdrop }"
    object-fit="contain"
    width="100%"
    lazy
    preview-disabled
    :src="PosterPlaceholder"
    :fallback-src="PosterPlaceholder"
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
  will-change: opacity;

  &.loading {
    opacity: 0;
  }

  &.transition {
    transition: opacity 0.5s var(--n-bezier);

    &.loading {
      transition: opacity 0.1s;
    }
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

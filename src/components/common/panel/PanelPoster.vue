<script lang="ts" setup>
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, type PropType, toRefs, Transition } from 'vue';

import { useRoute } from 'vue-router';

import type { PosterItem } from '~/models/poster.model';
import type { ImageQuery, ImageStoreTypes } from '~/stores/data/image.store';

import PosterComponent from '~/components/common/poster/PosterComponent.vue';
import { openLink } from '~/stores/composable/use-links';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('common', 'tooltip');

const props = defineProps({
  tmdb: {
    type: Number,
    required: false,
  },
  mode: {
    type: String as PropType<ImageStoreTypes>,
    required: true,
  },
  portait: {
    type: Boolean,
    required: false,
  },
  seasonNumber: {
    type: Number,
    required: false,
  },
  episodeNumber: {
    type: Number,
    required: false,
  },
  link: {
    type: String,
    required: false,
  },
  size: {
    type: [Number, String] as PropType<number | 'original'>,
    required: false,
    default: window?.innerWidth ?? 800 / 2,
  },
});

const { tmdb, mode, seasonNumber, episodeNumber, link } = toRefs(props);

const posterItem = computed<PosterItem | undefined>(() => {
  const id = tmdb?.value;
  const type = mode?.value;

  if (!id || !type) return;

  const imageQuery: ImageQuery = {
    id,
    type,
    season: seasonNumber?.value,
    episode: episodeNumber?.value,
  };

  return {
    id,
    key: `${type}-${id}`,
    type,
    getPosterQuery: () => imageQuery,
  };
});

const key = computed(() => {
  if (episodeNumber?.value !== undefined && seasonNumber?.value !== undefined) {
    return `episode-${episodeNumber.value}-season-${seasonNumber.value}`;
  }
  if (seasonNumber?.value !== undefined) return `season-${seasonNumber.value}`;
  if (tmdb?.value !== undefined) return `tmdb-${tmdb?.value}`;
  return `placeholder`;
});

const label = computed(() => {
  if (!link?.value?.length) return undefined;
  return i18n(`open_${mode.value}_in_trakt`, 'common', 'tooltip');
});

const route = useRoute();
</script>

<template>
  <Transition v-if="posterItem" name="scale" mode="out-in">
    <NFlex
      :key="key"
      class="poster-container"
      :class="{ landscape: !portait, link }"
      :title="label"
      @click="openLink(link)"
    >
      <PosterComponent
        :item="posterItem"
        :size="size"
        :backdrop="!portait"
        :force="route.query.force === 'true'"
      />
    </NFlex>
  </Transition>
  <NSkeleton
    v-else
    class="poster-container skeleton"
    :class="{ landscape: mode !== 'season' }"
  />
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;
@use '~/styles/transition' as transition;
@include transition.scale;

.poster-container {
  --min-width: var(--half-width);
  --poster-height: calc(min(var(--min-width), var(--height-70-dvh)) * (9 / 16));
  --poster-width: calc(var(--poster-height) * (2 / 3));

  @media (width < 725px) {
    --min-width: calc(var(--width-80-dvh) - 2rem);
  }

  &.link {
    @include mixin.hover-box-shadow;

    cursor: pointer;
  }

  &.landscape:not(:has(.poster.portrait)) {
    --poster-width: min(var(--min-width), var(--height-70-dvh));
    --poster-height: calc(var(--poster-width) * (9 / 16));
  }

  &.skeleton {
    width: var(--poster-width);
    height: var(--poster-height);
  }

  position: relative;
  width: var(--poster-width);
  height: var(--poster-height);
  margin: 1.25rem auto 1.5rem;
  border: 1px solid var(--border-white);
  border-radius: var(--poster-radius, 8px);
  box-shadow: var(--image-box-shadow);
}
</style>

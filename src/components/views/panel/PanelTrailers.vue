<script setup lang="ts">
import { NCarousel } from 'naive-ui';
import { type PropType } from 'vue';

import type { YoutubePlayerProps } from '~/models/youtube-player.model';

import YoutubePlayer from '~/components/common/video/YoutubePlayer.vue';

defineProps({
  trailers: {
    type: Array as PropType<YoutubePlayerProps[]>,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<template>
  <NCarousel
    v-if="!disabled && trailers?.length"
    class="carousel"
    dot-type="line"
    effect="slide"
    centered-slides
    keyboard
    trigger="hover"
    :space-between="32"
  >
    <slot />
    <YoutubePlayer
      v-for="trailer in trailers"
      :key="trailer.id"
      class="trailer-container"
      v-bind="trailer"
    />
  </NCarousel>

  <slot v-else />
</template>

<style scoped lang="scss">
/* stylelint-disable selector-class-pattern -- library class name */
@use '~/styles/mixin' as mixin;

.carousel {
  --width: min(var(--half-width), var(--height-70-dvh));
  --height: calc(var(--width) * (9 / 16));

  width: var(--width);
  height: calc(var(--height) + 1rem + 2.5rem);
  margin: 0 -1.25rem;
  padding: 0 1.25rem;

  :deep(.n-carousel__slides .n-carousel__slide.n-carousel__slide--current) {
    overflow: unset;
  }

  .trailer-container {
    @include mixin.hover-box-shadow;

    width: var(--width);
    height: var(--height);
    margin: 1rem auto 2.5rem;
    overflow: hidden;
    border: 1px solid var(--border-white);
    border-radius: var(--poster-radius, 8px);
    box-shadow: var(--image-box-shadow);
  }
}
/* stylelint-enable selector-class-pattern */
</style>

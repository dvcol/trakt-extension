<script setup lang="ts">
import { handleSwipeLeftRight, SwipeDirection } from '@dvcol/common-utils/common/touch';
import { type CarouselInst, NCarousel } from 'naive-ui';
import { type PropType, ref } from 'vue';

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

const carouselRef = ref<CarouselInst & InstanceType<typeof NCarousel>>();
const touchStart = ref<TouchEvent>();

const onTouchStart = (e: TouchEvent) => {
  touchStart.value = e;
};

const onTouchEnd = (e: TouchEvent) => {
  const _touchStart = touchStart.value?.targetTouches?.[0];
  const _touchEnd = e.changedTouches?.[0];
  if (!_touchStart) return;
  touchStart.value = undefined;
  const _ref = carouselRef.value;
  if (!_ref) return;
  const { clientWidth, clientHeight } = _ref.$el || {};
  const swipe = handleSwipeLeftRight(_touchStart, _touchEnd, {
    vertical: clientHeight ? Math.min(clientHeight / 2, 200) : 200,
    left: clientWidth ? Math.min(clientWidth / 2, 100) : 100,
    right: clientWidth ? Math.min(clientWidth / 2, 100) : 100,
  });
  if (!swipe) return;
  if (swipe === SwipeDirection.Right) _ref.next();
  if (swipe === SwipeDirection.Left) _ref.prev();
};
</script>

<template>
  <NCarousel
    v-if="!disabled && trailers?.length"
    ref="carouselRef"
    class="carousel"
    dot-type="line"
    effect="slide"
    centered-slides
    keyboard
    trigger="hover"
    :space-between="32"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
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
  width: var(--width);
  height: calc(var(--height) + 1rem + 2.5rem);
  margin: 0 -1.25rem;
  padding: 0 1.25rem;
  aspect-ratio: 16 / 9;

  --width: min(var(--half-width), var(--height-70-dvh));
  --height: calc(var(--width) * (9 / 16));

  @media (width < 725px) {
    --width: min(var(--width-80-dvh), var(--height-70-dvh));

    margin: auto;
  }

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

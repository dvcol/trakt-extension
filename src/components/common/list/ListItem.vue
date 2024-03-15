<script setup lang="ts">
import { NFlex, NImage, NTimelineItem } from 'naive-ui';

import { computed, type PropType, toRefs } from 'vue';

import PosterPlaceholder from '~/assets/images/poster-placholder.webp';
import { Colors } from '~/styles/colors.style';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  poster: {
    type: String,
    required: false,
    default: PosterPlaceholder,
  },
  color: {
    type: String,
    required: false,
    default: Colors.traktRedDark,
  },
  lineType: {
    type: String as PropType<'dashed' | 'default'>,
    required: false,
    default: 'default',
  },
  tag: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const { id, index } = toRefs(props);

const isLoading = computed(() => id?.value < 0);
</script>

<template>
  <NTimelineItem
    :key="id"
    class="timeline-item"
    :class="{ 'no-tag': !tag }"
    :data-key="id"
    :data-index="index"
    :line-type="isLoading ? 'dashed' : lineType"
    :color="isLoading ? 'grey' : color"
  >
    <template #icon>
      <slot name="tag" />
    </template>
    <template #header>
      <slot name="before" />
    </template>
    <template #default>
      <NFlex class="content">
        <NImage
          alt="poster-image"
          class="poster"
          lazy
          preview-disabled
          :src="poster"
          :preview-src="poster"
          :fallback-src="PosterPlaceholder"
        />
        <slot :id="id" :index="index" :loading="isLoading" />
      </NFlex>
    </template>
    <template #footer>
      <slot name="after" />
    </template>
  </NTimelineItem>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;

.timeline-item {
  margin: 0 1rem;

  .content {
    @include mixin.hover-background(
      $from: transparent,
      $to: var(--bg-color-20),
      $transition: 0.2s var(--n-bezier)
    );

    padding: 0.5rem;
    border-top: 1px solid rgba(255 255 255 / 10%);
  }

  .poster {
    justify-content: center;
    width: 5.5rem;
    height: 8rem;
    background-color: #111;
  }
}
</style>

<style lang="scss">
/* stylelint-disable selector-class-pattern -- library class name */

.timeline-item.n-timeline-item .n-timeline-item-content .n-timeline-item-content__meta {
  margin: 0;
}

.n-timeline.n-timeline--left-placement {
  .timeline-item.n-timeline-item .n-timeline-item-timeline {
    top: -6px;
  }

  .timeline-item.no-tag.n-timeline-item .n-timeline-item-timeline {
    .n-timeline-item-timeline__line {
      top: 0;
    }

    .n-timeline-item-timeline__circle {
      display: none;
    }
  }
}
</style>

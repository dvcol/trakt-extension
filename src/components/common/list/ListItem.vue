<script setup lang="ts">
import { NFlex, NImage, NTimelineItem } from 'naive-ui';

import { computed, type PropType, toRefs } from 'vue';

import PosterPlaceholder from '~/assets/images/poster-placholder.webp';

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
  type: {
    type: String as PropType<'default' | 'error' | 'info' | 'success' | 'warning'>,
    required: false,
    default: 'default',
  },
  lineType: {
    type: String as PropType<'dashed' | 'default'>,
    required: false,
    default: 'default',
  },
});

const { id, index } = toRefs(props);

const isLoading = computed(() => id?.value < 0);
</script>

<template>
  <NTimelineItem
    :key="id"
    class="timeline-item"
    :data-key="id"
    :data-index="index"
    :type="isLoading ? type : 'success'"
    :line-type="isLoading ? lineType : 'default'"
  >
    <NFlex>
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
  </NTimelineItem>
</template>

<style lang="scss" scoped>
.timeline-item {
  font-variant-numeric: tabular-nums;
  margin: 0 1rem;

  .poster {
    justify-content: center;
    width: 5.5rem;
    height: 8rem;
    background-color: #111;
  }
}
</style>

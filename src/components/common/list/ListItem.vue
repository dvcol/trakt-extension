<script setup lang="ts">
import { NFlex, NImage, NTimelineItem } from 'naive-ui';

import { type PropType } from 'vue';

import type { ListScrollItem } from '~/components/common/list/ListScroll.model';

import PosterPlaceholder from '~/assets/images/poster-placholder.webp';
import ListItemPanel from '~/components/common/list/ListItemPanel.vue';
import { Colors } from '~/styles/colors.style';

const props = defineProps({
  item: {
    type: Object as PropType<ListScrollItem>,
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
  noTag: {
    type: Boolean,
    required: false,
  },
});
</script>

<template>
  <NTimelineItem
    :key="item.id"
    class="timeline-item"
    :data-tag="JSON.stringify(item.date)"
    :class="{ 'no-tag': noTag || item.date?.sameDay }"
    :data-key="item.id"
    :data-index="index"
    :line-type="item.loading ? 'dashed' : lineType"
    :color="item.loading ? 'grey' : color"
  >
    <template #icon>
      <slot name="tag" />
    </template>
    <template #header>
      <slot name="before" />
    </template>
    <template #default>
      <NFlex class="content" :class="{ 'no-border': noTag || item.date?.sameDay }">
        <NImage
          alt="poster-image"
          class="poster"
          lazy
          preview-disabled
          :src="poster"
          :preview-src="poster"
          :fallback-src="PosterPlaceholder"
        />
        <ListItemPanel :item="item" :loading="item.loading">
          <slot :item="item" :index="index" :loading="item.loading" />
        </ListItemPanel>
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

    &:not(.no-border) {
      border-top: 1px solid rgba(255 255 255 / 10%);
    }
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

<script setup lang="ts">
import { NEmpty, NFlex, NImage, NSkeleton, NTime, NTimelineItem } from 'naive-ui';

import {
  computed,
  defineProps,
  onBeforeUnmount,
  onMounted,
  type PropType,
  ref,
  toRefs,
  watch,
} from 'vue';

import PosterPlaceholder from '~/assets/images/poster-placholder.webp';
import ListItemPanel from '~/components/common/list/ListItemPanel.vue';
import { type ListScrollItem, ListScrollItemType } from '~/models/list-scroll.model';

import { useImageStore } from '~/stores/data/image.store';
import { Colors } from '~/styles/colors.style';
import { useI18n } from '~/utils';

const props = defineProps({
  item: {
    type: Object as PropType<ListScrollItem>,
    required: true,
  },
  height: {
    type: Number,
    required: false,
  },
  poster: {
    type: String,
    required: false,
  },
  episode: {
    type: Boolean,
    required: false,
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
  noHeader: {
    type: Boolean,
    required: false,
  },
  nextHasHeader: {
    type: Boolean,
    required: false,
  },
  hideDate: {
    type: Boolean,
    required: false,
  },
  hover: {
    type: Boolean,
    required: false,
  },
  scrollIntoView: {
    type: Boolean,
    required: false,
  },
});

const emit = defineEmits<{
  (e: 'onHover', event: { item: ListScrollItem; hover: boolean }): void;
  (e: 'onScrollIntoView', event: { item: ListScrollItem; ref?: HTMLDivElement }): void;
  (e: 'onScrollOutOfView', event: { item: ListScrollItem; ref?: HTMLDivElement }): void;
}>();

const i18n = useI18n('list', 'item');

const {
  item,
  noHeader,
  nextHasHeader,
  poster,
  episode,
  hideDate,
  scrollIntoView,
  height,
} = toRefs(props);

const onHover = (_hover: boolean) => {
  emit('onHover', { item: item?.value, hover: _hover });
};

const noHead = computed(
  () => !hideDate.value && (noHeader.value || item?.value?.date?.sameDayAsPrevious),
);
const nextHasHead = computed(
  () => hideDate.value || nextHasHeader.value || !item?.value?.date?.sameDayAsNext,
);
const date = computed(() => item?.value?.date?.current);

const year = new Date().getFullYear();
const sameYear = computed(() => date.value?.getFullYear() === year);
const loading = computed(() => item?.value?.loading);

const { getImageUrl } = useImageStore();

const resolvedPoster = computed(() => {
  if (poster?.value) return poster.value;
  if (item.value.poster) return item.value.poster;
  const image = item.value.posterRef?.value;
  if (!image) return;
  if (typeof image === 'string') return image;
  if (episode.value && 'backdrop' in image) return image.backdrop;
  return image.poster;
});

const objectFit = computed(() =>
  resolvedPoster.value === PosterPlaceholder ? 'contain' : 'cover',
);

const imgLoaded = ref(true);

const onLoad = () => {
  imgLoaded.value = true;
};

const transition = ref(false);
const timeout = ref();

const getPosters = (_item: ListScrollItem) => {
  imgLoaded.value = false;
  if (_item.posterRef?.value) return;
  if (!_item.posterRef) return;
  const query = _item.getPosterQuery?.();
  if (!query) return;
  if (!episode.value && _item.type === 'episode') {
    query.type = 'show';
    delete query.episode;
  }
  setTimeout(() => {
    if (resolvedPoster.value) return;
    transition.value = true;
  }, 100);
  getImageUrl(query, 300, _item.posterRef);
};

watch(item, getPosters, { immediate: true, flush: 'post' });

const itemRef = ref<HTMLElement & InstanceType<typeof NTimelineItem>>();

onMounted(() => {
  if (!scrollIntoView.value) return;
  emit('onScrollIntoView', {
    item: item?.value,
    ref: itemRef.value?.$el,
  });
});

onBeforeUnmount(() => {
  clearTimeout(timeout.value);
  if (!scrollIntoView.value) return;
  emit('onScrollOutOfView', {
    item: item?.value,
    ref: itemRef.value?.$el,
  });
});

const itemHeight = computed(() => (height?.value ? `${height.value}px` : undefined));
</script>

<template>
  <NTimelineItem
    ref="itemRef"
    :key="item.id"
    class="timeline-item"
    :class="{
      'no-header': noHead,
      'next-has-header': nextHasHead,
      'show-date': !hideDate,
    }"
    :style="{
      '--list-item-height': itemHeight,
    }"
    :data-key="item.id"
    :data-index="item.index"
    :data-type="item.type"
    :line-type="loading ? 'dashed' : lineType"
    :color="loading ? 'grey' : color"
    @mouseenter="onHover(true)"
    @mouseleave="onHover(false)"
  >
    <template #icon>
      <slot name="tag" />
    </template>
    <template #header>
      <slot name="before" />
    </template>
    <template #default>
      <NFlex
        class="content"
        :class="{ 'no-border': noHead }"
        size="small"
        :theme-overrides="{ gapSmall: '0' }"
        :wrap="false"
      >
        <NFlex
          v-if="!hideDate"
          class="header"
          :class="{ hover }"
          vertical
          justify="flex-start"
          align="center"
          size="small"
          :theme-overrides="{ gapSmall: '0.25rem' }"
        >
          <template v-if="date && !noHead && !loading">
            <NTime class="month" :time="date" format="MMM" />
            <NTime class="day" :time="date" format="dd" />
            <NTime class="week" :time="date" format="eee" />
            <NTime v-if="!sameYear" class="year" :time="date" format="yyyy" />
          </template>
          <template v-else-if="loading">
            <NSkeleton class="loading month" text round />
            <NSkeleton class="loading day" text round />
            <NSkeleton class="loading week" text round />
          </template>
        </NFlex>

        <slot v-if="item.type === ListScrollItemType.placeholder">
          <NFlex class="placeholder" align="center" justify="center" :wrap="false">
            <NEmpty size="large" :description="i18n('placeholder_empty')" />
          </NFlex>
        </slot>
        <NFlex v-else class="tile" :wrap="false">
          <NImage
            alt="poster-image"
            class="poster"
            :class="{
              episode,
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
            :class="{ episode }"
            object-fit="contain"
            width="100%"
            lazy
            preview-disabled
            :src="PosterPlaceholder"
            :fallback-src="PosterPlaceholder"
          />
          <ListItemPanel :item="item" :loading="loading" :hide-date="hideDate">
            <slot :item="item" :loading="loading" />
          </ListItemPanel>
        </NFlex>
      </NFlex>
    </template>
    <template #footer>
      <slot name="after" />
    </template>
  </NTimelineItem>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;
@use '~/styles/z-index' as layers;

.timeline-item {
  height: var(--list-item-height, 145px);
  margin: 0 1rem;

  &.show-date {
    margin-left: 4rem;
  }

  .content {
    height: 100%;

    .tile {
      @include mixin.hover-background(
        $from: transparent,
        $to: var(--bg-color-20),
        $transition: 0.2s var(--n-bezier)
      );

      flex: 1 1 auto;
      padding: 0.5rem;
    }

    .placeholder {
      flex: 1 1 auto;
    }
  }

  .header {
    position: absolute;
    top: 0;
    left: -3.75rem;
    width: 3.5rem;
    color: var(--n-text-color);
    font-size: 14px;
    border-top: 1px solid var(--border-grey);

    &.hover {
      color: var(--trakt-red);
      transition: color 0.2s var(--n-bezier);
      will-change: color;
    }

    .month {
      margin-top: 0.75rem;
      font-weight: bold;
    }

    .day {
      font-weight: bold;
      font-size: 1.5rem;
    }

    .year {
      margin-top: 0.25rem;
      opacity: 0.5;
    }

    .loading {
      margin-bottom: 0.25rem;

      &.month {
        width: 1.5rem;
        height: 0.8rem;
      }

      &.day {
        width: 2rem;
        height: 1rem;
      }

      &.week {
        width: 1.6rem;
        height: 0.75rem;
      }
    }
  }

  &.no-header {
    .header {
      border-top: 1px solid transparent;
    }
  }

  .poster {
    flex: 0 0 var(--poster-width, 5.3125rem);
    justify-content: center;
    width: var(--poster-width, 5.3125rem);
    height: var(--poster-height, 8rem);
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

    &.episode {
      flex: 0 0 var(--poster-width, 14.23rem);
      width: var(--poster-width, 14.23rem);
    }

    &.placeholder {
      position: absolute;
      background-color: #111;
    }

    &:not(.placeholder) {
      z-index: layers.$in-front;
    }
  }
}
</style>

<style lang="scss">
/* stylelint-disable selector-class-pattern -- library class name */

.n-timeline.n-timeline--left-placement .timeline-item.n-timeline-item {
  .n-timeline-item-timeline {
    --n-icon-size: 12px;

    top: calc(0% - var(--n-icon-size) / 2);
  }

  &.no-header .n-timeline-item-timeline {
    &__line {
      top: 0;
    }

    &__circle {
      display: none;
    }
  }

  &:last-child .n-timeline-item-timeline {
    &__line {
      display: block;
    }
  }

  .n-timeline-item-content {
    height: 100%;
    margin-left: calc(var(--n-icon-size) + 0.125rem);
    border-top: 1px solid transparent;

    &__content {
      height: 100%;
    }

    &__meta {
      margin: 0;
    }

    &__title {
      margin: 0;
    }
  }

  &:not(.no-header) .n-timeline-item-content {
    border-top: 1px solid var(--border-grey);
  }
}
</style>

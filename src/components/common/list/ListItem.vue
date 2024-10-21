<script setup lang="ts">
import { NButtonGroup, NEmpty, NFlex, NSkeleton, NTime, NTimelineItem } from 'naive-ui';

import {
  computed,
  defineProps,
  onBeforeUnmount,
  onMounted,
  type PropType,
  ref,
  toRefs,
} from 'vue';

import type { PosterItem } from '~/models/poster.model';

import ListItemPanel from '~/components/common/list/ListItemPanel.vue';
import PosterComponent from '~/components/common/poster/PosterComponent.vue';
import { type ListScrollItem, ListScrollItemType } from '~/models/list-scroll.model';
import { BrandColors } from '~/styles/colors.style';
import { useI18n } from '~/utils/i18n.utils';

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
  backdrop: {
    type: Boolean,
    required: false,
  },
  posterType: {
    type: String as PropType<PosterItem['type']>,
    required: false,
  },
  color: {
    type: String,
    required: false,
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
  hideTime: {
    type: Boolean,
    required: false,
  },
  hidePoster: {
    type: Boolean,
    required: false,
  },
  contentHeight: {
    type: Number,
    required: false,
    default: 1,
  },
  hover: {
    type: Boolean,
    required: false,
  },
  scrollIntoView: {
    type: Boolean,
    required: false,
  },
  showProgress: {
    type: Boolean,
    required: false,
    default: false,
  },
  showPlayed: {
    type: Boolean,
    required: false,
    default: false,
  },
  showCollected: {
    type: Boolean,
    required: false,
    default: false,
  },
  showTagLoader: {
    type: Boolean,
    required: false,
  },
});

const emit = defineEmits<{
  (e: 'onHover', event: { item: ListScrollItem; hover: boolean }): void;
  (e: 'onItemClick', event: { item: ListScrollItem; force?: boolean }): void;
  (e: 'onScrollIntoView', event: { item: ListScrollItem; ref?: HTMLDivElement }): void;
  (e: 'onScrollOutOfView', event: { item: ListScrollItem; ref?: HTMLDivElement }): void;
}>();

const i18n = useI18n('list', 'item');

const { item, noHeader, nextHasHeader, poster, hideDate, scrollIntoView, height, color } =
  toRefs(props);

const itemRef = ref<HTMLElement & InstanceType<typeof NTimelineItem>>();

const open = ref(false);
const onHover = (_event: MouseEvent, _hover: boolean) => {
  emit('onHover', { item: item?.value, hover: _hover });
  itemRef?.value?.$el?.focus();
  open.value = _hover && (_event.altKey || _event.ctrlKey);
};

const noHead = computed(
  () => !hideDate.value && (noHeader.value || item?.value?.date?.sameDayAsPrevious),
);
const nextHasHead = computed(
  () => hideDate.value || nextHasHeader.value || !item?.value?.date?.sameDayAsNext,
);
const date = computed(() => item?.value?.date?.current);

const isToday = computed(
  () => date.value?.toLocaleDateString() === new Date().toLocaleDateString(),
);

const year = new Date().getFullYear();
const sameYear = computed(() => date.value?.getFullYear() === year);
const loading = computed(() => item?.value?.loading);

onMounted(() => {
  if (!scrollIntoView.value) return;
  emit('onScrollIntoView', {
    item: item?.value,
    ref: itemRef.value?.$el,
  });
});

onBeforeUnmount(() => {
  if (!scrollIntoView.value) return;
  emit('onScrollOutOfView', {
    item: item?.value,
    ref: itemRef.value?.$el,
  });
});

const itemHeight = computed(() => (height?.value ? `${height.value}px` : undefined));

const _color = computed(() => color?.value ?? BrandColors.traktDark);

const onClick = (e: MouseEvent | KeyboardEvent) =>
  emit('onItemClick', { item: item?.value, force: e.shiftKey });
</script>

<template>
  <NTimelineItem
    ref="itemRef"
    :key="item.key"
    tabindex="0"
    class="timeline-item"
    :class="{
      'no-header': noHead,
      'next-has-header': nextHasHead,
      'show-date': !hideDate,
    }"
    :style="{
      '--list-item-height': itemHeight,
    }"
    :data-id="item.id"
    :data-index="item.index"
    :data-key="item.key"
    :data-type="item.type"
    :aria-label="item.title"
    :line-type="loading ? 'dashed' : lineType"
    :color="loading ? 'grey' : _color"
    @click="onClick"
    @keydown.enter="onClick"
    @keydown.alt="open = !open"
    @keydown.ctrl="open = !open"
    @mouseenter="e => onHover(e, true)"
    @mouseleave="e => onHover(e, false)"
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
        align="center"
      >
        <NFlex
          v-if="!hideDate"
          class="header"
          :class="{ hover, today: isToday }"
          vertical
          justify="flex-start"
          align="center"
          size="small"
          :theme-overrides="{ gapSmall: '0.25rem' }"
        >
          <Transition v-if="!noHead && date" name="fade">
            <div v-if="loading" class="column">
              <NSkeleton class="loading month" text round />
              <NSkeleton class="loading day" text round />
              <NSkeleton class="loading week" text round />
            </div>
            <div v-else class="column">
              <NTime class="month" :time="date" format="MMM" />
              <NTime class="day" :time="date" format="dd" />
              <NTime class="week" :time="date" format="eee" />
              <NTime v-if="!sameYear" class="year" :time="date" format="yyyy" />
            </div>
          </Transition>
        </NFlex>

        <slot v-if="item.type === ListScrollItemType.Placeholder">
          <NFlex class="placeholder" align="center" justify="center" :wrap="false">
            <NEmpty size="large" :description="i18n('placeholder_empty')" />
          </NFlex>
        </slot>
        <NFlex v-else class="tile" :wrap="false" align="center">
          <PosterComponent
            v-if="!hidePoster"
            :item="item as PosterItem"
            :poster="poster"
            :type="posterType"
            :backdrop="backdrop"
          />
          <ListItemPanel
            :item="item"
            :loading="loading"
            :hide-date="hideDate"
            :hide-time="hideTime"
            :content-height="contentHeight"
            :show-progress="showProgress"
            :show-played="showPlayed"
            :show-collected="showCollected"
            :show-tag-loader="showTagLoader"
          >
            <slot :item="item" :loading="loading" />
          </ListItemPanel>
          <NButtonGroup
            v-if="$slots.buttons"
            class="tile-buttons"
            :class="{ open }"
            vertical
          >
            <slot name="buttons" :open="open" :item="item" />
          </NButtonGroup>
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
@use '~/styles/transition' as transition;
@include transition.fade;

.timeline-item {
  height: var(--list-item-height, 145px);
  margin: 0 1rem;
  outline: none;

  &.show-date {
    margin-left: 4rem;
  }

  .content {
    height: 100%;

    .tile {
      @include mixin.hover-background(
        $from: transparent,
        $to: var(--bg-color-20),
        $transition: 0.3s var(--n-bezier)
      );

      flex: 1 1 auto;
      margin: 0.25rem 0;
      padding: 0.3rem 0.25rem 0.25rem;
      overflow: hidden;
      border-radius: 0.75rem;

      &:active {
        background-color: var(--bg-color-30);
        box-shadow: var(--inset-box-shadow);
      }

      &-buttons {
        position: absolute;
        right: 0;
        z-index: layers.$in-front;
        transition: translate 0.25s var(--n-bezier);
        translate: 150%;

        &:focus-within,
        &.open {
          translate: 0;
          display: flex;
        }

        :first-child {
          border-top-right-radius: 0.75rem;
        }

        :last-child {
          border-bottom-right-radius: 0.75rem;
        }
      }
    }

    .placeholder {
      flex: 1 1 auto;
    }
  }

  &:focus-visible .content .tile {
    background-color: var(--bg-color-20);
    // stylelint-disable-next-line property-no-vendor-prefix -- necessary for safari
    -webkit-backdrop-filter: var(--bg-blur-hover);
    backdrop-filter: var(--bg-blur-hover);
  }

  .header {
    position: absolute;
    top: 0;
    left: -3.75rem;
    width: 3.5rem;
    min-height: 5rem;
    color: var(--n-text-color);
    font-size: 14px;
    border-top: 1px solid var(--border-grey);
    transition:
      color 0.2s var(--n-bezier),
      border 0.2s var(--n-bezier);
    pointer-events: none;

    &.today {
      color: var(--color-warning);
    }

    &.hover {
      color: var(--trakt-red);
    }

    .column {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      margin-top: 0.75rem;
    }

    .month {
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
        height: 1rem;
      }

      &.day {
        width: 2rem;
        height: 1.25rem;
      }

      &.week {
        width: 1.6rem;
        height: 0.9rem;
      }
    }
  }

  &.no-header {
    .header {
      border-top: 1px solid transparent;
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
    transition: border 0.2s var(--n-bezier);

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

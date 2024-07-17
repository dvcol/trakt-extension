<script setup lang="ts">
import { NFlex, NFloatButton, NIcon } from 'naive-ui';

import type { Component, PropType, Transition } from 'vue';

import IconChevronUp from '~/components/icons/IconChevronUp.vue';
import { useWatchingStoreRefs } from '~/stores/data/watching.store';

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  icon: {
    type: Object as PropType<Component>,
    required: false,
    default: IconChevronUp,
  },
  width: {
    type: String,
    required: false,
  },
});

const { isWatching } = useWatchingStoreRefs();

const emit = defineEmits<{
  (e: 'onClick'): void;
}>();
</script>

<template>
  <Transition name="scale">
    <NFloatButton
      v-if="show"
      class="button"
      :class="{ watching: isWatching }"
      width="fit-content"
      @click="emit('onClick')"
    >
      <NFlex size="small" align="center" justify="space-evenly">
        <NIcon :component="icon" />
        <span
          class="text"
          :style="{
            '--floating-button-width': width,
          }"
        >
          <slot />
        </span>
      </NFlex>
    </NFloatButton>
  </Transition>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;
@use '~/styles/transition' as transition;
@include transition.scale($scale: 0.6);

.button {
  @include mixin.hover-background;

  right: 2rem;
  bottom: 2rem;
  display: flex;
  flex-direction: row;
  padding: 0.5rem;

  &.watching {
    bottom: 2.5rem;
  }

  .text {
    display: inline-flex;
    width: 0;
    overflow: hidden;
    font-size: 0.75rem;
    text-wrap: nowrap;
    transition: width 0.3s var(--n-bezier);
    will-change: width;
  }

  &:hover .text {
    width: var(--floating-button-width, 4.5rem);
    margin-left: 0.5rem;
  }

  @media (width <= 720px) {
    right: 1rem;
    bottom: 1rem;
  }
}
</style>

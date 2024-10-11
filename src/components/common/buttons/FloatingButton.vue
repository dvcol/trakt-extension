<script setup lang="ts">
import { NFlex, NFloatButton, NIcon } from 'naive-ui';

import type { Component, PropType, Transition } from 'vue';

import IconChevronUp from '~/components/icons/IconChevronUp.vue';
import { NavbarService } from '~/services/navbar.service';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
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
const { reverse } = useAppStateStoreRefs();
const { open } = NavbarService;

const emit = defineEmits<{
  (e: 'onClick'): void;
}>();
</script>

<template>
  <Transition name="scale">
    <NFloatButton
      v-if="show"
      class="button"
      :class="{ watching: isWatching, reverse, open }"
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
@use '~/styles/layout' as layout;
@use '~/styles/transition' as transition;
@include transition.scale($scale: 0.6);

.button {
  @include mixin.hover-background;

  right: 2rem;
  bottom: 2rem;
  display: flex;
  flex-direction: row;
  padding: 0.5rem;

  &.watching:not(.reverse) {
    bottom: calc(2.5rem + #{layout.$safe-area-inset-bottom / 1.5});
  }

  &.reverse {
    right: calc(1.5rem + #{layout.$safe-area-inset-right});
    bottom: calc(1rem + #{layout.$safe-bottom-navbar-height});
    transition-delay: 0.5s;

    &.open {
      bottom: calc(1rem + #{layout.$safe-bottom-open-drawer-height});
      transition-delay: 0s;
    }
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

<script setup lang="ts">
import { NFlex, NFloatButton, NIcon } from 'naive-ui';

import type { Component, PropType, Transition } from 'vue';

import IconTopArrow from '~/components/icons/IconTopArrow.vue';

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  icon: {
    type: Object as PropType<Component>,
    required: false,
    default: IconTopArrow,
  },
});

const emit = defineEmits<{
  (e: 'onClick'): void;
}>();
</script>

<template>
  <Transition name="scale">
    <NFloatButton v-if="show" class="button" width="fit-content" @click="emit('onClick')">
      <NFlex size="small" align="center" justify="space-evenly">
        <NIcon :component="icon" />
        <span class="text">
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
    width: 4.5rem;
    margin-left: 0.5rem;
  }

  @media (width <= 720px) {
    right: 1rem;
    bottom: 1rem;
  }
}
</style>

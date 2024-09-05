<script setup lang="ts">
import { NIcon } from 'naive-ui';

import IconLoadingMatrix from '~/components/icons/IconLoadingMatrix.vue';

defineProps({
  size: {
    type: String,
    required: false,
    default: '3rem',
  },
  minHeight: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <NIcon class="loading-container" :style="{ '--min-height': minHeight }" :size="size">
    <IconLoadingMatrix />
  </NIcon>
</template>

<style lang="scss" scoped>
@use '~/styles/layout' as layout;

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: var(--min-height, 0);
  padding-bottom: layout.$header-navbar-height;
  opacity: 1;
  transition: opacity 1s ease-in 0.2s;

  /* Adds 0.2s delay and 1s transition to loading indicator to prevent flashing */
  @starting-style {
    opacity: 0;
  }
}
</style>

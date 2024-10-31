<script setup lang="ts">
import type { PropType } from 'vue';

defineProps({
  html: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: false,
  },
  background: {
    type: String,
    required: false,
  },
  style: {
    type: Object as PropType<Record<string, string>>,
    required: false,
  },
});
</script>

<template>
  <span
    class="html-text"
    :style="{
      '--mark-color-text': color,
      '--mark-color-background': background,
      ...style,
    }"
    v-html="html"
  >
  </span>
</template>

<style scoped lang="scss">
.html-text {
  white-space: pre-wrap;

  :deep(mark) {
    color: var(--mark-color-text, var(--color-primary-lighter));
    background-color: var(--mark-color-background, none);
  }
}
</style>

<script lang="ts" setup>
import { NH2 } from 'naive-ui';

import { type Component, type PropType, useAttrs } from 'vue';

defineProps({
  component: {
    type: Object as PropType<Component>,
    required: false,
    default: NH2,
  },
});

const emit = defineEmits<{
  (e: 'onClick', href?: string): void;
}>();

const attrs = useAttrs() as Record<keyof HTMLAnchorElement, string> | undefined;

const onTitleClick = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  emit('onClick', attrs?.href);
};
</script>

<template>
  <a class="anchor-link" @click="onTitleClick">
    <component :is="component" class="content" :class="{ 'hover-link': !!$attrs.href }">
      <slot />
    </component>
  </a>
</template>

<style lang="scss" scoped>
@use '~/styles/z-index' as layers;

.anchor-link {
  z-index: layers.$in-front;
  color: inherit;
  text-decoration: none;

  .content {
    margin: 0;
  }
}

.hover-link {
  transition: color 0.3s var(--n-bezier);
  will-change: color;

  &:hover {
    color: var(--trakt-red);
  }
}
</style>

<script lang="ts" setup>
import { NH2 } from 'naive-ui';

import { type Component, type PropType, useAttrs } from 'vue';

import { useLinksStore } from '~/stores/settings/links.store';

defineProps({
  component: {
    type: Object as PropType<Component>,
    required: false,
    default: NH2,
  },
  label: {
    type: String,
    required: false,
  },
});

const attrs = useAttrs() as Record<keyof HTMLAnchorElement, string> | undefined;

const { openTab } = useLinksStore();

const onTitleClick = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  openTab(attrs?.href);
};
</script>

<template>
  <a
    class="anchor-link"
    :class="{ 'has-link': !!$attrs.href }"
    :title="label"
    @click="onTitleClick"
  >
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
  outline: none;
  transition: color 0.3s var(--n-bezier);
  will-change: color;

  &:focus-visible:not(.has-link) {
    text-decoration: underline;
    text-underline-offset: 0.2rem;
  }

  .hover-link {
    transition: color 0.3s var(--n-bezier);
    will-change: color;

    &:active,
    &:focus-within,
    &:hover {
      color: var(--trakt-red);
    }
  }

  &:focus-visible.has-link .hover-link {
    color: var(--trakt-red);
  }

  .content {
    margin: 0;
  }
}
</style>

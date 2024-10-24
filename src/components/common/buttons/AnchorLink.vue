<script lang="ts" setup>
import { NH2 } from 'naive-ui';
import { type Component, type PropType, toRefs, useAttrs } from 'vue';

import { useLinksStore } from '~/stores/settings/links.store';

const props = defineProps({
  component: {
    type: Object as PropType<Component>,
    required: false,
    default: NH2,
  },
  label: {
    type: String,
    required: false,
  },
  text: {
    type: Boolean,
    required: false,
  },
  onClick: {
    type: Function as PropType<
      (e: MouseEvent, link: { url?: string; label?: string }) => void
    >,
    required: false,
  },
});

const { onClick, label } = toRefs(props);

const attrs = useAttrs() as Record<keyof HTMLAnchorElement, string> | undefined;

const { openTab } = useLinksStore();

const onTitleClick = (e: MouseEvent) => {
  if (onClick?.value) return onClick.value(e, { url: attrs?.href, label: label?.value });
  e.preventDefault();
  e.stopPropagation();
  openTab(attrs?.href);
};
</script>

<template>
  <a
    v-if="$attrs?.href || onClick"
    class="anchor-link"
    :title="label"
    @click="onTitleClick"
  >
    <component :is="component" v-if="!text && component" class="content hover-link">
      <slot />
    </component>
    <slot v-else />
  </a>
  <template v-else>
    <component :is="component" v-if="!text && component" class="content">
      <slot />
    </component>
    <slot v-else />
  </template>
</template>

<style lang="scss" scoped>
@use '~/styles/z-index' as layers;

.anchor-link {
  z-index: layers.$in-front;
  color: inherit;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  transition: color 0.3s var(--n-bezier);
  will-change: color;

  .hover-link {
    transition:
      color 0.3s var(--n-bezier),
      filter 0.3s var(--n-bezier);
    will-change: color;

    &:active,
    &:focus-within,
    &:hover,
    &:focus-visible {
      color: var(--trakt-color);
    }

    &:active {
      filter: saturate(1.5);
    }
  }

  &:active,
  &:hover,
  &:focus-visible .hover-link {
    color: var(--trakt-color);
  }

  &:active {
    filter: saturate(1.5);
  }

  .content {
    margin: 0;
  }

  .content:not(.hover-link) {
    text-decoration: underline;
    text-underline-offset: 0.2rem;
  }
}
</style>

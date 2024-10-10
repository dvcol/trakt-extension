<script lang="ts" setup>
import { NButton, NIcon, NTooltip } from 'naive-ui';
import { type Component, type PropType, ref } from 'vue';

import type { TooltipProps } from 'naive-ui';

import IconExternalLinkRounded from '~/components/icons/IconExternalLinkRounded.vue';

defineOptions({
  inheritAttrs: false,
});

defineProps({
  href: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  icon: {
    type: Object as PropType<Component | null>,
    required: false,
    default: IconExternalLinkRounded,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  placement: {
    type: String as PropType<TooltipProps['placement']>,
    required: false,
    default: 'bottom',
  },
});

const anchor = ref();
</script>

<template>
  <NTooltip
    class="button-link-external-tooltip"
    :disabled="disabled || !label || !href"
    :show-arrow="false"
    :placement="placement"
    :delay="300"
    trigger="hover"
    :to="anchor"
  >
    <span>{{ label }}</span>
    <template #trigger>
      <a ref="anchor" class="anchor-link" :href="href" :title="title" tabindex="-1">
        <NButton
          tertiary
          :disabled="disabled"
          :focusable="!!href?.length"
          class="external-link"
          :class="{ slotted: $slots.default, 'no-link': !href?.length }"
          v-bind="$attrs"
        >
          <slot />
          <template v-if="icon" #icon>
            <NIcon :component="icon" />
          </template>
        </NButton>
      </a>
    </template>
  </NTooltip>
</template>

<style lang="scss" scoped>
@use '~/styles/z-index' as layers;

.anchor-link {
  z-index: layers.$in-front;
  color: inherit;
  text-decoration: none;

  .no-link {
    cursor: default;
  }

  .external-link {
    height: unset;
    min-height: var(--n-height);
    border: 1px solid transparent;

    &:focus-visible {
      border: var(--n-border-focus);
    }
  }

  .external-link:not(.slotted) {
    width: 2.25rem;
  }

  .slotted {
    i {
      margin-left: calc(0% - var(--n-icon-margin));
    }
  }
}
</style>

<style lang="scss">
.button-link-external-tooltip.button-link-external-tooltip {
  margin-top: 12px;
}
</style>

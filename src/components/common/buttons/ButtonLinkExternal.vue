<script lang="ts" setup>
import { NButton, NIcon, NTooltip } from 'naive-ui';
import { type Component, type PropType, ref } from 'vue';

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
    type: Object as PropType<Component>,
    required: false,
    default: IconExternalLinkRounded,
  },
});

const anchor = ref();
</script>

<template>
  <NTooltip
    class="button-link-external-tooltip"
    :disabled="!label"
    :show-arrow="false"
    placement="bottom"
    :delay="300"
    trigger="hover"
    :to="anchor"
  >
    <span>{{ label }}</span>
    <template #trigger>
      <a ref="anchor" class="anchor-link" :href="href" :title="title">
        <NButton
          tertiary
          class="external-link"
          :class="{ slotted: $slots.default }"
          v-bind="$attrs"
        >
          <slot />
          <template #icon>
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

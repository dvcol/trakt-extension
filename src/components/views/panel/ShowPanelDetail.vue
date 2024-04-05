<script lang="ts" setup>
import { NFlex, NSkeleton, type SkeletonProps } from 'naive-ui';

import type { PropType } from 'vue';

defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number, Boolean],
    required: false,
  },
  grow: {
    type: Boolean,
    required: false,
  },
  skeleton: {
    type: Object as PropType<SkeletonProps>,
    required: false,
  },
});
</script>

<template>
  <NFlex class="detail" :class="{ grow }" align="center">
    <span class="prefix">{{ label }}</span>
    <span v-if="value">{{ value }}</span>
    <NSkeleton v-else round v-bind="skeleton" />
  </NFlex>
</template>

<style lang="scss" scoped>
.prefix {
  min-width: 2.5rem;
  color: var(--white-50);
  font-weight: 600;
  transition: color 0.3s var(--n-bezier);
}

.detail {
  flex: 0 1 30%;

  &:hover .prefix {
    color: var(--white-70);
  }

  &.grow {
    flex: 1 1 auto;
  }
}
</style>

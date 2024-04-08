<script lang="ts" setup>
import { NFlex, NSkeleton, type SkeletonProps } from 'naive-ui';

import type { PropType } from 'vue';
import type { TagLink } from '~/models/tag.model';

import TagLinkComponent from '~/components/common/buttons/TagLink.vue';
import { useExtensionSettingsStore } from '~/stores/settings/extension.store';

defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number, Boolean],
    required: false,
  },
  values: {
    type: Array as PropType<TagLink[]>,
    required: false,
  },
  array: {
    type: Boolean,
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

const { openTab } = useExtensionSettingsStore();
</script>

<template>
  <NFlex class="detail" :class="{ grow, array }" align="center">
    <span class="prefix">{{ label }}</span>
    <template v-if="array">
      <template v-if="values">
        <TagLinkComponent
          v-for="(tag, i) of values"
          :key="i"
          :tag="{ ...tag, round: true }"
          @on-click="openTab"
        />
      </template>
      <template v-else>
        <NSkeleton round v-bind="skeleton" />
        <NSkeleton round v-bind="skeleton" />
        <NSkeleton round v-bind="skeleton" />
      </template>
    </template>
    <template v-else>
      <span v-if="value">{{ value }}</span>
      <NSkeleton v-else round v-bind="skeleton" />
    </template>
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
  flex: 0 1 31.5%;

  &:hover .prefix {
    color: var(--white-70);
  }

  &.grow {
    flex: 1 1 auto;
  }

  &.array {
    flex: 1 1 auto;
    width: 100%;
  }
}
</style>

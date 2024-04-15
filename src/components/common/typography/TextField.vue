<script lang="ts" setup>
import { NFlex, NSkeleton, type SkeletonProps } from 'naive-ui';

import type { PropType } from 'vue';
import type { TagLink } from '~/models/tag.model';

import TagLinkComponent from '~/components/common/buttons/TagLink.vue';
import { useLinksStore } from '~/stores/settings/links.store';

defineProps({
  label: {
    type: String,
    required: true,
  },
  labelWidth: {
    type: String,
    required: false,
    default: '2.5rem',
  },
  value: {
    type: [String, Number, Boolean],
    required: false,
  },
  flex: {
    type: String,
    required: false,
    default: '0 1 31.5%',
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
  pre: {
    type: Boolean,
    required: false,
  },
  skeleton: {
    type: Object as PropType<SkeletonProps>,
    required: false,
  },
});

const { openTab } = useLinksStore();
</script>

<template>
  <NFlex
    class="detail"
    :class="{ grow, array }"
    :style="{ '--prefix-min-width': labelWidth, '--text-flex': flex }"
    align="baseline"
    :wrap="false"
  >
    <span class="prefix">{{ label }}</span>
    <NFlex v-if="array" class="value">
      <template v-if="values !== undefined">
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
    </NFlex>
    <template v-else>
      <span v-if="value !== undefined" class="value" :class="{ pre }">{{ value }}</span>
      <NSkeleton v-else :repeat="pre ? 3 : 0" round v-bind="skeleton" />
    </template>
  </NFlex>
</template>

<style lang="scss" scoped>
.prefix {
  flex: 0 0 auto;
  min-width: var(--prefix-min-width);
  color: var(--white-50);
  font-weight: 600;
  transition: color 0.3s var(--n-bezier);
}

.value {
  flex: 1 1 auto;
}

.detail {
  flex: var(--text-flex);
  align-items: baseline;

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

  .pre {
    white-space: pre-wrap;
  }
}
</style>

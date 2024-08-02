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
  vertical: {
    type: Boolean,
    required: false,
    default: false,
  },
  wrap: {
    type: Boolean,
    required: false,
    default: false,
  },
  align: {
    type: String,
    required: false,
    default: 'baseline',
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    required: false,
    default: 'medium',
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const { openTab } = useLinksStore();
</script>

<template>
  <NFlex
    class="detail"
    :class="{ grow, array, disabled, vertical }"
    :style="{ '--prefix-min-width': labelWidth, '--text-flex': flex }"
    :align="align"
    :wrap="wrap"
    :vertical="vertical"
    :size="size"
  >
    <slot name="label">
      <span class="prefix">{{ label }}</span>
    </slot>
    <slot>
      <NFlex v-if="array" class="value" wrap>
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
    </slot>
  </NFlex>
</template>

<style lang="scss" scoped>
.prefix {
  flex: 0 0 auto;
  align-self: center;
  min-width: var(--prefix-min-width);
  color: var(--white-50);
  font-weight: 600;
  transition: color 0.3s var(--n-bezier);
}

.value {
  flex: 1 1 auto;
  align-self: center;
  min-width: max-content;
}

.disabled {
  .value {
    color: var(--text-color-disabled);
  }
}

.detail {
  flex: var(--text-flex);
  align-items: baseline;
  min-width: max-content;

  &.vertical {
    width: 100%;
  }

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

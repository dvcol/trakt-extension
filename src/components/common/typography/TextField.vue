<script lang="ts" setup>
import { NFlex, NSkeleton, type SkeletonProps } from 'naive-ui';

import type { PropType } from 'vue';
import type { TagLink } from '~/models/tag.model';

import TagLinkComponent from '~/components/common/buttons/TagLink.vue';
import { openLink } from '~/stores/composable/use-links';

defineProps({
  label: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  labelWidth: {
    type: String,
    required: false,
  },
  valueWidth: {
    type: String,
    required: false,
  },
  value: {
    type: [String, Number, Boolean],
    required: false,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
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
  short: {
    type: Boolean,
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
    default: 'center',
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
</script>

<template>
  <NFlex
    class="detail"
    :class="{ grow, array, disabled, vertical }"
    :style="{
      '--prefix-min-width': labelWidth,
      '--text-flex': flex,
      '--value-min-width': valueWidth,
    }"
    :align="align"
    :wrap="wrap"
    :vertical="vertical"
    :size="size"
  >
    <slot name="label">
      <span class="prefix">{{ label }}</span>
    </slot>
    <slot>
      <NFlex v-if="array" wrap align="center" :title="title">
        <template v-if="!loading && values !== undefined">
          <TagLinkComponent
            v-for="(tag, i) of values"
            :key="i"
            :tag="{ ...tag, round: true }"
            @on-click="openLink"
          />
        </template>
        <template v-else>
          <NSkeleton round v-bind="skeleton" />
          <NSkeleton round v-bind="skeleton" />
          <NSkeleton round v-bind="skeleton" />
        </template>
      </NFlex>
      <template v-else>
        <span
          v-if="!loading && value !== undefined"
          class="value"
          :class="{ pre }"
          :title="title"
        >
          {{ value }}
        </span>
        <NSkeleton v-else :repeat="pre ? 3 : 0" round v-bind="skeleton" />
      </template>
    </slot>
  </NFlex>
</template>

<style lang="scss" scoped>
.prefix {
  flex: 0 0 auto;
  align-self: baseline;
  min-width: var(--prefix-min-width, 4rem);
  color: var(--white-50);
  font-weight: 600;
  transition: color 0.3s var(--n-bezier);
}

.value {
  flex: 1 1 auto;
  align-self: center;
  min-width: var(--value-min-width, fit-content);
}

.disabled {
  .value {
    color: var(--text-color-disabled);
  }
}

.detail {
  flex: var(--text-flex);
  align-items: baseline;
  min-width: var(--value-min-width, fit-content);

  &.vertical {
    width: 100%;

    .prefix {
      align-self: center;
      min-width: var(--prefix-min-width, max-content);
    }
  }

  &:active .prefix,
  &:focus-within .prefix,
  &:hover .prefix {
    color: var(--white-70);
  }

  &.grow {
    flex: 1 1 auto;
  }

  &.array {
    flex: 1 1 auto;
    width: 100%;
    min-width: var(--value-min-width, fit-content);

    .prefix {
      align-self: baseline;
    }
  }

  .pre {
    white-space: pre-wrap;
  }
}
</style>

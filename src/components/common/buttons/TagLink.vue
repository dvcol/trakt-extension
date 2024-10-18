<script lang="ts" setup>
import { NIcon, NTag } from 'naive-ui';
import { computed, type PropType, toRefs } from 'vue';

import type { TagLink } from '~/models/tag.model';

const props = defineProps({
  tag: {
    type: Object as PropType<TagLink>,
    required: true,
  },
  short: {
    type: Boolean,
    required: false,
  },
});

const { tag, short } = toRefs(props);

const label = computed(() => {
  if (short.value) return tag?.value?.short || tag?.value?.label;
  return tag?.value?.label;
});

const iconOnly = computed(() => tag?.value?.iconOnly && tag?.value?.icon);

const emit = defineEmits<{
  (e: 'onClick', href?: string): void;
}>();

const onClick = (e: MouseEvent) => {
  if (!tag?.value?.url) return;
  e.preventDefault();
  e.stopPropagation();
  emit('onClick', tag?.value?.url);
};
</script>

<template>
  <a
    class="anchor"
    :href="tag?.url"
    :title="tag?.title ?? tag?.url"
    :data-tag="JSON.stringify(tag)"
    @click="onClick"
  >
    <NTag
      class="tag"
      :class="{
        meta: tag?.meta,
        link: !!tag?.url,
        icon: tag?.icon,
        only: iconOnly,
        square: !tag?.round,
      }"
      size="small"
      v-bind="tag"
    >
      <span v-if="!iconOnly" class="label">{{ label }}</span>
      <template v-if="tag?.icon" #icon>
        <NIcon class="icon" v-bind="tag.iconProps">
          <component :is="tag.icon" v-bind="tag.iconImgProps" />
        </NIcon>
      </template>
    </NTag>
  </a>
</template>

<style lang="scss" scoped>
.anchor {
  outline: none;

  .tag {
    width: fit-content;
    border: 1px solid transparent;

    &.only {
      padding: 0.1rem;
    }

    &.icon.square {
      padding-left: 0.25rem;
    }
  }

  &:focus-visible {
    .tag {
      border: 1px solid var(--n-color-checked);
    }
  }
}

.link {
  cursor: pointer;

  .label {
    transition: filter 0.3s var(--n-bezier);
  }

  .icon {
    padding-left: 0.15rem;
  }

  &:focus-within,
  &:hover {
    background-color: color-mix(
      in srgb,
      var(--n-close-icon-color-hover),
      transparent 90%
    );

    .label {
      filter: saturate(1.5);
    }
  }

  &:active {
    background-color: color-mix(
      in srgb,
      var(--n-close-icon-color-hover),
      transparent 80%
    );

    .label {
      filter: saturate(1.25);
    }
  }
}
</style>

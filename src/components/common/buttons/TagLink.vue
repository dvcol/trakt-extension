<script lang="ts" setup>
import { NTag } from 'naive-ui';
import { type PropType, toRefs } from 'vue';

import type { TagLink } from '~/models/tag.model';

const props = defineProps({
  tag: {
    type: Object as PropType<TagLink>,
    required: true,
  },
});

const { tag } = toRefs(props);

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
  <a :href="tag?.url" @click="onClick">
    <NTag
      class="tag"
      :class="{ meta: tag?.meta, link: !!tag?.url }"
      size="small"
      v-bind="tag"
    >
      <span class="label">{{ tag?.label }}</span>
    </NTag>
  </a>
</template>

<style lang="scss" scoped>
.tag {
  width: fit-content;
}

.link {
  cursor: pointer;

  .label {
    transition: filter 0.3s var(--n-bezier);
  }

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
}
</style>

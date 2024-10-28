<script setup lang="ts">
import { NSkeleton } from 'naive-ui';

import AnchorLink from '~/components/common/buttons/AnchorLink.vue';

const { title, url, label } = defineProps({
  title: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <AnchorLink v-if="title" class="panel-title" :href="url" :title="label">
    {{ title }}
  </AnchorLink>
  <NSkeleton
    v-else
    class="panel-title-skeleton"
    style="width: min(var(--half-width), var(--height-70-dvh))"
    round
  />
</template>

<style scoped lang="scss">
.panel-title,
.panel-title-skeleton {
  text-align: center;

  @media (width < 725px) {
    padding: 0 1.5rem;
  }
}

.panel-title-skeleton {
  height: 1.5rem;
  margin-top: 0.625rem;
}
</style>

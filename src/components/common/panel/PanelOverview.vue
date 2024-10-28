<script setup lang="ts">
import { NFlex, NH4, NSkeleton } from 'naive-ui';

import AnchorLink from '~/components/common/buttons/AnchorLink.vue';

defineProps({
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
  overview: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <NFlex justify="center" align="center" vertical class="overview">
    <AnchorLink v-if="title" class="title" :href="url" :title="label" :component="NH4">
      {{ title }}
    </AnchorLink>
    <NSkeleton v-else class="title-skeleton" style="width: var(--width-40-dvh)" round />

    <div v-if="overview">{{ overview }}</div>
    <NSkeleton v-else style="width: 100%" :repeat="3" :sharp="false" />
  </NFlex>
</template>

<style lang="scss" scoped>
@use '~/styles/z-index' as layers;

.overview {
  width: 100%;

  .title:deep(h4),
  .title-skeleton {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-weight: bold;
    text-align: center;
  }
}
</style>

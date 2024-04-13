<script setup lang="ts">
import { NFlex, NH4, NSkeleton } from 'naive-ui';

import TitleLink from '~/components/common/buttons/TitleLink.vue';
import { useLinksStore } from '~/stores/settings/links.store';

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

const { openTab } = useLinksStore();
</script>

<template>
  <NFlex justify="center" align="center" vertical class="overview">
    <TitleLink
      v-if="title"
      class="title"
      :href="url"
      :title="label"
      :component="NH4"
      @on-click="openTab"
    >
      {{ title }}
    </TitleLink>
    <NSkeleton v-else class="title-skeleton" style="width: 40dvh" round />

    <div v-if="overview">{{ overview }}</div>
    <NSkeleton v-else style="width: 100%" :repeat="3" :sharp="false" />
  </NFlex>
</template>

<style lang="scss" scoped>
@use '~/styles/z-index' as layers;

.anchor-link {
  z-index: layers.$in-front;
  color: inherit;
  text-decoration: none;
}

.hover-link {
  transition: color 0.3s var(--n-bezier);
  will-change: color;

  &:hover {
    color: var(--trakt-red);
  }
}

.overview {
  width: 100%;

  .title:deep(h4),
  .title-skeleton {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }
}
</style>

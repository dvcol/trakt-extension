<script setup lang="ts">
import { NFlex } from 'naive-ui';

import type { TraktSyncRatingValue } from '@dvcol/trakt-http-client/models';

import PanelRating from '~/components/views/panel/PanelRating.vue';
import PanelScore from '~/components/views/panel/PanelScore.vue';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { watchMedia } from '~/utils/window.utils';

defineProps({
  rating: {
    type: Number,
    required: false,
  },
  votes: {
    type: Number,
    required: false,
  },
  score: {
    type: Number,
    required: false,
  },
  loadingRating: {
    type: Boolean,
    required: false,
  },
  loadingScore: {
    type: Boolean,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
});

const emit = defineEmits<{
  (e: 'onScoreEdit', progress: TraktSyncRatingValue): void;
}>();

const { enableRatings } = useExtensionSettingsStoreRefs();

const onScoreEdit = (progress: TraktSyncRatingValue) => emit('onScoreEdit', progress);

const isCompact = watchMedia('(max-width: 725px)');
</script>

<template>
  <NFlex class="statistics-container" justify="space-around">
    <slot v-if="isCompact" />
    <PanelRating
      v-if="enableRatings"
      :loading="loadingRating"
      :votes="votes"
      :rating="rating"
      :url="url"
    />
    <slot v-if="!isCompact" />
    <PanelScore
      v-if="enableRatings"
      :loading="loadingScore"
      :score="score"
      @on-edit="onScoreEdit"
    />
  </NFlex>
</template>

<style scoped lang="scss">
.statistics-container {
  width: 100%;
}
</style>

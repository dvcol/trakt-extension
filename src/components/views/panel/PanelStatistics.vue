<script setup lang="ts">
import { NFlex } from 'naive-ui';

import type { PropType } from 'vue';
import type { RatingItem, RatingValue } from '~/models/rating.model';

import PanelRatings from '~/components/views/panel/PanelRatings.vue';
import PanelScore from '~/components/views/panel/PanelScore.vue';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { watchMedia } from '~/utils/window.utils';

defineProps({
  ratings: {
    type: Array as PropType<RatingItem[]>,
    required: false,
  },
  score: {
    type: Number,
    required: false,
  },
  loadingScore: {
    type: Boolean,
    required: false,
  },
});

const emit = defineEmits<{
  (e: 'onScoreEdit', progress: RatingValue): void;
}>();

const { enableRatings } = useExtensionSettingsStoreRefs();

const onScoreEdit = (progress: RatingValue) => emit('onScoreEdit', progress);

const isCompact = watchMedia('(max-width: 725px)');
</script>

<template>
  <NFlex class="statistics-container" justify="center">
    <div v-if="isCompact" class="slot-container">
      <slot />
    </div>
    <PanelRatings v-if="enableRatings" :ratings="ratings" />
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

.slot-container {
  display: flex;
  flex: 1 1 100%;
}
</style>

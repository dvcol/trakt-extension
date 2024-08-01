<script lang="ts" setup>
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, toRefs } from 'vue';

import ProgressNumber from '~/components/common/numbers/ProgressNumber.vue';

import TextField from '~/components/common/typography/TextField.vue';
import { RatingLabel } from '~/models/rating.model';
import { logger } from '~/stores/settings/log.store';
import { useI18n } from '~/utils/i18n.utils';

const props = defineProps({
  score: {
    type: Number,
    required: false,
  },
  duration: {
    type: Number,
    required: false,
    default: 1000,
  },
  precision: {
    type: Number,
    required: false,
    default: 0,
  },
  loading: {
    type: Boolean,
    required: false,
  },
});

const i18n = useI18n('panel', 'ratings');

const { score } = toRefs(props);

const _score = computed(() => (score?.value ?? 0) * 10);

const _scoreLabel = computed(() => {
  if (!score?.value) return 'not_rated';
  try {
    return RatingLabel[score.value];
  } catch (e) {
    logger.error('RatingLabel', e);
    return 'not_rated';
  }
});
</script>

<template>
  <NFlex class="score-container" align="center" justify="center" vertical size="large">
    <!--  Review  -->
    <TextField
      :label="i18n('label_review')"
      :disabled="!score"
      vertical
      size="small"
      flex="0 1 auto"
    >
      <NSkeleton v-if="loading" class="score-skeleton" text round />
      <span v-else class="score-label" :class="{ disabled: !score }">
        {{ i18n(_scoreLabel, 'common', 'rating') }}
      </span>
    </TextField>

    <!--  Score  -->
    <TextField :label="i18n('label_score')" vertical flex="0 1 auto">
      <ProgressNumber
        :progress="_score"
        :duration="duration"
        :precision="precision"
        :loading="loading"
      />
    </TextField>
  </NFlex>
</template>

<style lang="scss" scoped>
.score-container {
  --duration: 1000ms;

  gap: 1rem;
  padding: 0.5rem;

  .score-label {
    align-self: center;
    padding: 0.25rem 0;

    &.disabled {
      color: var(--text-color-disabled);
    }
  }

  .score-skeleton {
    margin-top: 0.5rem;
  }

  @media (width <= 640px) {
    padding: 0.5rem 25%;
  }
}
</style>

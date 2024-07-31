<script lang="ts" setup>
import { NFlex, NNumberAnimation, NProgress, NStatistic } from 'naive-ui';
import { computed, onMounted, ref, toRefs, watch } from 'vue';

import TextField from '~/components/common/typography/TextField.vue';
import { useI18n } from '~/utils/i18n.utils';

const props = defineProps({
  rating: {
    type: Number,
    required: false,
    default: 0,
  },
  votes: {
    type: Number,
    required: false,
    default: 0,
  },
  score: {
    type: Number,
    required: false,
    default: 0,
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
});

const i18n = useI18n('panel', 'ratings');

const { votes, rating, score } = toRefs(props);

const votesUnit = computed(() => {
  if (votes?.value >= 10000) return 'k';
  if (votes?.value >= 1000000) return 'm';
  if (votes?.value >= 1000000000) return 'b';
  return null;
});
const _votes = computed(() => {
  if (!votes?.value || !votesUnit.value) return votes?.value ?? 0;
  if (votesUnit.value === 'k') return votes.value / 10000;
  if (votesUnit.value === 'm') return votes.value / 1000000;
  if (votesUnit.value === 'b') return votes.value / 1000000000;
  return votes?.value ?? 0;
});

const _rating = computed(() => (rating?.value ?? 0) * 10);
const _ratingProgress = ref(0);

const _score = computed(() => (score?.value ?? 0) * 10);
const _scoreProgress = ref(0);

onMounted(() => {
  watch(
    _rating,
    val => {
      _ratingProgress.value = val;
    },
    { immediate: true },
  );
  watch(
    _score,
    val => {
      _scoreProgress.value = val;
    },
    { immediate: true },
  );
});
</script>

<template>
  <NFlex class="rating-container" align="center" justify="center" vertical>
    <TextField :label="i18n('label_votes')" vertical size="small" flex="0 1 auto">
      <NStatistic class="statistics" tabular-nums>
        <NNumberAnimation
          :from="0"
          :to="_votes"
          :duration="duration"
          :precision="votesUnit ? 2 : 0"
        />
        <span v-if="votesUnit" class="unit">{{ votesUnit }}</span>
      </NStatistic>
    </TextField>
    <TextField :label="i18n('label_rating')" vertical flex="0 1 auto">
      <NProgress
        class="progress"
        type="circle"
        :percentage="_ratingProgress"
        :style="{ '--duration': `${duration}ms` }"
      >
        <NStatistic class="statistics" tabular-nums>
          <NNumberAnimation
            :from="0"
            :to="_rating"
            :duration="duration"
            :precision="precision"
          />
        </NStatistic>
      </NProgress>
    </TextField>
    <TextField :label="i18n('label_score')" vertical flex="0 1 auto">
      <NProgress
        class="progress"
        type="circle"
        :percentage="_scoreProgress"
        :style="{ '--duration': `${duration}ms` }"
      >
        <NStatistic class="statistics" tabular-nums>
          <NNumberAnimation
            :from="0"
            :to="_pStores"
            :duration="duration"
            :precision="precision"
          />
        </NStatistic>
      </NProgress>
    </TextField>
  </NFlex>
</template>

<style lang="scss" scoped>
.rating-container {
  --duration: 1000ms;

  gap: 1rem;
  padding: 1rem;

  .progress {
    width: 3rem;

    :deep(path.n-progress-graph-circle-fill) {
      transition:
        opacity var(--duration) var(--n-bezier),
        stroke var(--duration) var(--n-bezier),
        stroke-dasharray var(--duration) var(--n-bezier);
    }
  }

  .statistics {
    --n-value-font-size: 1rem !important;

    font-variant-numeric: tabular-nums;
    align-self: center;

    .unit {
      padding-left: 0.125rem;
      color: var(--white-50);
    }
  }
}
</style>

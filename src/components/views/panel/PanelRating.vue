<script lang="ts" setup>
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, toRefs } from 'vue';

import ButtonLinkExternal from '~/components/common/buttons/ButtonLinkExternal.vue';
import AnimatedNumber from '~/components/common/numbers/AnimatedNumber.vue';
import ProgressNumber from '~/components/common/numbers/ProgressNumber.vue';

import TextField from '~/components/common/typography/TextField.vue';
import { useI18n } from '~/utils/i18n.utils';

const props = defineProps({
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
  url: {
    type: String,
    required: false,
  },
});

const i18n = useI18n('panel', 'ratings');

const { votes, rating, score } = toRefs(props);

const votesUnit = computed(() => {
  if (votes?.value === undefined) return undefined;
  if (votes?.value >= 10000) return 'k';
  if (votes?.value >= 1000000) return 'm';
  if (votes?.value >= 1000000000) return 'b';
  return undefined;
});

const _votes = computed(() => {
  if (!votes?.value || !votesUnit.value) return votes?.value ?? 0;
  if (votesUnit.value === 'k') return votes.value / 10000;
  if (votesUnit.value === 'm') return votes.value / 1000000;
  if (votesUnit.value === 'b') return votes.value / 1000000000;
  return votes?.value ?? 0;
});

const _rating = computed(() => (rating?.value ?? 0) * 10);
</script>

<template>
  <NFlex class="rating-container" align="center" justify="center" vertical size="large">
    <!--  Vote count  -->

    <TextField
      :label="i18n('label_votes')"
      :disabled="!votes"
      vertical
      size="small"
      flex="0 1 auto"
    >
      <NSkeleton v-if="loading" class="rating-skeleton" text round />
      <AnimatedNumber
        v-else
        :to="_votes"
        :duration="duration"
        :precision="votesUnit ? 2 : 0"
        :unit="votesUnit"
        :disabled="!votes"
        :loading="loading"
      />
    </TextField>

    <!--  Rating progress  -->
    <TextField :label="i18n('label_rating')" vertical flex="0 1 auto">
      <ButtonLinkExternal
        :href="url"
        :title="i18n('calendar', 'common', 'link')"
        :tertiary="false"
        :bordered="false"
        :icon="null"
        ghost
      >
        <ProgressNumber
          :progress="_rating"
          :duration="duration"
          :precision="precision"
          :loading="loading"
        />
      </ButtonLinkExternal>
    </TextField>
  </NFlex>
</template>

<style lang="scss" scoped>
.rating-container {
  --duration: 1000ms;

  gap: 1rem;
  padding: 0.5rem;

  .rating-skeleton {
    margin-top: 0.5rem;
  }

  @media (width <= 640px) {
    padding: 0.5rem 25%;
  }
}
</style>

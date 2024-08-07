<script lang="ts" setup>
import { NFlex, NTooltip } from 'naive-ui';

import { computed, type PropType, toRefs } from 'vue';

import {
  type EpisodeProgress,
  type SeasonProgress,
  type ShowProgress,
  ShowProgressType,
  type ShowProgressTypes,
} from '~/models/list-scroll.model';

import { ProgressType } from '~/models/progress-type.model';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';

const props = defineProps({
  progress: {
    type: Object as PropType<ShowProgress | SeasonProgress | EpisodeProgress>,
    required: false,
  },
  type: {
    type: String as PropType<ShowProgressTypes>,
    required: false,
    default: ShowProgressType.Watched,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
});

const { progress, type, disabled } = toRefs(props);

const { progressType } = useExtensionSettingsStoreRefs();

const percentage = computed(() => {
  if (!progress?.value) return;
  if (
    progressType.value === ProgressType.Season &&
    'lastAired' in progress.value &&
    progress.value?.lastAired
  ) {
    return Math.round(progress.value.lastAired.percentage);
  }
  if (!('percentage' in progress.value)) return;
  return Math.round(progress.value?.percentage);
});

const remaining = computed(() => {
  if (!progress?.value) return;
  if (!progress.value.completed) return;
  if (
    progressType.value === ProgressType.Season &&
    'lastAired' in progress.value &&
    progress.value?.lastAired
  ) {
    return progress.value.lastAired.aired - progress.value.lastAired.completed;
  }
  if (!('aired' in progress.value)) return;
  return progress.value.aired - progress.value.completed;
});

const isCount = computed(() => {
  if (!progress?.value) return false;
  if (!('aired' in progress.value)) return false;
  if (typeof progress.value.completed !== 'number') return false;
  return typeof progress.value?.aired === 'number';
});

const completed = computed(() => {
  if (!progress?.value) return '-';
  if (
    progressType.value === ProgressType.Season &&
    'lastAired' in progress.value &&
    progress.value?.lastAired
  ) {
    return progress.value.lastAired.completed;
  }
  if (!('completed' in progress.value)) return '-';
  return progress.value.completed;
});

const aired = computed(() => {
  if (!progress?.value) return '-';
  if (
    progressType.value === ProgressType.Season &&
    'lastAired' in progress.value &&
    progress.value?.lastAired
  ) {
    return progress.value.lastAired.aired;
  }
  if (!('aired' in progress.value)) return '-';
  return progress.value.aired;
});

const i18n = useI18n('common', 'tooltip', 'progress');
</script>

<template>
  <NTooltip
    class="progress-tooltip"
    :disabled="disabled || (!$slots.label && !progress)"
    :delay="100"
  >
    <slot name="label">
      <NFlex v-if="progress && isCount" vertical align="flex-end">
        <div v-if="'aired' in progress">
          <span class="metric">{{ completed }}</span>
          <span> / </span>
          <span class="metric">{{ aired }}</span>
          <span>&nbsp;</span>
          <span>{{ i18n('episodes') }}</span>
        </div>
        <div>
          <span class="metric">{{ percentage }}</span>
          <span>%</span>
          <span>&nbsp;</span>
          <span>{{ i18n(type) }}</span>
        </div>
        <div v-if="remaining">
          <span class="metric">{{ remaining }}</span>
          <span>&nbsp;</span>
          <span>{{ i18n('remaining') }}</span>
        </div>
      </NFlex>
    </slot>
    <template #trigger>
      <slot />
    </template>
  </NTooltip>
</template>

<style lang="scss" scoped>
.progress-tooltip {
  font-size: 0.8rem;

  .metric {
    color: var(--white);
    font-weight: bolder;
    font-variant-numeric: tabular-nums;
  }
}
</style>

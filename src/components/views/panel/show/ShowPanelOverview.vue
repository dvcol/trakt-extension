<script setup lang="ts">
import { deCapitalise } from '@dvcol/common-utils/common/string';
import { computed, type PropType, toRefs } from 'vue';

import type {
  TraktEpisodeExtended,
  TraktSeasonExtended,
  TraktShowExtended,
} from '@dvcol/trakt-http-client/models';

import PanelOverview from '~/components/common/panel/PanelOverview.vue';
import { useI18n } from '~/utils/i18n.utils';

const props = defineProps({
  episode: {
    type: Object as PropType<TraktEpisodeExtended>,
    required: false,
  },
  season: {
    type: Object as PropType<TraktSeasonExtended>,
    required: false,
  },
  show: {
    type: Object as PropType<TraktShowExtended>,
    required: false,
  },
  mode: {
    type: String as PropType<'show' | 'season' | 'episode'>,
    required: false,
    default: 'episode',
  },
  url: {
    type: String,
    required: false,
  },
});

const { mode, episode, season, show } = toRefs(props);

const i18n = useI18n('panel', 'show', 'oerview');

const title = computed(() => {
  if (mode.value === 'show') {
    if (!show?.value) return;
    if (!show?.value?.title) return '-';
    return deCapitalise(show.value.title);
  }
  if (mode.value === 'season') {
    if (!season?.value) return;
    if (!season?.value?.title) return '-';
    return deCapitalise(season.value.title);
  }
  if (!episode?.value) return;
  if (!episode?.value?.title) return '-';
  return deCapitalise(episode.value?.title);
});

const label = computed(() => i18n(`open_${mode.value}_in_trakt`, 'common', 'tooltip'));

const overview = computed(() => {
  if (mode.value === 'show') {
    if (!show?.value) return;
    return show?.value?.overview || '-';
  }
  if (mode.value === 'season') {
    if (!season?.value) return;
    return (season?.value?.overview ?? show?.value?.overview) || '-';
  }
  if (!episode?.value) return;
  return episode?.value?.overview || '-';
});
</script>

<template>
  <PanelOverview :title="title" :label="label" :url="url" :overview="overview" />
</template>

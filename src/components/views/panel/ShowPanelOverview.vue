<script setup lang="ts">
import { computed, type PropType, toRefs } from 'vue';

import type {
  TraktEpisodeExtended,
  TraktSeasonExtended,
  TraktShowExtended,
} from '@dvcol/trakt-http-client/models';

import PanelOverview from '~/components/views/panel/PanelOverview.vue';
import { ResolveExternalLinks } from '~/settings/external.links';
import { useI18n } from '~/utils';
import { deCapitalise } from '~/utils/string.utils';

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

const url = computed(() => {
  if (mode.value === 'show') {
    if (!show?.value?.ids?.trakt) return;
    return ResolveExternalLinks.search({
      type: 'show',
      source: 'trakt',
      id: show.value.ids.trakt,
    });
  }
  if (mode.value === 'season') {
    if (!season?.value?.ids?.trakt) return;
    return ResolveExternalLinks.search({
      type: 'season',
      source: 'trakt',
      id: season.value.ids.trakt,
    });
  }
  if (!episode?.value?.ids?.trakt) return;
  return ResolveExternalLinks.search({
    type: 'episode',
    source: 'trakt',
    id: episode.value.ids.trakt,
  });
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

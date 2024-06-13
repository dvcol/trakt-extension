<script setup lang="ts">
import { deCapitalise } from '@dvcol/common-utils/common/string';
import { computed, type PropType, toRefs } from 'vue';

import type { TraktMovieExtended } from '@dvcol/trakt-http-client/models';

import PanelOverview from '~/components/views/panel/PanelOverview.vue';

const props = defineProps({
  movie: {
    type: Object as PropType<TraktMovieExtended>,
    required: false,
  },
});

const { movie } = toRefs(props);

const title = computed(() => {
  if (!movie?.value) return;
  if (!movie.value?.tagline) return ' ';
  return deCapitalise(movie.value?.tagline);
});

const overview = computed(() => {
  if (!movie?.value) return;
  return movie?.value?.overview || '-';
});
</script>

<template>
  <PanelOverview :title="title" :overview="overview" />
</template>

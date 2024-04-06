<script setup lang="ts">
import { computed, type PropType, toRefs } from 'vue';

import type { TraktMovieExtended } from '~/models/trakt/trakt-movie.model';

import PanelOverview from '~/components/views/panel/PanelOverview.vue';
import { deCapitalise } from '~/utils/string.utils';

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

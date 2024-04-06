<script setup lang="ts">
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, onMounted, onUnmounted, ref, toRefs, watch } from 'vue';

import type { TraktMovieExtended } from '~/models/trakt/trakt-movie.model';

import TitleLink from '~/components/common/buttons/TitleLink.vue';
import MoviePanelDetails from '~/components/views/panel/MoviePanelDetails.vue';
import MoviePanelOverview from '~/components/views/panel/MoviePanelOverview.vue';
import PanelPoster from '~/components/views/panel/PanelPoster.vue';

import { ResolveExternalLinks } from '~/settings/external.links';
import { useMovieStore } from '~/stores/data/movie.store';
import { useExtensionSettingsStore } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils';
import { deCapitalise } from '~/utils/string.utils';

const props = defineProps({
  movieId: {
    type: String,
    required: true,
  },
});

const { movieId } = toRefs(props);

const movie = ref<TraktMovieExtended>();

const { getMovieRef } = useMovieStore();

const unsub = ref<() => void>();

onMounted(() =>
  watch(
    movieId,
    async id => {
      unsub.value?.();
      if (!id) return;
      unsub.value = getMovieRef(id, movie).unsub;
    },
    { immediate: true },
  ),
);

onUnmounted(() => {
  unsub.value?.();
  movie.value = undefined;
});

const i18n = useI18n('movie', 'panel');

const title = computed(() => {
  if (!movie.value?.title) return;
  return deCapitalise(movie.value.title);
});

const titleUrl = computed(() => {
  if (!movie.value?.ids?.trakt) return;
  return ResolveExternalLinks.search({
    type: 'movie',
    source: 'trakt',
    id: movie.value.ids.trakt,
  });
});

const { openTab } = useExtensionSettingsStore();
</script>

<template>
  <NFlex justify="center" align="center" vertical>
    <TitleLink
      v-if="title"
      class="show-title"
      :href="titleUrl"
      :title="i18n('open_in_trakt', 'common', 'tooltip')"
      @on-click="openTab"
    >
      {{ title }}
    </TitleLink>
    <NSkeleton v-else class="show-title-skeleton" style="width: 50dvh" round />

    <PanelPoster :tmdb="movie?.ids.tmdb" mode="movie" />

    <MoviePanelDetails :movie="movie" />

    <MoviePanelOverview :movie="movie" />
  </NFlex>
</template>

<style lang="scss" scoped>
.show-title-skeleton {
  height: 1.5rem;
  margin-top: 0.625rem;
}
</style>

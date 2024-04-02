<script setup lang="ts">
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, onActivated, onDeactivated, ref, toRefs } from 'vue';

import { useRoute } from 'vue-router';

import type { PosterItem } from '~/models/poster.model';
import type { TraktEpisodeExtended } from '~/models/trakt/trakt-episode.model';
import type { TraktShowExtended } from '~/models/trakt/trakt-show.model';

import type { ImageQuery } from '~/stores/data/image.store';

import PosterComponent from '~/components/common/poster/PosterComponent.vue';
import { type ShowSeasons, useShowStore } from '~/stores/data/show.store';

const props = defineProps({
  showId: {
    type: String,
    required: false,
  },
  seasonNumber: {
    type: String,
    required: false,
  },
  episodeNumber: {
    type: String,
    required: false,
  },
});

const { getShowRef, getShowSeasonsRef, getShowEpisodeRef } = useShowStore();

const show = ref<TraktShowExtended>();
const seasons = ref<ShowSeasons>();
const episode = ref<TraktEpisodeExtended>();

const { showId, seasonNumber, episodeNumber } = toRefs(props);

const seasonNb = computed(() => {
  if (!seasonNumber?.value) return;
  const _seasonNumber = Number(seasonNumber.value);
  if (Number.isNaN(_seasonNumber)) return;
  return _seasonNumber;
});

const episodeNb = computed(() => {
  if (!episodeNumber?.value) return;
  const _episodeNumber = Number(episodeNumber.value);
  if (Number.isNaN(_episodeNumber)) return;
  return _episodeNumber;
});

const size = computed(() => window?.innerWidth ?? 800 / 2);

const { query } = useRoute();
const posterItem = computed<PosterItem | undefined>(() => {
  const poster = query.poster?.toString();
  if (poster) return { poster } satisfies PosterItem;

  const tmdb = query.tmdb?.toString();
  if (!tmdb) return;
  const imageQuery: ImageQuery = {
    id: tmdb,
    season: seasonNb.value,
    episode: episodeNb.value,
    type: 'show',
  };
  if (episodeNb.value) imageQuery.type = 'episode';
  else if (seasonNb.value) imageQuery.type = 'season';

  return {
    posterRef: ref(),
    getPosterQuery: () => imageQuery,
  };
});

const subscriptions = new Set<() => void>();

onActivated(() => {
  if (showId?.value) subscriptions.add(getShowRef(showId.value, show).unsub);
  if (showId?.value) subscriptions.add(getShowSeasonsRef(showId.value, seasons).unsub);
  if (showId?.value && seasonNb?.value && episodeNb?.value) {
    subscriptions.add(
      getShowEpisodeRef(
        {
          id: showId.value,
          season: seasonNb.value,
          episode: episodeNb.value,
        },
        episode,
      ).unsub,
    );
  }
});

onDeactivated(() => {
  subscriptions.forEach(unsub => unsub());
  subscriptions.clear();
  show.value = undefined;
  seasons.value = undefined;
  episode.value = undefined;
});
</script>

<template>
  <NFlex justify="center" align="center" vertical>
    <NFlex v-if="posterItem" class="poster-container">
      <PosterComponent :item="posterItem" :episode="!!episodeNumber" :size="size" />
    </NFlex>
    <div>show {{ showId }}</div>
    <div v-if="show">show : {{ show?.title }}</div>
    <NSkeleton v-else />
    <div>season {{ seasonNumber }}</div>
    <div v-if="seasons">season {{ Object.keys(seasons) }}</div>
    <NSkeleton v-else />
    <div>episode {{ episodeNumber }}</div>
    <div v-if="episode">episode {{ episode?.title }}</div>
    <NSkeleton v-else
  /></NFlex>
</template>

<style lang="scss" scoped>
.poster-container {
  --poster-width: 50dvw;
  --poster-height: calc(var(--poster-width) * (9 / 16));
}
</style>

<script setup lang="ts">
import { NFlex, NSkeleton } from 'naive-ui';
import { onActivated, onDeactivated, ref, toRefs } from 'vue';

import type { TraktEpisodeExtended } from '~/models/trakt/trakt-episode.model';
import type { TraktShowExtended } from '~/models/trakt/trakt-show.model';

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

const subscriptions = new Set<() => void>();

onActivated(() => {
  if (showId?.value) subscriptions.add(getShowRef(showId.value, show).unsub);
  if (showId?.value) subscriptions.add(getShowSeasonsRef(showId.value, seasons).unsub);
  if (showId?.value && seasonNumber?.value && episodeNumber?.value) {
    subscriptions.add(
      getShowEpisodeRef(
        {
          id: showId.value,
          season: Number(seasonNumber.value),
          episode: Number(episodeNumber.value),
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
  <NFlex justify="center" align="center"> </NFlex>
  <div>show {{ showId }}</div>
  <div v-if="show">show : {{ show?.title }}</div>
  <NSkeleton v-else />
  <div>season {{ seasonNumber }}</div>
  <div v-if="seasons">season {{ Object.keys(seasons) }}</div>
  <NSkeleton v-else />
  <div>episode {{ episodeNumber }}</div>
  <div v-if="episode">episode {{ episode?.title }}</div>
  <NSkeleton v-else />
</template>

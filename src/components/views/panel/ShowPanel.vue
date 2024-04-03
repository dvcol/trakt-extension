<script setup lang="ts">
import { NFlex, NH2, NH4, NSkeleton } from 'naive-ui';
import { computed, onMounted, onUnmounted, ref, toRefs, Transition, watch } from 'vue';

import type { TraktEpisodeExtended } from '~/models/trakt/trakt-episode.model';
import type { TraktShowExtended } from '~/models/trakt/trakt-show.model';

import ShowPanelPicker from '~/components/views/panel/ShowPanelPicker.vue';
import ShowPanelPoster from '~/components/views/panel/ShowPanelPoster.vue';
import { type ShowSeasons, useShowStore } from '~/stores/data/show.store';
import { deCapitalise } from '~/utils/string.utils';

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
  if (seasonNumber?.value === undefined) return;
  const _seasonNumber = Number(seasonNumber.value);
  if (Number.isNaN(_seasonNumber)) return;
  return _seasonNumber;
});

const episodeNb = computed(() => {
  if (episodeNumber?.value === undefined) return;
  const _episodeNumber = Number(episodeNumber.value);
  if (Number.isNaN(_episodeNumber)) return;
  return _episodeNumber;
});

const showTitle = computed(() => {
  if (!show.value?.title) return;
  return deCapitalise(show.value.title);
});

const episodeTitle = computed(() => {
  if (!episode.value?.title) return;
  return deCapitalise(episode.value?.title);
});

const subscriptions = new Set<() => void>();

const watchData = () =>
  watch(
    props,
    (next, prev) => {
      if (next.showId !== prev?.showId) {
        show.value = undefined;
        seasons.value = undefined;
        episode.value = undefined;
      } else if (next.episodeNumber !== prev?.episodeNumber) {
        episode.value = undefined;
      } else if (next.seasonNumber !== prev?.seasonNumber) {
        episode.value = undefined;
      }

      if (showId?.value) subscriptions.add(getShowRef(showId.value, show).unsub);
      if (showId?.value)
        subscriptions.add(getShowSeasonsRef(showId.value, seasons).unsub);
      if (
        showId?.value &&
        seasonNb?.value !== undefined &&
        episodeNb?.value !== undefined
      ) {
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
    },
    { immediate: true },
  );

onMounted(() => {
  subscriptions.add(watchData());
});

onUnmounted(() => {
  subscriptions.forEach(unsub => unsub());
  subscriptions.clear();
});
</script>

<template>
  <NFlex justify="center" align="center" vertical>
    <NH2 v-if="showTitle" class="show-title">{{ showTitle }}</NH2>
    <NSkeleton v-else />

    <ShowPanelPicker :seasons="seasons" :season-number="seasonNb" />

    <ShowPanelPoster
      :show-id="show?.ids.tmdb"
      :season-number="seasonNb"
      :episode-number="episodeNb"
    />

    <Transition name="scale" mode="out-in">
      <NFlex
        v-if="episodeNumber !== undefined"
        :key="`season-${seasonNb}-episode-${episodeNb}`"
        justify="center"
        align="center"
        vertical
        class="episode-container"
      >
        <NH4 v-if="episodeTitle" class="episode-title">{{ episodeTitle }}</NH4>
        <NSkeleton v-else />

        <div v-if="episode">{{ episode?.overview }}</div>
        <NSkeleton v-else />
      </NFlex>
    </Transition>
  </NFlex>
</template>

<style lang="scss" scoped>
@use '~/styles/transition' as transition;
@include transition.scale;

.poster-container {
  --poster-height: calc(50dvw * (9 / 16));
  --poster-width: calc(var(--poster-height) * (2 / 3));

  &.landscape {
    --poster-width: 50dvw;
    --poster-height: calc(var(--poster-width) * (9 / 16));
  }

  position: relative;
  border: 1px solid var(--border-white);
  box-shadow: var(--image-box-shadow);
}

.show-title {
  margin-bottom: 0.5rem;
}

.episode {
  &-container {
    width: 100%;
  }

  &-title {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }
}
</style>

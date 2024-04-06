<script setup lang="ts">
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, onMounted, onUnmounted, ref, toRefs, watch } from 'vue';

import type {
  TraktEpisodeExtended,
  TraktEpisodeShort,
} from '~/models/trakt/trakt-episode.model';
import type { TraktShowExtended } from '~/models/trakt/trakt-show.model';

import TitleLink from '~/components/common/buttons/TitleLink.vue';
import PanelPoster from '~/components/views/panel/PanelPoster.vue';
import ShowPanelDetails from '~/components/views/panel/ShowPanelDetails.vue';
import ShowPanelOverview from '~/components/views/panel/ShowPanelOverview.vue';
import ShowPanelPicker from '~/components/views/panel/ShowPanelPicker.vue';
import { ResolveExternalLinks } from '~/settings/external.links';
import { type ShowSeasons, useShowStore } from '~/stores/data/show.store';
import { useExtensionSettingsStore } from '~/stores/settings/extension.store';
import { deCapitalise } from '~/utils/string.utils';

const props = defineProps({
  showId: {
    type: String,
    required: true,
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

const show = ref<TraktShowExtended>();
const seasons = ref<ShowSeasons>();
const episodes = ref<TraktEpisodeShort[]>();
const episode = ref<TraktEpisodeExtended>();

const { showId, seasonNumber, episodeNumber } = toRefs(props);

const { getShowProgress } = useShowStore();

const progress = computed(() => {
  if (!showId?.value) return;
  return getShowProgress(showId.value).value;
});

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

const panelType = computed<'show' | 'season' | 'episode'>(() => {
  if (episodeNb?.value !== undefined && seasonNb?.value !== undefined) return 'episode';
  if (seasonNb?.value !== undefined) return 'season';
  return 'show';
});

const season = computed(() => {
  if (seasonNb?.value === undefined) return;
  return seasons.value?.[seasonNb.value];
});

const title = computed(() => {
  if (!show.value?.title) return;
  return deCapitalise(show.value.title);
});

const titleUrl = computed(() => {
  if (!show.value?.ids?.trakt) return;
  return ResolveExternalLinks.search({
    type: 'show',
    source: 'trakt',
    id: show.value.ids.trakt,
  });
});

const subscriptions = new Set<() => void>();

const { getShowRef, getShowSeasonsRef, getShowSeasonEpisodesRef, getShowEpisodeRef } =
  useShowStore();

const watchData = () =>
  watch(
    [showId, seasonNb, episodeNb],
    (next, prev) => {
      // show changes
      if (next.at(0) !== prev?.at(0)) {
        show.value = undefined;
        seasons.value = undefined;
        episodes.value = undefined;
        episode.value = undefined;
      }
      // season changes
      else if (next.at(1) !== prev?.at(1)) {
        episode.value = undefined;
        episodes.value = undefined;
      }
      // episode changes
      else if (next.at(2) !== prev?.at(2)) {
        episode.value = undefined;
      }

      if (showId?.value) {
        subscriptions.add(getShowRef(showId.value, show).unsub);
        subscriptions.add(getShowSeasonsRef(showId.value, seasons).unsub);

        if (seasonNb?.value !== undefined) {
          subscriptions.add(
            getShowSeasonEpisodesRef(showId.value, seasonNb?.value, episodes).unsub,
          );
        }

        if (seasonNb?.value !== undefined && episodeNb?.value !== undefined) {
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

const { openTab } = useExtensionSettingsStore();
</script>

<template>
  <NFlex justify="center" align="center" vertical>
    <TitleLink v-if="title" class="show-title" :href="titleUrl" @on-click="openTab">
      {{ title }}
    </TitleLink>
    <NSkeleton v-else class="show-title-skeleton" style="width: 50dvh" round />

    <PanelPoster
      :tmdb="show?.ids.tmdb"
      :mode="panelType"
      :portait="panelType === 'season'"
      :season-number="seasonNb"
      :episode-number="episodeNb"
    />

    <ShowPanelDetails
      :show="show"
      :season="season"
      :episode="episode"
      :mode="panelType"
    />

    <ShowPanelPicker :seasons="seasons" :episodes="episodes" :mode="panelType" />

    <ShowPanelOverview
      :episode="episode"
      :season="season"
      :show="show"
      :mode="panelType"
    />
  </NFlex>
</template>

<style lang="scss" scoped>
.show-title-skeleton {
  height: 1.5rem;
  margin-top: 0.625rem;
}
</style>

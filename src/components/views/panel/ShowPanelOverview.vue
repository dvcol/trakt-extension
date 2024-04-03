<script setup lang="ts">
import { NFlex, NH4, NSkeleton } from 'naive-ui';
import { computed, onMounted, type PropType, ref, toRefs, Transition } from 'vue';

import type { TraktEpisodeExtended } from '~/models/trakt/trakt-episode.model';

import type { TraktSeasonExtended } from '~/models/trakt/trakt-season.model';

import type { TraktShowExtended } from '~/models/trakt/trakt-show.model';

import TitleLink from '~/components/common/buttons/TitleLink.vue';
import { ResolveExternalLinks } from '~/settings/external.links';
import { useExtensionSettingsStore } from '~/stores/settings/extension.store';
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

const title = computed(() => {
  if (mode.value === 'show') {
    if (!show?.value?.title) return;
    return deCapitalise(show.value.title);
  }
  if (mode.value === 'season') {
    if (!season?.value?.title) return;
    return deCapitalise(season.value.title);
  }
  if (!episode?.value?.title) return;
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

const overview = computed(() => {
  if (mode.value === 'show') {
    if (!show?.value) return;
    return show?.value?.overview ?? '-';
  }
  if (mode.value === 'season') {
    if (!season?.value) return;
    return season?.value?.overview ?? show?.value?.overview ?? '-';
  }
  if (!episode?.value) return;
  return episode?.value?.overview ?? '-';
});

const key = computed(() => `episode-${episode?.value?.ids.trakt}`);

const { openTab } = useExtensionSettingsStore();

const transition = ref('none');

onMounted(() => {
  setTimeout(() => {
    transition.value = 'scale';
  }, 100);
});
</script>

<template>
  <Transition :name="transition" mode="out-in">
    <NFlex :key="key" justify="center" align="center" vertical class="overview container">
      <TitleLink
        v-if="title"
        class="title"
        :href="url"
        :component="NH4"
        @on-click="openTab"
      >
        {{ title }}
      </TitleLink>
      <NSkeleton v-else class="title-skeleton" style="width: 40dvh" round />

      <div v-if="overview">{{ overview }}</div>
      <template v-else>
        <NSkeleton style="width: 100%" />
        <NSkeleton style="width: 100%" />
        <NSkeleton style="width: 100%" />
      </template>
    </NFlex>
  </Transition>
</template>

<style lang="scss" scoped>
@use '~/styles/z-index' as layers;
@use '~/styles/transition' as transition;
@include transition.scale;

.anchor-link {
  z-index: layers.$in-front;
  color: inherit;
  text-decoration: none;
}

.hover-link {
  transition: color 0.3s var(--n-bezier);
  will-change: color;

  &:hover {
    color: var(--trakt-red);
  }
}

.overview {
  .container {
    width: 100%;
  }

  .title:deep(h4),
  .title-skeleton {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }
}
</style>

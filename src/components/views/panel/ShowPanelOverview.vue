<script setup lang="ts">
import { NFlex, NH4, NSkeleton } from 'naive-ui';
import { computed, onMounted, type PropType, ref, toRefs, Transition } from 'vue';

import type { TraktEpisodeExtended } from '~/models/trakt/trakt-episode.model';

import TitleLink from '~/components/common/buttons/TitleLink.vue';
import { ResolveExternalLinks } from '~/settings/external.links';
import { useExtensionSettingsStore } from '~/stores/settings/extension.store';
import { deCapitalise } from '~/utils/string.utils';

const props = defineProps({
  episode: {
    type: Object as PropType<TraktEpisodeExtended>,
    required: false,
  },
});

const { episode } = toRefs(props);

const episodeTitle = computed(() => {
  if (!episode?.value?.title) return;
  return deCapitalise(episode.value?.title);
});

const episodeUrl = computed(() => {
  if (!episode?.value?.ids?.trakt) return;
  return ResolveExternalLinks.search({
    type: 'episode',
    source: 'trakt',
    id: episode.value.ids.trakt,
  });
});

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
    <NFlex
      :key="`episode-${episode?.ids.trakt}`"
      justify="center"
      align="center"
      vertical
      class="episode-container"
    >
      <TitleLink
        v-if="episodeTitle"
        class="episode-title"
        :href="episodeUrl"
        :component="NH4"
        @on-click="openTab"
      >
        {{ episodeTitle }}
      </TitleLink>
      <NSkeleton v-else class="episode-title-skeleton" style="width: 40dvh" round />

      <div v-if="episode">{{ episode?.overview }}</div>
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

.episode {
  &-container {
    width: 100%;
  }

  &-title:deep(h4),
  &-title-skeleton {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }
}
</style>

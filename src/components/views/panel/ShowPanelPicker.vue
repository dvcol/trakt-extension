<script lang="ts" setup>
import { NFlex, NSkeleton } from 'naive-ui';

import { computed, type PropType, toRefs } from 'vue';

import { useRoute } from 'vue-router';

import type { TraktEpisodeShort } from '~/models/trakt/trakt-episode.model';
import type { ShowSeasons } from '~/stores/data/show.store';

import ButtonLink from '~/components/common/buttons/ButtonLink.vue';

const props = defineProps({
  seasons: {
    type: Object as PropType<ShowSeasons>,
    required: false,
  },
  episodes: {
    type: Array as PropType<TraktEpisodeShort[]>,
    required: false,
  },
  mode: {
    type: String as PropType<'show' | 'season' | 'episode'>,
    required: false,
    default: 'episode',
  },
});

const { seasons, episodes } = toRefs(props);

const { meta } = useRoute();

const seasonsLinks = computed(() => {
  if (!seasons?.value) return;
  return Object.entries(seasons.value).map(([_number, _season]) => ({
    number: Number(_number),
    link: { name: `${meta.base}-season`, params: { seasonNumber: _number } },
  }));
});

const episodeLinks = computed(() => {
  if (!episodes?.value) return;
  if (!episodes?.value?.length) return [];
  return episodes.value.map(_episode => ({
    number: _episode.number,
    link: {
      name: `${meta.base}-episode`,
      params: { episodeNumber: _episode.number, seasonNumber: _episode.season },
    },
  }));
});
</script>

<template>
  <NFlex vertical class="picker" justify="center">
    <NFlex align="baseline" size="small">
      <span class="prefix">Season</span>

      <NFlex class="numbers" size="small">
        <template v-if="seasonsLinks?.length">
          <ButtonLink
            v-for="{ link, number } in seasonsLinks"
            :key="`season-${number}`"
            :link="{ to: link }"
          >
            {{ number }}
          </ButtonLink>
        </template>
        <NSkeleton v-else-if="!seasonsLinks" class="skeleton" round />
        <span v-else>none</span>
      </NFlex>
    </NFlex>

    <NFlex v-if="mode !== 'show'" align="baseline" size="small">
      <span class="prefix">Episode</span>

      <NFlex class="numbers" size="small">
        <template v-if="episodeLinks?.length">
          <ButtonLink
            v-for="{ link, number } in episodeLinks"
            :key="`episode-${ number }`"
            v-slot="{ isActive }"
            :link="{ to: link }"
            class="link"
          >
            <span class="label" :class="{ active: isActive }">{{ number }}</span>
          </ButtonLink>
        </template>
        <NSkeleton v-else-if="!episodeLinks" class="skeleton" round />
        <span v-else>none</span>
      </NFlex>
    </NFlex>
  </NFlex>
</template>

<style lang="scss" scoped>
.picker {
  width: 100%;
  margin-bottom: 1rem;

  .prefix {
    min-width: 3.75rem;
    margin-right: 0.25rem;
    color: var(--vt-c-white-soft);
  }

  .numbers {
    flex: 1 1;
    gap: 8px 6px;
    align-self: center;
  }

  .skeleton {
    margin: 0.375rem 0;
  }
}
</style>

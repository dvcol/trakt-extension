<script lang="ts" setup>
import { NFlex, NSkeleton } from 'naive-ui';

import { computed, type PropType, toRefs } from 'vue';

import { useRoute } from 'vue-router';

import type { ShowSeasons } from '~/stores/data/show.store';

import ButtonLink from '~/components/common/buttons/ButtonLink.vue';

const props = defineProps({
  seasons: {
    type: Object as PropType<ShowSeasons>,
    required: false,
  },
  seasonNumber: {
    type: Number,
    required: false,
  },
});

const { seasons, seasonNumber } = toRefs(props);

const { meta } = useRoute();
const seasonsLinks = computed(() => {
  if (!seasons?.value) return [];
  return Object.entries(seasons.value).map(([_number, _season]) => ({
    number: Number(_number),
    link: { name: `${meta.base}-season`, params: { seasonNumber: _number } },
  }));
});

const episodeLinks = computed(() => {
  if (!seasons?.value || seasonNumber?.value === undefined) return [];
  const _episodes = seasons.value[seasonNumber.value]?.episodes;
  if (!_episodes.length) return [];
  return _episodes.map(_episode => ({
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
    <NFlex v-if="seasonsLinks" align="baseline" size="small">
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
        <span v-else>none</span>
      </NFlex>
    </NFlex>
    <NSkeleton v-else />

    <NFlex v-if="episodeLinks" align="baseline" size="small">
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
        <span v-else>none</span>
      </NFlex>
    </NFlex>
    <NSkeleton v-else />
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
  }
}
</style>

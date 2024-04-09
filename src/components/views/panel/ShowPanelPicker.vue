<script lang="ts" setup>
import { NFlex, NSkeleton } from 'naive-ui';

import { computed, type PropType, toRefs } from 'vue';

import { RouterLink, useRoute } from 'vue-router';

import type { ShowProgress } from '~/models/list-scroll.model';
import type { TraktEpisodeShort } from '~/models/trakt/trakt-episode.model';
import type { ShowSeasons } from '~/stores/data/show.store';

import ButtonLink from '~/components/common/buttons/ButtonLink.vue';
import { useI18n } from '~/utils';

const props = defineProps({
  mode: {
    type: String as PropType<'show' | 'season' | 'episode'>,
    required: false,
    default: 'episode',
  },
  seasons: {
    type: Object as PropType<ShowSeasons>,
    required: false,
  },
  episodes: {
    type: Array as PropType<TraktEpisodeShort[]>,
    required: false,
  },
  progress: {
    type: Object as PropType<ShowProgress>,
    required: false,
  },
  collection: {
    type: Object as PropType<ShowProgress>,
    required: false,
  },
});

const { seasons, episodes, progress, collection } = toRefs(props);

const { meta } = useRoute();

const showLink = computed(() => ({ name: `${meta.base}-show` }));
const seasonLink = computed(() => ({ name: `${meta.base}-season` }));

const seasonsLinks = computed(() => {
  if (!seasons?.value) return;
  return Object.entries(seasons.value).map(([_number, _season]) => {
    const number = Number(_number);
    return {
      number,
      link: { name: `${meta.base}-season`, params: { seasonNumber: _number } },
      finished: progress?.value?.seasons?.find(s => s.number === number)?.finished,
      collected: collection?.value?.seasons?.find(s => s.number === number)?.finished,
    };
  });
});

const episodeLinks = computed(() => {
  if (!episodes?.value) return;
  if (!episodes?.value?.length) return [];
  return episodes.value.map((_episode, i) => ({
    number: _episode.number,
    link: {
      name: `${meta.base}-episode`,
      params: { episodeNumber: _episode.number, seasonNumber: _episode.season },
    },
    finished: progress?.value?.seasons
      ?.find(s => s.number === _episode.season)
      ?.episodes?.find(e => e.number === _episode.number)?.completed,
    collected: collection?.value?.seasons
      ?.find(s => s.number === _episode.season)
      ?.episodes?.find(e => e.number === _episode.number)?.completed,
  }));
});

const i18n = useI18n('panel', 'picker');
</script>

<template>
  <NFlex vertical class="picker" justify="center">
    <NFlex align="baseline" size="small" class="row">
      <RouterLink class="prefix" :to="showLink">
        <span>{{ i18n('season') }}</span>
      </RouterLink>

      <NFlex class="numbers" size="small">
        <template v-if="seasonsLinks?.length">
          <ButtonLink
            v-for="{ link, number, finished, collected } in seasonsLinks"
            :key="`season-${number}`"
            :link="{ to: link }"
            :button="{ type: finished ? 'primary' : collected ? 'info' : undefined }"
          >
            {{ number }}
          </ButtonLink>
        </template>
        <NSkeleton v-else-if="!seasonsLinks" class="skeleton" round />
        <span v-else class="no-data">{{ i18n('none') }}</span>
      </NFlex>
    </NFlex>

    <NFlex v-if="mode !== 'show'" align="baseline" size="small" class="row">
      <RouterLink class="prefix" :to="seasonLink">
        <span>{{ i18n('episode') }}</span>
      </RouterLink>

      <NFlex class="numbers episodes" size="small">
        <template v-if="episodeLinks?.length">
          <ButtonLink
            v-for="{ link, number, finished, collected } in episodeLinks"
            :key="`episode-${ number }`"
            v-slot="{ isActive }"
            :link="{ to: link }"
            :button="{ type: finished ? 'primary' : collected ? 'info' : undefined }"
          >
            <span class="label" :class="{ active: isActive }">{{ number }}</span>
          </ButtonLink>
        </template>
        <NSkeleton v-else-if="!episodeLinks" class="skeleton" round />
        <span v-else class="no-data">{{ i18n('none') }}</span>
      </NFlex>
    </NFlex>
  </NFlex>
</template>

<style lang="scss" scoped>
.picker {
  width: 100%;

  .prefix {
    min-width: 3.75rem;
    margin: 1px 0.25rem auto 0;
    color: var(--white-50);
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s var(--n-bezier);
  }

  .row:hover {
    .prefix {
      color: var(--white-70);
    }
  }

  .numbers {
    flex: 1 1;
    gap: 8px 6px;
    align-self: center;
  }

  .skeleton {
    margin: 0.375rem 0;
  }

  .no-data {
    margin: 0 0.5rem;
    color: var(--vt-c-text-dark-2);
  }
}
</style>

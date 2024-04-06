<script lang="ts" setup>
import { computed, type PropType, toRefs } from 'vue';

import type { TagLink } from '~/models/tag.model';
import type { TraktApiIds } from '~/models/trakt/trakt-id.model';

import IconIMDb from '~/components/icons/IconIMDb.vue';
import IconTMDb from '~/components/icons/IconTMDb.vue';
import IconTVDb from '~/components/icons/IconTVDb.vue';
import IconTrakt from '~/components/icons/IconTrakt.vue';
import PanelDetail from '~/components/views/panel/PanelDetail.vue';

import { ResolveExternalLinks } from '~/settings/external.links';
import { useI18n } from '~/utils';

const props = defineProps({
  ids: {
    type: Object as PropType<Partial<TraktApiIds>>,
    required: false,
  },
  mode: {
    type: String as PropType<'movie' | 'show' | 'season' | 'episode' | 'person'>,
    required: false,
    default: 'episode',
  },
  season: {
    type: Number,
    required: false,
  },
  episode: {
    type: Number,
    required: false,
  },
});

const { ids, mode, season, episode } = toRefs(props);

const i18n = useI18n('panel', 'detail');

const links = computed(() => {
  if (!ids?.value) return;
  const _links: TagLink[] = [];
  if (ids.value.trakt) {
    _links.push({
      label: 'Trakt',
      url: ResolveExternalLinks.search({
        type: mode.value,
        source: 'trakt',
        id: ids.value.trakt,
      }),
      icon: IconTrakt,
      iconProps: {
        style: {
          '--trakt-icon-path': 'white',
          '--trakt-icon-circle': 'transparent',
        },
      },
    });
  }
  if (ids.value.imdb) {
    _links.push({
      label: 'IMDb',
      url: ResolveExternalLinks.imdb(ids.value.imdb),
      icon: IconIMDb,
      iconProps: {
        style: {
          '--imdb-icon-background': 'white',
          '--imdb-icon-height': '575',
        },
      },
    });
  }
  if (ids.value.tmdb) {
    _links.push({
      label: 'TMDb',
      url: ResolveExternalLinks.tmdb({
        id: ids.value.tmdb,
        type: mode.value,
        season: season?.value,
        episode: episode?.value,
      }),
      icon: IconTMDb,
      iconProps: {
        style: {
          '--tmdb-icon-background': 'white',
        },
      },
    });
  }
  if (ids.value.tvdb) {
    _links.push({
      label: 'TVDb',
      url: ResolveExternalLinks.tvdb(ids.value.tvdb, mode.value),
      icon: IconTVDb,
      iconProps: {
        style: {
          '--tvdb-icon-background': 'white',
        },
      },
    });
  }
  return _links;
});
</script>

<template>
  <PanelDetail
    :label="i18n('links')"
    :values="links"
    :skeleton="{ width: '3rem' }"
    array
  />
</template>

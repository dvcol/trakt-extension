<script lang="ts" setup>
import { computed, type PropType, toRefs } from 'vue';

import type { PanelTag } from '~/models/tag.model';
import type { TraktApiIds } from '~/models/trakt/trakt-id.model';

import IconExternalLink from '~/components/icons/IconExternalLink.vue';
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
  const _links: PanelTag[] = [];
  if (ids.value.trakt) {
    _links.push({
      label: 'Trakt',
      url: ResolveExternalLinks.search({
        type: mode.value,
        source: 'trakt',
        id: ids.value.trakt,
      }),
      icon: IconExternalLink,
    });
  }
  if (ids.value.imdb) {
    _links.push({
      label: 'IMDb',
      url: ResolveExternalLinks.imdb(ids.value.imdb),
      icon: IconExternalLink,
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
      icon: IconExternalLink,
    });
  }
  if (ids.value.tvdb) {
    _links.push({
      label: 'TVDb',
      url: ResolveExternalLinks.tvdb(ids.value.tvdb, mode.value),
      icon: IconExternalLink,
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

<script lang="ts" setup>
import { computed, type PropType, toRefs } from 'vue';

import type { TagLink } from '~/models/tag.model';
import type { TraktApiIds } from '~/models/trakt/trakt-id.model';

import IconExternalLinkRounded from '~/components/icons/IconExternalLinkRounded.vue';
import IconIMDb from '~/components/icons/IconIMDb.vue';
import IconTMDb from '~/components/icons/IconTMDb.vue';
import IconTVDb from '~/components/icons/IconTVDb.vue';
import IconTrakt from '~/components/icons/IconTrakt.vue';
import PanelDetail from '~/components/views/panel/PanelDetail.vue';

import { ResolveExternalLinks } from '~/settings/external.links';
import { resolveLinkUrl, useLinksStore } from '~/stores/settings/links.store';
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
  alias: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
});

const { ids, mode, season, episode, alias, title } = toRefs(props);

const i18n = useI18n('panel', 'detail');

const labelKey = computed(() => {
  const label = ['show', 'episode', 'season'].includes(mode.value)
    ? `open_${mode.value}_in`
    : 'open_in';
  return (source: string) => {
    return i18n({ key: label, substitutions: [source] }, 'common', 'tooltip');
  };
});

const { getLinks } = useLinksStore();

const customLinksTemplate = getLinks(mode);
const customLinks = computed(() => {
  if (!customLinksTemplate.value) return;
  return customLinksTemplate.value.map(link => ({
    ...link,
    url: resolveLinkUrl(link.url, {
      ...ids?.value,
      alias: alias?.value,
      season: season?.value,
      episode: episode?.value,
      title: title?.value,
    }),
    icon: IconExternalLinkRounded,
  }));
});

const links = computed(() => {
  if (!ids?.value) return;
  const _links: TagLink[] = [];
  if (ids.value.trakt) {
    _links.push({
      label: 'Trakt',
      title: labelKey.value('Trakt.tv'),
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
      title: labelKey.value('IMDb.com'),
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
      title: labelKey.value('TheMovieDb.org'),
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
      title: labelKey.value('TheTVDB.com'),
      url: ResolveExternalLinks.tvdb(ids.value.tvdb, mode.value),
      icon: IconTVDb,
      iconProps: {
        style: {
          '--tvdb-icon-background': 'white',
        },
      },
    });
  }
  if (customLinks.value) _links.push(...customLinks.value);
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

<script lang="ts" setup>
import { computed, type PropType, toRefs } from 'vue';

import type { SimklIdsExtended } from '@dvcol/simkl-http-client/models';
import type { TraktApiIds } from '@dvcol/trakt-http-client/models';
import type { TagLink } from '~/models/tag.model';

import TextField from '~/components/common/typography/TextField.vue';
import IconExternalLinkRounded from '~/components/icons/IconExternalLinkRounded.vue';

import {
  DataSource,
  getIconFromSource,
  getLabelKeyFromSource,
  getSortedDataSources,
  getUrlFromSource,
  isKnownSource,
} from '~/models/source.model';
import { resolveLinkUrl, useLinksStore } from '~/stores/settings/links.store';
import { useI18n } from '~/utils/i18n.utils';

const props = defineProps({
  ids: {
    type: Object as PropType<Partial<TraktApiIds & SimklIdsExtended>>,
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
  getSortedDataSources(ids.value)
    .filter(isKnownSource)
    .forEach(key => {
      _links[key === DataSource.Trakt ? 'unshift' : 'push']({
        label: i18n(key, 'common', 'source', 'name'),
        title: getLabelKeyFromSource(i18n, key, mode.value),
        url: getUrlFromSource(key, ids.value, {
          type: mode.value,
          season: season?.value,
          episode: episode?.value,
        }),
        icon: getIconFromSource(key),
      });
    });
  if (customLinks.value) _links.push(...customLinks.value);
  return _links;
});
</script>

<template>
  <TextField :label="i18n('links')" :values="links" :skeleton="{ width: '3rem' }" array />
</template>

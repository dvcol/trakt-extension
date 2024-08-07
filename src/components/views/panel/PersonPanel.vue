<script setup lang="ts">
import { deCapitalise } from '@dvcol/common-utils/common/string';
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, onMounted, onUnmounted, ref, toRefs, watch } from 'vue';

import type { TraktPersonExtended } from '@dvcol/trakt-http-client/models';

import TitleLink from '~/components/common/buttons/TitleLink.vue';
import PanelPoster from '~/components/views/panel/PanelPoster.vue';
import PersonPanelDetails from '~/components/views/panel/PersonPanelDetails.vue';
import PersonPanelOverview from '~/components/views/panel/PersonPanelOverview.vue';

import { ResolveExternalLinks } from '~/settings/external.links';
import { usePersonStore } from '~/stores/data/person.store';
import { useLinksStore } from '~/stores/settings/links.store';
import { useI18n } from '~/utils/i18n.utils';

const props = defineProps({
  personId: {
    type: String,
    required: true,
  },
});

const { personId } = toRefs(props);

const person = ref<TraktPersonExtended>();

const { getPersonRef } = usePersonStore();

const unsub = ref<() => void>();

onMounted(() =>
  watch(
    personId,
    async id => {
      unsub.value?.();
      if (!id) return;
      unsub.value = getPersonRef(id, person).unsub;
    },
    { immediate: true },
  ),
);

onUnmounted(() => {
  unsub.value?.();
  person.value = undefined;
});

const i18n = useI18n('panel', 'person');

const title = computed(() => {
  if (!person.value?.name) return;
  return deCapitalise(person.value?.name);
});

const titleUrl = computed(() => {
  if (!person.value?.ids?.trakt) return;
  return ResolveExternalLinks.search({
    type: 'person',
    source: 'trakt',
    id: person.value.ids.trakt,
  });
});

const { openTab } = useLinksStore();
</script>

<template>
  <NFlex justify="center" align="center" vertical>
    <TitleLink
      v-if="title"
      class="show-title"
      :href="titleUrl"
      :title="i18n('open_in_trakt', 'common', 'tooltip')"
      @on-click="openTab"
    >
      {{ title }}
    </TitleLink>
    <NSkeleton
      v-else
      class="show-title-skeleton"
      style="width: var(--half-height)"
      round
    />

    <PanelPoster :tmdb="person?.ids.tmdb" mode="person" portait />

    <PersonPanelDetails :person="person" />

    <PersonPanelOverview :person="person" />
  </NFlex>
</template>

<style lang="scss" scoped>
.show-title-skeleton {
  height: 1.5rem;
  margin-top: 0.625rem;
}
</style>

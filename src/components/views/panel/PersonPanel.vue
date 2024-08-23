<script setup lang="ts">
import { deCapitalise } from '@dvcol/common-utils/common/string';
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, onMounted, onUnmounted, ref, toRefs, watch } from 'vue';

import type { TraktPersonExtended } from '@dvcol/trakt-http-client/models';

import AnchorLink from '~/components/common/buttons/AnchorLink.vue';
import PanelPoster from '~/components/views/panel/PanelPoster.vue';
import PersonPanelDetails from '~/components/views/panel/PersonPanelDetails.vue';
import PersonPanelOverview from '~/components/views/panel/PersonPanelOverview.vue';

import { ResolveExternalLinks } from '~/settings/external.links';
import { usePersonStore } from '~/stores/data/person.store';
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
</script>

<template>
  <NFlex class="panel-container" justify="center" align="center" vertical>
    <AnchorLink
      v-if="title"
      class="show-title"
      :href="titleUrl"
      :title="i18n('open_in_trakt', 'common', 'tooltip')"
    >
      {{ title }}
    </AnchorLink>
    <NSkeleton
      v-else
      class="show-title-skeleton"
      style="width: var(--half-height)"
      round
    />

    <PanelPoster :tmdb="person?.ids.tmdb" mode="person" portait :link="titleUrl" />

    <PersonPanelDetails :person="person" />

    <PersonPanelOverview :person="person" />
  </NFlex>
</template>

<style lang="scss" scoped>
.panel-container {
  & > div:nth-child(n + 3) {
    @media (width > 1200px) {
      max-width: min(var(--half-width), var(--height-70-dvh));
    }
  }

  .show-title-skeleton {
    height: 1.5rem;
    margin-top: 0.625rem;
  }
}
</style>

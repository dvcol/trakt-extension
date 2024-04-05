<script setup lang="ts">
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, onMounted, onUnmounted, ref, toRefs, watch } from 'vue';

import type { TraktPersonExtended } from '~/models/trakt/trakt-people.model';

import TitleLink from '~/components/common/buttons/TitleLink.vue';
import PanelPoster from '~/components/views/panel/PanelPoster.vue';

import { ResolveExternalLinks } from '~/settings/external.links';
import { usePersonStore } from '~/stores/data/person.store';
import { useExtensionSettingsStore } from '~/stores/settings/extension.store';
import { deCapitalise } from '~/utils/string.utils';

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

const { openTab } = useExtensionSettingsStore();
</script>

<template>
  <NFlex justify="center" align="center" vertical>
    <TitleLink v-if="title" class="show-title" :href="titleUrl" @on-click="openTab">
      {{ title }}
    </TitleLink>
    <NSkeleton v-else class="show-title-skeleton" style="width: 50dvh" round />

    <PanelPoster :tmdb="person?.ids.tmdb" mode="person" portait />
  </NFlex>
</template>

<style lang="scss" scoped>
‡ .show-title:deep(h2),
.show-title-skeleton {
  margin-bottom: 1rem;
}

.show-title-skeleton {
  height: 1.5rem;
  margin-top: 0.625rem;
}
</style>

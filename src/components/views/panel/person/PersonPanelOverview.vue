<script setup lang="ts">
import { computed, type PropType, toRefs } from 'vue';

import type { TraktPersonExtended } from '@dvcol/trakt-http-client/models';

import PanelOverview from '~/components/common/panel/PanelOverview.vue';

const props = defineProps({
  person: {
    type: Object as PropType<TraktPersonExtended>,
    required: false,
  },
});

const { person } = toRefs(props);

const biography = computed(() => {
  if (!person?.value) return;
  return person?.value?.biography || '-';
});
</script>

<template>
  <PanelOverview title=" " :overview="biography" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { ErrorService } from '~/services/error.service';
import { TraktService } from '~/services/trakt.service';

const debugProvider = ref<HTMLDivElement>();

onMounted(() => {
  console.info('DebugProvider mounted', debugProvider.value);
  Object.defineProperty(debugProvider.value, 'trakt', {
    value: TraktService,
  });
  Object.defineProperty(debugProvider.value, 'error', {
    value: ErrorService,
  });
});
</script>

<template>
  <div id="debug-provider" ref="debugProvider" hidden />
</template>

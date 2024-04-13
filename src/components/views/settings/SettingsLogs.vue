<script lang="ts" setup>
import { NFlex } from 'naive-ui';

import { useExtensionSettingsStore } from '~/stores/settings/extension.store';

const { logLevel } = useExtensionSettingsStore();
</script>

<template>
  <NFlex> This is the logs card : {{ logLevel }} </NFlex>
</template>

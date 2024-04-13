<script lang="ts" setup>
import { NFlex } from 'naive-ui';

import { useExtensionSettingsStore } from '~/stores/settings/extension.store';

const { progressTab } = useExtensionSettingsStore();
</script>

<template>
  <NFlex> This is the tabs card : {{ progressTab }} </NFlex>
</template>

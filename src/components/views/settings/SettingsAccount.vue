<script lang="ts" setup>
import { NFlex } from 'naive-ui';

import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';

const { user, userSetting } = useUserSettingsStoreRefs();
</script>

<template>
  <NFlex>
    <div>This is the account card : {{ user }}</div>
    <div>{{ JSON.stringify(userSetting, undefined, 2) }}</div>
  </NFlex>
</template>

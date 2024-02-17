<script lang="ts" setup>
import { NButton, NFlex } from 'naive-ui';

import { onMounted } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { useI18n } from '~/utils';
import { createTab } from '~/utils/browser/browser.utils';

const i18n = useI18n('global');

const route = useRoute();
const router = useRouter();

const { isAuthenticated } = useAuthSettingsStoreRefs();

onMounted(() => {
  console.info('authResponse:', route.query);
  const { redirect } = route.query;
  if (redirect) {
    console.info('redirect:', redirect, isAuthenticated.value);
    router.push(route.query.redirect as string);
  }
});

const redirect = async () => {
  try {
    const response = await TraktService.approve();
    await createTab({ url: response.url });
  } catch (error) {
    console.error('Error:', error);
  }
};
</script>

<template>
  <NFlex vertical justify="space-around" align="center">
    <img alt="Vue logo" class="logo" src="/assets/logo.svg" width="125" height="125" />
    <span>This is a login component</span>
    <NButton @click="redirect">Redirect Url</NButton>
  </NFlex>
</template>

<style lang="scss" scoped>
.logo {
  display: block;
  margin: 2rem auto;
}
</style>

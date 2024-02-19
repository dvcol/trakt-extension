<script lang="ts" setup>
import { NButton, NFlex } from 'naive-ui';

import { onMounted, watch } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { useI18n } from '~/utils';

const i18n = useI18n('global');

const route = useRoute();
const router = useRouter();

const { isAuthenticated } = useAuthSettingsStoreRefs();

onMounted(() => {
  watch(isAuthenticated, authenticated => {
    const { redirect } = route.query;
    if (authenticated && redirect) router.push(route.query.redirect as string);
  });
});

const onRedirect = async () => {
  try {
    await TraktService.approve();
  } catch (error) {
    console.error('Error:', error);
  }
};
</script>

<template>
  <NFlex vertical justify="space-around" align="center">
    <img alt="Vue logo" class="logo" src="/assets/logo.svg" width="125" height="125" />
    <span>This is a login component</span>
    <NButton @click="onRedirect">Redirect Url</NButton>
  </NFlex>
</template>

<style lang="scss" scoped>
.logo {
  display: block;
  margin: 2rem auto;
}
</style>

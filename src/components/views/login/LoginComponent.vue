<script lang="ts" setup>
import { NButton, NFlex } from 'naive-ui';

import { onMounted, ref } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import type { LoginAuthResponse } from '~/models/login/login-auth-response';

import type { TraktDeviceAuthentication } from '~/models/trakt/trakt-authentication.model';

import { isLoginAuthResponseSuccess } from '~/models/login/login-auth-response';

import { traktService } from '~/services/trakt-client/trakt-client.service';
import { useI18n } from '~/utils';

type LoginQueryParams = {
  redirect: string;
} & LoginAuthResponse;

const i18n = useI18n('global');

const authResponse = ref<LoginQueryParams>();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  authResponse.value = route.query as LoginQueryParams;

  if (isLoginAuthResponseSuccess(authResponse.value)) {
    const response = await traktService.exchangeCodeForToken(authResponse.value.code);
    if (authResponse.value.redirect) await router.push(authResponse.value.redirect);
  }
});

const auth = ref<TraktDeviceAuthentication>();

const redirect = async () => {
  try {
    const response = await traktService.redirectToAuthentication();
    await chrome.tabs.create({ url: response.url });
  } catch (error) {
    console.error('Error:', error);
  }
};

const login = async () => {
  const device = await traktService.getDeviceCode();
  auth.value = device;

  const response = await traktService.pollWithDeviceCode(device);
  console.info('response', response);
};

const writeToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
</script>

<template>
  <NFlex vertical justify="space-around" align="center">
    <img alt="Vue logo" class="logo" src="/assets/logo.svg" width="125" height="125" />
    <span>This is a login component</span>
    <NButton @click="redirect">Redirect Url</NButton>
    <NButton @click="login">Generate Codes</NButton>
    <template v-if="auth">
      {{ JSON.stringify(auth, undefined, 2) }}
      <NButton @click="writeToClipboard(auth.user_code)">{{ auth.user_code }}</NButton>
      <NButton tag="a" :href="auth.verification_url" target="_blank">{{ auth.verification_url }}</NButton>
    </template>
  </NFlex>
</template>

<style lang="scss" scoped>
.logo {
  display: block;
  margin: 2rem auto;
}
</style>

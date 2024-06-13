<script lang="ts" setup>
import { NCheckbox, NFlex, NText } from 'naive-ui';

import { onMounted, ref, Transition, watch } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import GridBackground from '~/components/common/background/GridBackground.vue';
import LoginCard from '~/components/views/login/LoginCard.vue';
import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { logger } from '~/stores/settings/log.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('login');

const route = useRoute();
const router = useRouter();

const { isAuthenticated } = useAuthSettingsStoreRefs();

const onRedirect = (authenticated = isAuthenticated.value) => {
  if (!authenticated) return;
  return router.push((route.query.redirect as string) ?? '/');
};

const show = ref(false);

onMounted(() => {
  onRedirect();
  watch(isAuthenticated, authenticated => {
    onRedirect(authenticated);
  });
  show.value = !isAuthenticated.value;
});

const signUp = ref(false);
const useSession = ref(false);

const onSignIn = async () => {
  try {
    await TraktService.approve({
      signup: signUp.value,
      prompt: !useSession.value,
    });
  } catch (error) {
    logger.error('Error:', error);
  }
};
</script>

<template>
  <NFlex vertical justify="space-around" align="center">
    <GridBackground :size="20" />

    <Transition name="scale" mode="in-out">
      <div v-if="show">
        <LoginCard @on-sign-in="onSignIn">
          <NFlex class="checkboxes" vertical>
            <NCheckbox v-model:checked="signUp">
              {{ i18n('checkbox__sign_up_for') }}
              <NText type="info">{{ i18n('checkbox__new_account') }}</NText>
              !
            </NCheckbox>
            <NCheckbox v-model:checked="useSession">
              {{ i18n('checkbox__use') }}
              <NText type="info">{{ i18n('checkbox__active_user') }}</NText>
              {{ i18n('checkbox__session') }}
            </NCheckbox>
          </NFlex>
        </LoginCard>
      </div>
    </Transition>
  </NFlex>
</template>

<style lang="scss" scoped>
@use '~/styles/transition' as transition;
@include transition.scale(0.9);

.checkboxes {
  align-self: center;
  width: fit-content;
  margin-bottom: 1.5rem;
}
</style>

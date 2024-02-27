<script lang="ts" setup>
import { NButton, NCard, NCheckbox, NFlex, NH4, NText } from 'naive-ui';

import { onMounted, ref, Transition, watch } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import GridBackground from '~/components/common/background/GridBackground.vue';
import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { useI18n } from '~/utils';

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
    console.error('Error:', error);
  }
};
</script>

<template>
  <NFlex vertical justify="space-around" align="center">
    <GridBackground :size="20" />

    <Transition name="scale" mode="in-out">
      <div v-if="show">
        <NCard class="card" :title="i18n('title')" hoverable>
          <template #cover>
            <div class="spacer" />
            <img
              alt="Vue logo"
              class="logo"
              src="/assets/logo.svg"
              width="125"
              height="125"
            />
          </template>

          <NFlex vertical>
            <NH4 class="title" prefix="bar">{{ i18n('sub_title') }}</NH4>

            <NButton class="button" @click="onSignIn">{{ i18n('sign_in') }}</NButton>

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
          </NFlex>
        </NCard>
      </div>
    </Transition>
  </NFlex>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;
@use '~/styles/transition' as transition;
@include transition.scale(0.9);

.card {
  @include mixin.hover-background;

  padding: 0 1.5rem;

  .spacer {
    height: 60px;
  }

  .logo {
    position: absolute;
    top: -50px;
    left: 0;
  }

  :deep(.n-card-header) {
    font-size: 3em;
    text-align: center;
  }

  .title {
    margin: 0;
    padding: 1rem;
    background: rgb(99 226 184 / 5%);
    transition: background 0.5s;
    will-change: background;
  }

  .button {
    margin: 2rem;
  }

  .checkboxes {
    align-self: center;
    width: fit-content;
    margin-bottom: 1.5rem;
  }

  &:hover {
    .title {
      background: rgb(99 226 184 / 9%);
    }
  }
}
</style>

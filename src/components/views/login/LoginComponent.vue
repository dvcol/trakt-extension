<script lang="ts" setup>
import { Config } from '@dvcol/trakt-http-client/config';
import {
  type CancellablePolling,
  type TraktDeviceAuthentication,
  TraktPollingExpiredError,
} from '@dvcol/trakt-http-client/models';
import {
  NButton,
  NCheckbox,
  NFlex,
  NIcon,
  NInput,
  NInputGroup,
  NProgress,
  NText,
} from 'naive-ui';

import { computed, onActivated, onDeactivated, ref, Transition, watch } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import GridBackground from '~/components/common/background/GridBackground.vue';
import IconClipboard from '~/components/icons/IconClipboard.vue';
import LoginCard from '~/components/views/login/LoginCard.vue';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { openLink } from '~/stores/composable/use-links';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
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

onActivated(() => {
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
    Logger.error('Error:', error);
  }
};

const useCode = ref(false);
const auth = ref<TraktDeviceAuthentication>();
const code = computed(() => auth.value?.user_code);
const getCodes = async () => {
  try {
    auth.value = await TraktService.device.code();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive call
    await polling();
  } catch (error) {
    Logger.error('Failed to login with Trakt.tv');
    Logger.error(error);
  }
};

const poll = ref<CancellablePolling>();
const progressInterval = ref<ReturnType<typeof setInterval>>();
const progress = ref(0);
const progressRounded = computed(() => {
  if (!auth.value?.expires_in) return 0;
  return Math.round((progress.value / auth.value.expires_in) * 100) || 1;
});

const interval = computed(() => {
  if (!useCode.value) return 0;
  return (auth.value?.interval ?? 0) * 1000;
});

const onCancel = () => {
  if (poll.value) poll.value.cancel();
  if (progressInterval.value) clearInterval(progressInterval.value);
  progress.value = 0;
};

const polling = async () => {
  if (!auth.value) return;
  if (poll.value) onCancel();
  try {
    poll.value = TraktService.device.poll(auth.value);
    progressInterval.value = setInterval(() => {
      progress.value += 1;
    }, 1000);
    const traktAuth = await poll.value;
    await TraktService.device.login(traktAuth);
  } catch (error) {
    Logger.error('Failed to login with Trakt.tv');
    Logger.error(error);
    if (error instanceof TraktPollingExpiredError) await getCodes();
  }
};

const copyToClipBoard = () => {
  if (!code.value?.length) return;
  navigator.clipboard.writeText(code.value);
  NotificationService.message.success(i18n('notification__copied'));
};

const openVerification = () => {
  const _code = auth.value?.user_code;
  openLink(_code ? Config.Verification.code(_code) : Config.Verification.Url, {
    active: false,
  });
};

const onCheckedToggle = (checked: boolean) => {
  if (checked) return getCodes();
  onCancel();
};

const onClick = () => {
  if (useCode.value) return openVerification();
  return onSignIn();
};

onActivated(() => {
  if (useCode.value) getCodes();
});
onDeactivated(() => onCancel());
</script>

<template>
  <NFlex class="login-container" vertical justify="space-around" align="center">
    <GridBackground :size="20" />

    <Transition name="scale" mode="in-out">
      <div v-if="show">
        <LoginCard
          :message="useCode ? i18n('polling_title') : undefined"
          :interval="interval"
          min-width="16.25rem"
          @on-sign-in="onClick"
        >
          <NFlex class="checkboxes" vertical>
            <NCheckbox v-model:checked="signUp" :disabled="useCode">
              {{ i18n('checkbox__sign_up_for') }}
              <NText type="info">{{ i18n('checkbox__new_account') }}</NText>
              !
            </NCheckbox>
            <NCheckbox v-model:checked="useSession" :disabled="useCode">
              {{ i18n('checkbox__use') }}
              <NText type="info">{{ i18n('checkbox__active_user') }}</NText>
              {{ i18n('checkbox__session') }}
            </NCheckbox>

            <NCheckbox v-model:checked="useCode" @update:checked="onCheckedToggle">
              {{ i18n('checkbox__use') }}
              <NText type="info">{{ i18n('checkbox__device_code') }}</NText>
              {{ i18n('checkbox__login') }}
            </NCheckbox>
            <div class="code-input" :class="{ show: useCode }">
              <NInputGroup class="input-group">
                <NInput
                  :style="{ '--n-border-radius': '3px 0 0 0' }"
                  :value="code"
                  placeholder="Code"
                  :disabled="!code?.length"
                  readonly
                />
                <NButton
                  tertiary
                  type="primary"
                  :disabled="!code?.length"
                  @click="copyToClipBoard"
                >
                  <template #icon>
                    <NIcon :component="IconClipboard" />
                  </template>
                </NButton>
                <NProgress
                  v-if="code?.length"
                  class="timeout-code"
                  type="line"
                  status="success"
                  :percentage="progressRounded"
                  :show-indicator="false"
                  :theme-overrides="{
                    railHeight: 'var(--rail-height)',
                  }"
                />
              </NInputGroup>
            </div>
          </NFlex>
        </LoginCard>
      </div>
    </Transition>
  </NFlex>
</template>

<style lang="scss" scoped>
@use '~/styles/layout' as layout;
@use '~/styles/transition' as transition;
@include transition.scale(0.9);

.login-container {
  margin-top: layout.$header-navbar-height;
}

.checkboxes {
  align-self: center;
  width: fit-content;
  margin-bottom: 1.5rem;
}

.code-input {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 0;
  opacity: 0;
  scale: 0.95;
  transition:
    height 1s ease,
    scale 0.5s ease,
    opacity 0.5s ease;

  &.show {
    height: 3rem;
    opacity: 1;
    scale: 1;
    transition:
      height 0.5s ease,
      scale 0.5s ease,
      opacity 0.75s ease;
  }

  .input-group {
    position: relative;
    justify-content: center;
  }

  .timeout-code {
    --rail-height: 2px;

    position: absolute;
    bottom: calc(var(--rail-height) * -1);
    left: 1px; // border width
    border-radius: 0;

    :deep(.n-progress-graph-line-rail),
    :deep(.n-progress-graph-line-rail .n-progress-graph-line-fill) {
      border-radius: 0;
    }
  }
}
</style>

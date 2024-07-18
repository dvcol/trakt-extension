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

import {
  computed,
  onActivated,
  onDeactivated,
  onMounted,
  ref,
  Transition,
  watch,
} from 'vue';

import { useRoute, useRouter } from 'vue-router';

import GridBackground from '~/components/common/background/GridBackground.vue';
import IconClipboard from '~/components/icons/IconClipboard.vue';
import LoginCard from '~/components/views/login/LoginCard.vue';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { useLinksStore } from '~/stores/settings/links.store';
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

const { openTab } = useLinksStore();

const useCode = ref(false);
const auth = ref<TraktDeviceAuthentication>();
const code = computed(() => auth.value?.user_code);
const getCodes = async () => {
  try {
    auth.value = await TraktService.device.code();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive call
    await polling();
  } catch (error) {
    logger.error('Failed to login with Trakt.tv');
    logger.error(error);
  }
};

const poll = ref<CancellablePolling>();
const progress = ref(0);
const progressInterval = ref<ReturnType<typeof setInterval>>();

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
    progressInterval.value = setInterval(
      () => {
        progress.value += 0.1;
      },
      (auth.value.expires_in / 100) * 100,
    );
    const traktAuth = await poll.value;
    await TraktService.device.login(traktAuth);
  } catch (error) {
    logger.error('Failed to login with Trakt.tv');
    logger.error(error);
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
  openTab(_code ? Config.verification.code(_code) : Config.verification.url, true);
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
  <NFlex vertical justify="space-around" align="center">
    <GridBackground :size="20" />

    <Transition name="scale" mode="in-out">
      <div v-if="show">
        <LoginCard @on-sign-in="onClick">
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
                  :percentage="progress"
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
@use '~/styles/transition' as transition;
@include transition.scale(0.9);

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
  }

  .timeout-code {
    --rail-height: 2px;

    position: absolute;
    bottom: calc(var(--rail-height) * -1);
    border-radius: 0;
  }
}
</style>

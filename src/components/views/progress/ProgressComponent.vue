<script lang="ts" setup>
import { NFlex, type NotificationReactive } from 'naive-ui';
import { onMounted, ref, Transition, watch } from 'vue';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import { useBackToTop } from '~/components/common/buttons/use-back-to-top';
import ListScroll from '~/components/common/list/ListScroll.vue';

import LoginCard from '~/components/views/login/LoginCard.vue';
import { usePanelItem } from '~/components/views/panel/use-panel-item';
import { NotificationService } from '~/services/notification.service';
import { ExternaLinks } from '~/settings/external.links';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useProgressStore, useProgressStoreRefs } from '~/stores/data/progress.store';
import { useWatchingStoreRefs } from '~/stores/data/watching.store';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
import { useI18n } from '~/utils/i18n.utils';
import { watchUserChange } from '~/utils/store.utils';
import { getSessionUser } from '~/utils/trakt-service.utils';

const i18n = useI18n('progress');

const { footerOpen, panelOpen, panelDirty } = useAppStateStoreRefs();

const { progress, loading, loggedOut } = useProgressStoreRefs();
const { fetchProgress, clearState } = useProgressStore();
const { isWatching } = useWatchingStoreRefs();

onMounted(() => {
  watch(panelOpen, async value => {
    if (!value && panelDirty.value) await fetchProgress();
  });
  watch(isWatching, async () => {
    if (panelOpen.value) return;
    await fetchProgress();
  });
});

const { user } = useUserSettingsStoreRefs();
const unSub = ref<() => void>();
const notification = ref<NotificationReactive>();

watchUserChange({
  fetch: fetchProgress,
  clear: clearState,
  activated: async () => {
    await fetchProgress();
    unSub.value = watch(
      user,
      async _user => {
        const session = await getSessionUser();
        if (notification.value) notification.value.destroy();
        if (!session || _user === session) return;
        notification.value = NotificationService.userMismatch({ user: _user, session });
      },
      {
        immediate: true,
      },
    );
  },
  deactivated: () => {
    unSub.value?.();
    notification.value?.destroy();
  },
});

const { scrolled, listRef, onClick } = useBackToTop();
const { onItemClick } = usePanelItem();
</script>

<template>
  <div class="container">
    <Transition name="fade" mode="out-in">
      <NFlex v-if="loggedOut" justify="center" align="center" vertical>
        <LoginCard
          class="logout"
          :message="i18n('logout__cookies') + '\n' + i18n('logout__trakt')"
          :button-props="{
            tag: 'a',
            href: ExternaLinks.trakt.production,
          }"
          hide-logo
        />
      </NFlex>
      <ListScroll
        v-else
        ref="listRef"
        :loading="loading"
        :items="progress"
        backdrop
        hide-date
        show-progress
        show-collected
        @on-scroll="scrolled = true"
        @on-scroll-top="scrolled = false"
        @on-item-click="onItemClick"
      >
        <template #default>
          <!-- TODO buttons here-->
        </template>
      </ListScroll>
    </Transition>

    <FloatingButton :show="!footerOpen && scrolled" @on-click="onClick">
      {{ i18n('back_to_top', 'common', 'button') }}
    </FloatingButton>
  </div>
</template>

<style lang="scss" scoped>
@use '~/styles/transition' as transition;
@include transition.fade($transition: 0.5s);

.container {
  width: 100%;
  height: 100%;

  .logout {
    width: fit-content;

    :deep(.button) {
      padding: 0.25rem 1rem;
    }
  }
}
</style>

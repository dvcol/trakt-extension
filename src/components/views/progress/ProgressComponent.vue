<script lang="ts" setup>
import { NFlex } from 'naive-ui';
import { onMounted, Transition, watch } from 'vue';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import { useBackToTop } from '~/components/common/buttons/use-back-to-top';
import ListScroll from '~/components/common/list/ListScroll.vue';

import LoginCard from '~/components/views/login/LoginCard.vue';
import { usePanelItem } from '~/components/views/panel/use-panel-item';
import { ExternaLinks } from '~/settings/external.links';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useProgressStore, useProgressStoreRefs } from '~/stores/data/progress.store';
import { useI18n } from '~/utils/i18n.utils';
import { watchUserChange } from '~/utils/store.utils';

const i18n = useI18n('progress');

const { footerOpen, panelOpen, panelDirty } = useAppStateStoreRefs();

const { progress, loading, loggedOut } = useProgressStoreRefs();
const { fetchProgress, clearState } = useProgressStore();

watchUserChange({
  fetch: fetchProgress,
  clear: clearState,
});

onMounted(() => {
  watch(panelOpen, async value => {
    if (!value && panelDirty.value) await fetchProgress();
  });
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

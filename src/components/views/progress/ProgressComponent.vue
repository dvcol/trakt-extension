<script lang="ts" setup>
import { NFlex } from 'naive-ui';
import { onMounted, toRefs, Transition, watch } from 'vue';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import { useBackToTop } from '~/components/common/buttons/use-back-to-top';
import ListScroll from '~/components/common/list/ListScroll.vue';

import LoginCard from '~/components/views/login/LoginCard.vue';
import { usePanelItem } from '~/components/views/panel/use-panel-item';
import { ExternaLinks } from '~/settings/external.links';
import { useProgressStore, useProgressStoreRefs } from '~/stores/data/progress.store';
import { useI18n } from '~/utils/i18n.utils';
import { watchUserChange } from '~/utils/store.utils';

const props = defineProps({
  panel: {
    type: Boolean,
    required: false,
  },
});

const { panel } = toRefs(props);

const i18n = useI18n('progress');

const { progress, loading, loggedOut } = useProgressStoreRefs();
const { fetchProgress, clearState } = useProgressStore();

watchUserChange({
  fetch: fetchProgress,
  clear: clearState,
});

onMounted(() => {
  watch(panel, async value => {
    if (!value) await fetchProgress();
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
        @on-scroll="scrolled = true"
        @on-scroll-top="scrolled = false"
        @on-item-click="onItemClick"
      >
        <template #default>
          <!-- TODO buttons here-->
        </template>
      </ListScroll>
    </Transition>

    <FloatingButton :show="scrolled" @on-click="onClick">
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

<script lang="ts" setup>
import { onMounted } from 'vue';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import { useBackToTop } from '~/components/common/buttons/use-back-to-top';
import ListScroll from '~/components/common/list/ListScroll.vue';

import { useProgressStore, useProgressStoreRefs } from '~/stores/data/progress.store';
import { useI18n } from '~/utils';

const i18n = useI18n('progress');

const { progress, loading } = useProgressStoreRefs();
const { fetchProgress } = useProgressStore();

onMounted(async () => {
  await fetchProgress();
});

const { scrolled, listRef, onClick } = useBackToTop();
</script>

<template>
  <div class="container">
    <ListScroll
      ref="listRef"
      :loading="loading"
      :items="progress"
      episode
      hide-date
      @on-scroll="scrolled = true"
      @on-scroll-top="scrolled = false"
    >
      <template #default>
        <!-- TODO buttons here-->
      </template>
    </ListScroll>

    <FloatingButton :show="scrolled" @on-click="onClick">
      {{ i18n('back_to_top', 'common', 'button') }}
    </FloatingButton>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>

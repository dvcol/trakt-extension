<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import type { ListScrollItem } from '~/models/list-scroll.model';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import { useBackToTop } from '~/components/common/buttons/use-back-to-top';
import ListScroll from '~/components/common/list/ListScroll.vue';
import { progressToListItem } from '~/models/progress.model';
import { TraktService } from '~/services/trakt.service';
import { useI18n } from '~/utils';

const i18n = useI18n('progress');

const loading = ref(true);

const fetchProgress = async (): Promise<ListScrollItem[]> => {
  loading.value = true;
  try {
    const items = await TraktService.progress();
    return items.map((item, index) => ({ ...progressToListItem(item), index }));
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    loading.value = false;
  }
};

const list = ref<ListScrollItem[]>([]);

onMounted(async () => {
  list.value = await fetchProgress();
  console.info('list', list.value);
});

const { scrolled, listRef, onClick } = useBackToTop();
</script>

<template>
  <div class="container">
    <ListScroll ref="listRef" :loading="loading" :items="list" episode hide-date>
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

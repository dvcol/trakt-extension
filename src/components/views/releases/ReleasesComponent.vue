<script lang="ts" setup>
import { watch } from 'vue';

import type { TraktSearchResult } from '@dvcol/trakt-http-client/models';
import type { ListScrollItem } from '~/models/list-scroll.model';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import ListScroll from '~/components/common/list/ListScroll.vue';
import { useListScroll } from '~/components/common/list/use-list-scroll';

import { usePanelItem } from '~/components/views/panel/use-panel-item';
import { TraktService } from '~/services/trakt.service';
import { useReleasesStore, useReleasesStoreRefs } from '~/stores/data/releases.store';
import { useCalendar, useCenterButton } from '~/utils/calendar.utils';
import { useI18n } from '~/utils/i18n.utils';
import { watchUserChange } from '~/utils/store.utils';

const i18n = useI18n('calendar');

const { releases, loading, center } = useReleasesStoreRefs();
const { fetchReleases, clearState } = useReleasesStore();

const list = useListScroll(releases, 'date');

const { centerItem, centerIsToday, scrolledOut, recenterIcon, onScrollIntoOutOfView } =
  useCenterButton({ list, center });

const { listRef, onClick, onScrollTop, onScrollBottom, reload } = useCalendar({
  list,
  centerItem,
  fetchData: fetchReleases,
});

watch(center, () => reload());

watchUserChange({
  mounted: reload,
  activated: async changed => {
    if (changed) await reload();
  },
  userChange: async active => {
    clearState();
    if (active) await reload();
  },
});

const { onItemClick } = usePanelItem();

const onMovieClick = async ({ item }: { item: ListScrollItem }) => {
  const lookup: TraktSearchResult[] = await TraktService.lookup({
    id: item.id.toString(),
    id_type: 'tmdb',
    type: 'movie',
  });
  onItemClick({
    item: {
      ...item,
      meta: {
        ...item.meta,
        ids: {
          ...item.meta?.ids,
          movie: {
            ...item.meta?.ids?.movie,
            trakt: lookup.pop()?.movie?.ids?.trakt,
          },
        },
      },
    },
  });
};
</script>

<template>
  <div class="container">
    <ListScroll
      ref="listRef"
      :items="list"
      :loading="loading"
      :content-height="3"
      hide-time
      :scroll-into-view="centerItem?.id ? [centerItem?.id] : []"
      @on-item-click="onMovieClick"
      @on-scroll-into-view="e => onScrollIntoOutOfView(false, e.ref)"
      @on-scroll-out-of-view="e => onScrollIntoOutOfView(true, e.ref)"
      @on-scroll-top="onScrollTop"
      @on-scroll-bottom="onScrollBottom"
    >
      <template #default>
        <!-- TODO buttons here-->
      </template>
    </ListScroll>
    <FloatingButton
      :show="scrolledOut"
      :width="centerIsToday ? '2.5rem' : '3.5rem'"
      :icon="recenterIcon"
      @on-click="onClick"
    >
      {{ i18n(centerIsToday ? 'today' : 'recenter', 'common', 'button') }}
    </FloatingButton>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>

<script lang="ts" setup>
import { NTimeline, NTimelineItem, NVirtualList } from 'naive-ui';
import { onActivated, onMounted, ref } from 'vue';

import type { VirtualListInst } from 'naive-ui';

import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';
import type { TraktHistory } from '~/models/trakt/trakt-history.model';

import { TraktService } from '~/services/trakt.service';

const history = ref<TraktHistory[]>([]);
const pagination = ref<TraktClientPagination>();
const virtualList = ref<VirtualListInst>();

const fetchData = async (
  page = pagination.value?.page ? pagination.value.page + 1 : 0,
) => {
  const response = await TraktService.traktClient.sync.history.get.cached({
    pagination: {
      page,
      limit: 30,
    },
  });

  const data = await response.json();
  pagination.value = response.pagination;
  history.value = [...history.value, ...data];
};

const onScroll = async (e: Event) => {
  if (!e?.target) return;
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
  if (!scrollTop || scrollHeight !== scrollTop + clientHeight) return;
  if (pagination.value?.page === pagination.value?.pageCount) return;

  const key = history.value[history.value.length - 1].id;
  await fetchData();
  virtualList.value?.scrollTo({ key, debounce: true });
};

onMounted(() => {
  console.info('History mounted');
  fetchData();
});

onActivated(() => {
  console.info('History activated');
});

const getTitle = (media: TraktHistory) => {
  if ('movie' in media) return media.movie.title;
  return `${media.episode.season}x${media.episode.number.toString().padStart(2, '0')} - ${
    media.episode.title
  }`;
};
</script>

<template>
  <NVirtualList
    ref="virtualList"
    class="history-list"
    :item-size="80"
    :data-length="history.length"
    :items="history"
    :visible-items-tag="NTimeline"
    :visible-items-tag-props="{ size: 'large' }"
    :padding-top="56"
    :padding-bottom="16"
    @scroll="onScroll"
  >
    <template #default="{ item }">
      <NTimelineItem
        :key="item.id"
        :data-key="item.id"
        :style="{
          fontVariantNumeric: 'tabular-nums',
          margin: '0 1rem',
        }"
        type="success"
        :title="getTitle(item)"
        :content="item.show?.title"
        :time="new Date(item.watched_at).toLocaleString()"
      />
    </template>
  </NVirtualList>
</template>

<style lang="scss" scoped>
@use '~/styles/layout' as layout;

.history-list {
  max-height: calc(100dvh - 8px);
  margin-top: -#{layout.$header-navbar-height};
  margin-bottom: 8px;
}
</style>

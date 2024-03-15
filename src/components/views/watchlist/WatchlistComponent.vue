<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';
import type { TraktWatchlist } from '~/models/trakt/trakt-watchlist.model';

import ListScroll from '~/components/common/list/ListScroll.vue';
import HistoryItem from '~/components/views/history/HistoryItem.vue';

import { TraktService } from '~/services/trakt.service';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';

const { user } = useUserSettingsStoreRefs();

const list = ref<TraktWatchlist[]>([]);
const pagination = ref<TraktClientPagination>();
const loading = ref(true);
const pageSize = 100;

onMounted(() => {
  console.info('This is a list component');
  TraktService.traktClient.sync.collection.get.cached({ type: 'movies' });
  TraktService.traktClient.sync.collection.get.cached({ type: 'shows' });
  TraktService.traktClient.sync.watchlist.get.cached().then(async res => {
    list.value = await res.json();
    pagination.value = res.pagination;
    loading.value = false;
  });
  TraktService.traktClient.users.lists.get.cached({ id: user.value });
  TraktService.traktClient.users.lists.collaborations.cached({ id: user.value });
});
</script>

<template>
  <ListScroll
    :items="list"
    :loading="loading"
    :pagination="pagination"
    :page-size="pageSize"
  >
    <template #default="{ item, loading: itemLoading }">
      <HistoryItem :item="item" :loading="itemLoading" />
    </template>
  </ListScroll>
</template>

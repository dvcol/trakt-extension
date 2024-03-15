<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import type { ListScrollItem } from '~/components/common/list/ListScroll.model';
import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';
import type { TraktWatchlist } from '~/models/trakt/trakt-watchlist.model';

import ListScroll from '~/components/common/list/ListScroll.vue';

import { TraktService } from '~/services/trakt.service';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';

const { user } = useUserSettingsStoreRefs();

const filteredList = ref<TraktWatchlist[]>([]);
const pagination = ref<TraktClientPagination>();
const loading = ref(true);
const pageSize = 100;

onMounted(() => {
  console.info('This is a list component');
  TraktService.traktClient.sync.collection.get.cached({ type: 'movies' });
  TraktService.traktClient.sync.collection.get.cached({ type: 'shows' });
  TraktService.traktClient.sync.watchlist.get.cached().then(async res => {
    filteredList.value = await res.json();
    pagination.value = res.pagination;
    loading.value = false;
  });
  TraktService.traktClient.users.lists.get.cached({ id: user.value });
  TraktService.traktClient.users.lists.collaborations.cached({ id: user.value });
});

const list = computed<ListScrollItem[]>(() => {
  const array = filteredList.value;
  if (!array.length) return [];
  return array.map((item, index) => {
    const _item: ListScrollItem = { ...item, index, loading: item.id < 0 };
    return _item;
  });
});
</script>

<template>
  <ListScroll
    :items="list"
    :loading="loading"
    :pagination="pagination"
    :page-size="pageSize"
  >
    <template #default>
      <!-- TODO buttons here-->
    </template>
  </ListScroll>
</template>

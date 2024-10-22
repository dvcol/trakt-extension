<script setup lang="ts">
import { computed } from 'vue';

import type { ListScrollItem } from '~/models/list-scroll.model';

import ListButton from '~/components/common/list/ListButton.vue';
import IconConfirmCircle from '~/components/icons/IconConfirmCircle.vue';
import { useWatchingStore, useWatchingStoreRefs } from '~/stores/data/watching.store';
import { useI18n } from '~/utils/i18n.utils';
import { useCancelWatching } from '~/utils/watching.utils';

const { disabled, item } = defineProps<{
  disabled?: boolean;
  item?: ListScrollItem;
}>();

const i18n = useI18n('list', 'checkin');

const { isWatchingListItem } = useWatchingStore();
const watching = computed(() => {
  if (!item) return false;
  return isWatchingListItem(item);
});

const { cancel, checkin } = useCancelWatching();
const onClick = async () => {
  if (!item?.type) return;
  if (!['movie', 'episode'].includes(item.type)) return;
  const type: 'movie' | 'episode' = item.type as 'movie' | 'episode';
  const ids = item.meta?.ids?.[type];
  if (!ids?.trakt) return;
  if (watching.value) await cancel();
  else await checkin({ type, ids: { trakt: ids.trakt } });
};

const { loading } = useWatchingStoreRefs();
</script>

<template>
  <ListButton
    :disabled="loading || disabled"
    :loading="loading"
    :button-props="{ type: watching ? 'warning' : 'error' }"
    :icon-props="{ component: IconConfirmCircle }"
    @on-click="onClick"
  >
    <span>{{ i18n(watching ? 'cancel' : 'checkin', 'common', 'button') }}</span>
  </ListButton>
</template>

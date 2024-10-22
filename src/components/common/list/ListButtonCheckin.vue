<script setup lang="ts">
import { computed } from 'vue';

import ListButton from '~/components/common/list/ListButton.vue';
import IconCancel from '~/components/icons/IconCancel.vue';
import IconConfirmCircle from '~/components/icons/IconConfirmCircle.vue';
import { isEpisodeOrMovie, type ListScrollItem } from '~/models/list-scroll.model';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { useCancelWatching } from '~/stores/composable/use-watching';
import { useWatchingStore, useWatchingStoreRefs } from '~/stores/data/watching.store';
import { useI18n } from '~/utils/i18n.utils';

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
  if (!isEpisodeOrMovie(item.type)) return;
  const ids = item.meta?.ids?.[item.type];
  if (!ids?.trakt) return;
  const query = {
    type: item.type,
    ids: { trakt: ids.trakt },
    showId: item.meta?.ids?.show?.trakt,
  };

  try {
    if (watching.value) await cancel(query);
    else await checkin(query);
  } catch (error) {
    Logger.error('Failed to checkin', { query, error });
    NotificationService.error(i18n('checkin_failed', 'watching'), error);
  }
};

const { loading } = useWatchingStoreRefs();
</script>

<template>
  <ListButton
    :disabled="loading || disabled"
    :loading="loading"
    :button-props="{ type: watching ? 'warning' : 'error' }"
    :icon-props="{ component: watching ? IconCancel : IconConfirmCircle }"
    @on-click="onClick"
  >
    <span>{{ i18n(watching ? 'cancel' : 'checkin', 'common', 'button') }}</span>
  </ListButton>
</template>

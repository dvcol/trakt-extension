import { elapsedTime } from '@dvcol/common-utils/common/date';

import { useDialog } from 'naive-ui';

import { computed, onBeforeMount, ref, watch } from 'vue';

import type { TraktApiIds, TraktCheckinRequest, TraktWatching } from '@dvcol/trakt-http-client/models';
import type { Ref } from 'vue';

import { NotificationService } from '~/services/notification.service';
import { useWatchingStore } from '~/stores/data/watching.store';
import { useI18n } from '~/utils/i18n.utils';

export const isWatchingMovie = (watching: TraktWatching): watching is TraktWatching<'movie'> => watching.type === 'movie';
export const isWatchingShow = (watching: TraktWatching): watching is TraktWatching<'episode'> => watching.type === 'episode';

export const useWatchingProgress = (watching: Ref<TraktWatching | undefined>) => {
  const now = ref(new Date());

  const elapsed = computed(() => {
    if (!watching.value) return 0;
    if (!watching.value.started_at) return 0;
    return elapsedTime(now.value, new Date(watching.value.started_at));
  });

  const duration = computed(() => {
    if (!watching.value) return 0;
    if (!watching.value.started_at) return 0;
    if (!watching.value.expires_at) return 0;
    return elapsedTime(new Date(watching.value.expires_at), new Date(watching.value.started_at));
  });

  const progress = computed(() => {
    if (!duration.value) return 0;
    if (!elapsed.value) return 0;
    return (elapsed.value / duration.value) * 100;
  });

  const interval: Ref<ReturnType<typeof setInterval> | undefined> = ref();

  onBeforeMount(() => {
    watch(
      watching,
      value => {
        if (value) {
          interval.value = setInterval(() => {
            now.value = new Date();
          }, 1000);
        } else if (interval.value) {
          clearInterval(interval.value);
        }
      },
      { immediate: true },
    );
  });
  return { elapsed, duration, progress };
};

export const useCancelWatching = (action: TraktWatching['action'] = 'checkin') => {
  const { cancel, checkin } = useWatchingStore();
  const i18n = useI18n('watching');
  const dialog = useDialog();
  const onCancel = () =>
    new Promise<unknown>(resolve => {
      dialog.error({
        title: i18n(`dialog_cancel_${action ?? 'checkin'}`),
        content: i18n('dialog_cancel_content'),
        positiveText: i18n('yes', 'common', 'button'),
        negativeText: i18n('no', 'common', 'button'),
        bordered: false,
        style: {
          width: '20rem',
          background: 'var(--bg-black-80)',
          backdropFilter: 'blur(var(--bg-blur-4))',
          whiteSpace: 'pre-line',
        },
        positiveButtonProps: {
          quaternary: true,
          type: 'success',
          ghost: false,
          bordered: false,
        },
        negativeButtonProps: {
          quaternary: true,
          type: 'error',
          ghost: false,
          bordered: false,
        },
        closable: false,
        onPositiveClick: async () => {
          await cancel();
          resolve(true);
        },
        onNegativeClick: () => resolve(false),
        onMaskClick: () => resolve(false),
      });
    });

  const onCheckin = async <T extends 'episode' | 'movie'>(
    { ids, type }: { ids?: Pick<TraktApiIds, 'trakt'> & Partial<TraktApiIds>; type: T },
    before?: () => void,
  ) => {
    if (!ids) return NotificationService.error(i18n('checkin_failed', 'watching'), new Error(`Missing ${type} id`));
    before?.();
    return checkin({ [type]: { ids } } as unknown as TraktCheckinRequest);
  };
  return { cancel: onCancel, checkin: onCheckin };
};

import type { Ref } from 'vue';
import type { ListEntity } from '~/models/list.model';

import IconCalendar from '~/components/icons/IconCalendar.vue';
import IconCancel from '~/components/icons/IconCancel.vue';
import IconClose from '~/components/icons/IconClose.vue';
import IconEyeOff from '~/components/icons/IconEyeOff.vue';
import IconGrid from '~/components/icons/IconGrid.vue';
import IconLocation from '~/components/icons/IconLocation.vue';
import IconRestore from '~/components/icons/IconRestore.vue';
import { useI18n } from '~/utils/i18n.utils';

export const PanelButtonsOption = {
  Now: 'now',
  Release: 'release',
  Custom: 'custom',
  Cancel: 'cancel',
  Remove: 'remove',
} as const;

export type PanelButtonsOptions = (typeof PanelButtonsOption)[keyof typeof PanelButtonsOption];

export const PanelButtonsWatchedOption = {
  Unwatched: 'unwatched' as const,
  Aired: 'aired' as const,
  All: 'all' as const,
} as const;

export const AllPanelButtonsWatchedOptions = [PanelButtonsWatchedOption.Aired, PanelButtonsWatchedOption.All];

export type PanelButtonsWatchedOptions = (typeof PanelButtonsWatchedOption)[keyof typeof PanelButtonsWatchedOption];

export const getWatchedIcon = (option: PanelButtonsWatchedOptions) => {
  switch (option) {
    case PanelButtonsWatchedOption.Unwatched:
      return IconEyeOff;
    case PanelButtonsWatchedOption.Aired:
      return IconCalendar;
    case PanelButtonsWatchedOption.All:
    default:
      return IconGrid;
  }
};

export type SelectProgressValue = string | number | (string | number)[];
export type SelectProgressResponse = {
  option: SelectProgressValue;
  date?: number;
  confirm?: SelectProgressValue;
};

export const usePanelButtons = () => {
  const i18n = useI18n('panel', 'buttons');

  const timeOptions = [
    { label: i18n('label__now'), value: PanelButtonsOption.Now, icon: IconLocation },
    { label: i18n('label__release'), value: PanelButtonsOption.Release, icon: IconRestore },
    { label: i18n('label__other'), value: PanelButtonsOption.Custom, icon: IconCalendar },
  ];

  const cancelOption = {
    label: i18n('label__cancel'),
    value: PanelButtonsOption.Cancel,
    icon: IconCancel,
  };

  const removeOption = {
    label: i18n('label__remove'),
    value: PanelButtonsOption.Remove,
    icon: IconClose,
  };

  const removeOptions = [removeOption, cancelOption];
  const mixedOptions = [...timeOptions, removeOption];

  return {
    timeOptions,
    cancelOption,
    removeOption,
    removeOptions,
    mixedOptions,
  };
};

export type PanelButtonsEmit = {
  (e: 'onListUpdate', value: ListEntity['id'], remove: boolean): void;
  (e: 'onCollectionUpdate', value: PanelButtonsOptions, date?: number, option?: PanelButtonsWatchedOptions): void;
  (e: 'onWatchedUpdate', value: PanelButtonsOptions, date?: number, option?: PanelButtonsWatchedOptions): void;
};

export const usePanelButtonsEmit = (emit: PanelButtonsEmit, list?: Ref<ListEntity['id'][] | undefined>) => {
  const onListUpdate = ({ option }: { option: ListEntity['id'] | ListEntity['id'][] }) => {
    const newList = Array.isArray(option) ? option : [option];
    const removed = list?.value?.find(id => !newList.includes(id));
    if (removed) emit('onListUpdate', removed, true);
    const added = newList.find(id => !list?.value?.includes(id));
    if (added) emit('onListUpdate', added, false);
  };

  const onCollectionUpdate = ({ option, date, confirm }: SelectProgressResponse) => {
    if (option === PanelButtonsOption.Cancel) return;
    if (option === PanelButtonsOption.Now && date === undefined) date = Date.now();
    emit('onCollectionUpdate', option as PanelButtonsOptions, date, confirm as PanelButtonsWatchedOptions);
  };

  const onWatchedUpdate = ({ option, date, confirm }: SelectProgressResponse) => {
    if (option === PanelButtonsOption.Cancel) return;
    if (option === PanelButtonsOption.Now && date === undefined) date = Date.now();
    emit('onWatchedUpdate', option as PanelButtonsOptions, date, confirm as PanelButtonsWatchedOptions);
  };

  return {
    onListUpdate,
    onCollectionUpdate,
    onWatchedUpdate,
  };
};

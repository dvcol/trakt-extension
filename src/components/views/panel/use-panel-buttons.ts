import IconCalendar from '~/components/icons/IconCalendar.vue';
import IconCancel from '~/components/icons/IconCancel.vue';
import IconClose from '~/components/icons/IconClose.vue';
import IconLocation from '~/components/icons/IconLocation.vue';
import IconRestore from '~/components/icons/IconRestore.vue';
import { useI18n } from '~/utils';

export const usePanelButtons = () => {
  const i18n = useI18n('panel', 'buttons');

  const timeOptions = [
    { label: i18n('label__now'), value: 'now', icon: IconLocation },
    { label: i18n('label__release'), value: 'release', icon: IconRestore },
    { label: i18n('label__other'), value: 'custom', icon: IconCalendar },
  ];

  const cancelOption = {
    label: i18n('label__cancel'),
    value: 'cancel',
    icon: IconCancel,
  };

  const removeOption = {
    label: i18n('label__remove'),
    value: 'remove',
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

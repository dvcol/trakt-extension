import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';
import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

import { MessageType } from '~/models/message/message-type.model';
import { sendMessage } from '~/utils/browser/browser-message.utils';
import { useWaitReady } from '~/utils/store.utils';

export const useAppStateStore = defineStore('app.state', () => {
  const isAppReady = ref(false);
  const panelOpen = ref(false);
  const panelDirty = ref(false);
  const footerOpen = ref(false);
  const isOption = ref(false);
  const isPopup = ref(false);
  const isWeb = ref(false);
  const root = ref<HTMLElement>();

  const { waitReady, setReady } = useWaitReady();

  const setAppReady = async (ready: boolean, { option, popup, web = !chromeRuntimeId }: { option?: boolean; popup?: boolean; web?: boolean }) => {
    isAppReady.value = ready;

    isOption.value = option ?? false;
    isPopup.value = popup ?? false;
    isWeb.value = web ?? false;

    setReady(ready);
    return sendMessage({ type: MessageType.AppReady, payload: ready });
  };

  return { isAppReady, setAppReady, waitAppReady: waitReady, panelOpen, panelDirty, footerOpen, isOption, isPopup, isWeb, root };
});

export const useAppStateStoreRefs = () => storeToRefs(useAppStateStore());

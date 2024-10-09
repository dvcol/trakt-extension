import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';
import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import { MessageType } from '~/models/message/message-type.model';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { sendMessage } from '~/utils/browser/browser-message.utils';
import { useWaitReady } from '~/utils/store.utils';
import { watchBreakpoint } from '~/utils/window.utils';

export const useAppStateStore = defineStore('app.state', () => {
  const appRef = ref<HTMLDivElement>();
  const mainRef = ref<HTMLDivElement>();
  const footerRef = ref<HTMLDivElement>();

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

  const { navbarPosition } = useExtensionSettingsStoreRefs();

  const { mobile, tablet } = watchBreakpoint(
    appRef,
    { mobile: 600, tablet: 1300 },
    {
      mobile: { width: window.innerWidth < 600 },
      tablet: { width: window.innerWidth < 1300 },
    },
  );

  return {
    appRef,
    mainRef,
    footerRef,
    isAppReady,
    setAppReady,
    waitAppReady: waitReady,
    panelOpen,
    panelDirty,
    footerOpen,
    isOption,
    isPopup,
    isWeb,
    root,
    reverse: computed(() => {
      if (!isWeb.value) return false;
      if (navbarPosition.value === 'bottom') return true;
      // web and small screen only
      return navbarPosition.value === 'auto' && mobile.width;
    }),
    floating: computed(() => {
      if (!isWeb.value) return false;
      // if (panelOpen.value) return false;
      if (navbarPosition.value === 'floating') return true;
      // web & big screen only
      return navbarPosition.value === 'auto' && tablet.width === false;
    }),
  };
});

export const useAppStateStoreRefs = () => storeToRefs(useAppStateStore());

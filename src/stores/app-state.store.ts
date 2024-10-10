import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';
import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import { MessageType } from '~/models/message/message-type.model';
import { NavbarPosition } from '~/models/navbar-position.model';
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

  const { bottom, minimum, floating } = watchBreakpoint(
    appRef,
    { bottom: 400, minimum: 800, floating: 1000 },
    {
      bottom: { width: window.innerWidth < 400 },
      minimum: { width: window.innerWidth < 800 },
      floating: { width: window.innerWidth < 1000 },
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
      if (navbarPosition.value === NavbarPosition.Bottom) return true;
      if (isPopup.value) return false;
      // web and small screen only
      return navbarPosition.value === NavbarPosition.Auto && bottom.width;
    }),
    floating: computed(() => {
      if (minimum.width) return false;
      // if (panelOpen.value) return false;
      if (navbarPosition.value === NavbarPosition.Floating) return true;
      if (isPopup.value) return false;
      // web & big screen only
      return navbarPosition.value === NavbarPosition.Auto && floating.width === false;
    }),
  };
});

export const useAppStateStoreRefs = () => storeToRefs(useAppStateStore());

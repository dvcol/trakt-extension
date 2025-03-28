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
  const root = ref<HTMLElement>();
  const appRef = ref<HTMLDivElement>();
  const mainRef = ref<HTMLDivElement>();
  const footerRef = ref<HTMLDivElement>();

  const isAppReady = ref(false);
  const panelOpen = ref(false);
  const panelDirty = ref(false);
  const footerOpen = ref(false);
  const isOption = ref(false);
  const isPopup = ref(false);
  const isPanel = ref(false);
  const isWeb = ref(false);
  const isModal = computed(() => isPopup.value || isPanel.value);

  const { waitReady, setReady, resetReady } = useWaitReady();

  const setAppReady = async (
    ready: boolean,
    { option, popup, panel, web = !chromeRuntimeId }: { option?: boolean; popup?: boolean; panel?: boolean; web?: boolean } = {},
  ) => {
    isAppReady.value = ready;

    if (!ready) return resetReady();

    isOption.value = option ?? false;
    isPopup.value = popup ?? false;
    isPanel.value = panel ?? false;
    isWeb.value = web ?? false;

    setReady(ready);
    return sendMessage({ type: MessageType.AppReady, payload: ready });
  };

  const { navbarPosition } = useExtensionSettingsStoreRefs();

  const { bottom, minimum, floating } = watchBreakpoint(
    appRef,
    { bottom: 500, minimum: 800, floating: 1000 },
    {
      bottom: { width: window.innerWidth < 500 },
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
    isPanel,
    isModal,
    isWeb,
    root,
    reverse: computed(() => {
      if (navbarPosition.value === NavbarPosition.Bottom) return true;
      if (isModal.value) return false;
      // web and small screen only
      return navbarPosition.value === NavbarPosition.Auto && bottom.width;
    }),
    floating: computed(() => {
      if (minimum.width) return false;
      // if (panelOpen.value) return false;
      if (navbarPosition.value === NavbarPosition.Floating) return true;
      if (isModal.value) return false;
      // web & big screen only
      return navbarPosition.value === NavbarPosition.Auto && floating.width === false;
    }),
  };
});

export const useAppStateStoreRefs = () => storeToRefs(useAppStateStore());

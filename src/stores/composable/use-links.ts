import { createTab, tabs } from '@dvcol/web-extension-utils/chrome/tabs';

import { useLinksStoreRefs } from '~/stores/settings/links.store';

const { openLinkInBackground } = useLinksStoreRefs();

export const openLink = (url?: string, active?: boolean) => {
  if (!url) return;
  if (openLinkInBackground.value || active) return createTab({ url, active: true });
  if (!tabs) return createTab({ url, active: false });
  return tabs.update({ url });
};

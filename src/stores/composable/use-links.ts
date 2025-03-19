import { createTab, tabs } from '@dvcol/web-extension-utils/chrome/tabs';

import { useLinksStoreRefs } from '~/stores/settings/links.store';

const { openLinkInActiveTab, openLinkInBackground } = useLinksStoreRefs();

/**
 * Open an external link
 * @param url - URL to open
 * @param active - Whether to make the new tab active
 * @param current - Whether to open the link in the current active tab
 */
export const openLink = (
  url?: string,
  { active = !openLinkInBackground.value, current = openLinkInActiveTab.value }: { active?: boolean; current?: boolean } = {},
) => {
  if (!url) return;
  if (current && tabs?.update) return tabs.update({ url });
  return createTab({ url, active });
};

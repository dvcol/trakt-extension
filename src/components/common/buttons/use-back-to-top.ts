import { ref } from 'vue';

import type { ScrollTo, VirtualListRef } from '~/models/list-scroll.model';

export const useBackToTop = () => {
  const listRef = ref<{ list: VirtualListRef }>();
  const scrolled = ref(false);

  const onClick = (scrollTo?: ScrollTo) => {
    listRef.value?.list?.scrollTo({ top: 0, left: 0, behavior: 'smooth', ...scrollTo });
    scrolled.value = false;
  };

  return { listRef, scrolled, onClick };
};

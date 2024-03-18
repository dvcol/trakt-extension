import { ref } from 'vue';

import type { VirtualListRef } from '~/components/common/list/ListScroll.model';

export const useBackToTop = () => {
  const listRef = ref<{ list: VirtualListRef }>();
  const scrolled = ref(false);

  const onClick = () => {
    listRef.value?.list?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    scrolled.value = false;
  };

  return { listRef, scrolled, onClick };
};

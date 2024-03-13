import type { NVirtualList, VirtualListInst } from 'naive-ui';

import type { Ref } from 'vue';

export type VirtualListRef = VirtualListInst & typeof NVirtualList;

export type OnScroll = (listRef: Ref<VirtualListRef | undefined>) => void;
export type OnUpdated = (listRef: Ref<VirtualListRef | undefined>) => void;

import type { NVirtualList, VirtualListInst } from 'naive-ui';
import type { Ref } from 'vue';

export type VirtualListRef = VirtualListInst & typeof NVirtualList;
export type VirtualListProps = {
  itemSize?: number;
  visibleItemsTag?: string | ObjectConstructor;
  visibleItemsProps?: ObjectConstructor;
  paddingTop?: string | number;
  paddingBottom?: string | number;
};

export type OnScroll = (listRef: Ref<VirtualListRef | undefined>) => void;
export type OnUpdated = (listRef: Ref<VirtualListRef | undefined>) => void;
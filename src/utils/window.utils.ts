import { onUnmounted, onWatcherCleanup, reactive, type Ref, ref, watch } from 'vue';

import { debounce } from '~/utils/debounce.utils';

export const watchMedia = (query: string) => {
  const media = window.matchMedia(query);
  const matchMedia = ref(media.matches);

  const listener = (_change: MediaQueryListEvent) => {
    matchMedia.value = _change.matches;
  };
  media.addEventListener('change', listener);
  onUnmounted(() => media.removeEventListener('change', listener));
  return matchMedia;
};

export const watchPreferDark = () => watchMedia('(prefers-color-scheme: dark');
export const watchPreferLight = () => watchMedia('(prefers-color-scheme: light');

export const watchSize = (element: Ref<Element | undefined>, cb: ResizeObserverCallback, options?: ResizeObserverOptions): ResizeObserver => {
  const observer = new ResizeObserver(cb);

  watch(element, el => {
    if (!el) return;
    observer.observe(el, options);

    // On rerun
    onWatcherCleanup(() => observer.unobserve(el));
  });

  onUnmounted(() => observer.disconnect());

  return observer;
};

export const watchBreakpoint = <Name extends string, Value extends number>(
  element: Ref<Element | undefined>,
  breakpoints: Record<Name, Value>,
  seed?: Partial<Record<Name, { height?: boolean; width?: boolean }>>,
): Record<Name, { height?: boolean; width?: boolean }> => {
  const result = reactive<Record<string, { height?: boolean; width?: boolean }>>(
    Object.fromEntries(Object.keys(breakpoints).map(key => [key, { height: undefined, width: undefined, ...seed?.[key as Name] }])),
  );

  const callback = debounce((entries: ResizeObserverEntry[]) => {
    const { width, height } = entries[0].contentRect;
    Object.entries(breakpoints).forEach(([key, value]) => {
      if (typeof value !== 'number') throw new Error('Breakpoint value must be a number');
      result[key].width = width < value;
      result[key].height = height < value;
    });
  }, 50);

  watchSize(element, callback);
  return result;
};

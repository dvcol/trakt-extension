import { isDarkTheme } from '@dvcol/web-extension-utils/lib/common/utils/window.utils';
import { onUnmounted, ref } from 'vue';

export { isDarkTheme };

export const watchMedia = (query: string) => {
  const media = window.matchMedia(query);
  const matchMedia = ref(media.matches);

  const listener = (_change: MediaQueryListEvent) => {
    matchMedia.value = _change.matches;
    console.info('value change', matchMedia.value);
  };
  media.addEventListener('change', listener);
  onUnmounted(() => media.removeEventListener('change', listener));
  return matchMedia;
};

export const watchPreferDark = () => watchMedia('(prefers-color-scheme: dark');

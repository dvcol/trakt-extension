<script setup lang="ts">
import { NFlex } from 'naive-ui';
import LiteYouTubeEmbed from 'vue-lite-youtube-embed';

import type { PropType } from 'vue';
import type { ImageResolution, YoutubePlayerProps } from '~/models/youtube-player.model';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  announce: {
    type: String,
    required: false,
    default: 'Watch',
  },
  activatedClass: {
    type: String,
    required: false,
    default: 'lyt-activated',
  },
  adNetwork: {
    type: Boolean,
    required: false,
    default: true,
  },
  iframeClass: {
    type: String,
    required: false,
    default: '',
  },
  cookie: {
    type: Boolean,
    required: false,
    default: false,
  },
  params: {
    type: String,
    required: false,
    default: '',
  },
  playerClass: {
    type: String,
    required: false,
    default: 'lty-playbtn',
  },
  playlist: {
    type: Boolean,
    required: false,
    default: false,
  },
  playlistCoverId: {
    type: String,
    required: false,
    default: '',
  },
  poster: {
    type: String as PropType<ImageResolution>,
    required: false,
    default: 'hqdefault',
  },
  wrapperClass: {
    type: String,
    required: false,
    default: 'yt-lite',
  },
  muted: {
    type: Boolean,
    required: false,
    default: false,
  },
  thumbnail: {
    type: String,
    required: false,
  },
  webp: {
    type: Boolean,
    required: false,
    default: false,
  },
  rel: {
    type: String as PropType<YoutubePlayerProps['rel']>,
    required: false,
    default: 'preload',
  },
  aspectHeight: {
    type: Number,
    required: false,
    default: 9,
  },
  aspectWidth: {
    type: Number,
    required: false,
    default: 16,
  },
});
</script>

<template>
  <NFlex class="youtube-player-container" justify="center" align="center" :title="title">
    <LiteYouTubeEmbed v-bind="props" />
  </NFlex>
</template>

<style lang="scss" scoped>
.youtube-player-container {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
.youtube-player-container {
  .yt-lite {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    background-color: #000;
    background-position: 50%;
    background-size: cover;
    cursor: pointer;
    contain: content;
  }

  .yt-lite::before {
    position: absolute;
    top: 0;
    display: block;
    box-sizing: content-box;
    width: 100%;
    height: 60px;
    padding-bottom: 50px;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==');
    background-repeat: repeat-x;
    background-position: top;
    transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
    content: '';
  }

  .yt-lite::after {
    display: block;
    padding-bottom: var(--aspect-ratio);
    content: '';
  }

  .yt-lite > iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .yt-lite > .lty-playbtn {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    display: block;
    width: 68px;
    height: 48px;
    background-color: transparent;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/><path d="M45 24 27 14v20" fill="white"/></svg>');
    border: none;
    transform: translate3d(-50%, -50%, 0);
    cursor: pointer;
    filter: grayscale(100%);
    transition: filter 0.2s cubic-bezier(0, 0, 0.2, 1);
  }

  .yt-lite:hover > .lty-playbtn,
  .yt-lite:focus-within > .lty-playbtn {
    filter: none;
  }

  .yt-lite.lyt-activated {
    cursor: unset;
  }

  .yt-lite.lyt-activated::before,
  .yt-lite.lyt-activated > .lty-playbtn {
    opacity: 0;
    pointer-events: none;
  }
}
</style>

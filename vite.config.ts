import { dirname, relative } from 'path';
import { fileURLToPath, URL } from 'url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

import { isDev, port, r } from './scripts/utils';

export default defineConfig(({ command }) => ({
  root: r('src'),
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __DEV__: isDev,
  },
  plugins: [
    vue(),

    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets').replace(/\\/g, '/')}/`);
      },
    },
  ],
  base: command === 'serve' ? `http://localhost:${port}/` : '/',
  server: {
    port,
    hmr: {
      host: 'localhost',
    },
  },
  build: {
    outDir: r('dist'),
    sourcemap: isDev ? 'inline' : false,
    rollupOptions: {
      input: {
        options: r('src/views/options/index.html'),
        popup: r('src/views/popup/index.html'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
}));

import { dirname, relative } from 'path';
import { fileURLToPath, URL } from 'url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vuetify from 'vite-plugin-vuetify';

import { isDev, port, resolveParent } from './scripts/utils';

import type { InputOption } from 'rollup';

const getInput = (hmr: boolean): InputOption => {
  if (hmr) return { background: resolveParent('src/scripts/background/index.ts') };
  return {
    background: resolveParent('src/scripts/background/index.ts'),
    options: resolveParent('src/views/options/index.html'),
    popup: resolveParent('src/views/popup/index.html'),
  };
};

export default defineConfig(({ command }) => ({
  root: resolveParent('src'),
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
    vuetify(),

    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml: (html, { path }) => html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets').replace(/\\/g, '/')}/`),
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
    outDir: resolveParent('dist'),
    sourcemap: isDev ? 'inline' : false,
    rollupOptions: {
      input: getInput(isDev),
      output: {
        entryFileNames: entry => (entry.name === 'background' ? 'scripts/[name].js' : 'assets/[name]-[hash].js'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  optimizeDeps: {
    exclude: ['path', 'fast-glob'],
  },
}));

import { dirname, relative } from 'path';
import { fileURLToPath, URL } from 'url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import dtsPlugin from 'vite-plugin-dts';
import vuetify from 'vite-plugin-vuetify';

import { isDev, port, resolveParent } from './scripts/utils';

import type { InputOption } from 'rollup';

const isWeb = !!process.env.VITE_WEB;
const isBuildDev = !!process.env.VITE_BUILD_DEV;

const getInput = (hmr: boolean): InputOption => {
  if (hmr) return { background: resolveParent('src/scripts/background/index.ts') };

  const inputs: Record<string, string> = {
    background: resolveParent('src/scripts/background/index.ts'),
    options: resolveParent('src/views/options/index.html'),
    popup: resolveParent('src/views/popup/index.html'),
  };

  if (isWeb) {
    inputs.web = resolveParent('src/index.html');
    inputs.lib = resolveParent('src/index.ts');
    inputs.entry = resolveParent('src/views/web/define-component.ts');
  }
  return inputs;
};

const getBase = (command: string) => {
  if (command === 'serve') return `http://localhost:${port}/`;
  if (isBuildDev) return '/';
  return isWeb ? '/trakt-extension/' : '/';
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
    dtsPlugin({
      include: ['index.ts', 'views/web/**'],
      outDir: resolveParent('dist/lib'),
    }),
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
  base: getBase(command),
  server: {
    port,
    hmr: {
      host: 'localhost',
    },
  },
  build: {
    outDir: resolveParent('dist'),
    sourcemap: isDev || isBuildDev ? 'inline' : false,
    rollupOptions: {
      input: getInput(isDev),
      output: {
        minifyInternalExports: false,
        chunkFileNames: 'chunks/[name]-[hash].chunk.js',
        entryFileNames: entry => {
          if (entry.name === 'background') return 'scripts/[name].js';
          if (entry.name === 'entry') return 'entry/index.js';
          if (entry.name === 'lib') return 'lib/index.js';
          return 'scripts/[name]-[hash].js';
        },
        assetFileNames: asset => {
          const format = '[name][extname]';
          if (asset.name?.endsWith('css')) return `styles/${format}`;
          return `assets/[name][extname]`;
        },
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

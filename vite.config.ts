import { readdir, readFile } from 'fs/promises';
import { dirname, relative } from 'path';
import { fileURLToPath, URL } from 'url';

import vue from '@vitejs/plugin-vue';
import MagicString from 'magic-string';
import { viteVueCE } from 'unplugin-vue-ce';

import { defineConfig } from 'vite';
import dtsPlugin from 'vite-plugin-dts';

import { isDev, port, resolveParent } from './scripts/utils';

import type { InputOption } from 'rollup';
import type { PluginOption } from 'vite';

const isWeb = !!process.env.VITE_WEB;
const sourcemap = !!process.env.VITE_SOURCEMAP;

const getInput = (hmr: boolean, _isWeb: boolean): InputOption => {
  if (hmr) return { background: resolveParent('src/scripts/background/index.ts') };

  const inputs: Record<string, string> = {
    background: resolveParent('src/scripts/background/index.ts'),
    options: resolveParent('src/views/options/index.html'),
    popup: resolveParent('src/views/popup/index.html'),
  };

  if (_isWeb) {
    inputs.web = resolveParent('src/index.html');
    inputs.lib = resolveParent('src/index.ts');
    inputs.entry = resolveParent('src/web/define-component.ts');
  }
  return inputs;
};

const i18nRegex = /.*src\/i18n\/([a-zA-Z]+)\/.*\.json/;

const getPlugins = (): PluginOption[] => [
  dtsPlugin({
    include: ['index.ts', 'web/**'],
    outDir: resolveParent('dist/lib'),
  }),
  vue({
    customElement: true,
  }),
  viteVueCE(),

  {
    name: 'i18n-hmr',
    configureServer: server => {
      console.info('server start');
      server.ws.on('fetch:i18n', async () => {
        const dir = await readdir('dist/_locales');
        const locales = dir.map(_lang =>
          readFile(`dist/_locales/${_lang}/messages.json`, { encoding: 'utf-8' }).then(locale => ({ lang: _lang, locale: JSON.parse(locale) })),
        );
        server.ws.send({
          type: 'custom',
          event: 'update:i18n',
          data: await Promise.all(locales),
        });
      });
    },
    handleHotUpdate: async ({ server, file, read, modules }) => {
      const lang = file.match(i18nRegex)?.[1];
      if (lang) {
        console.info('Emit new i18n', file);
        const locale = JSON.parse(await read());
        server.ws.send({
          type: 'custom',
          event: 'update:i18n',
          data: [{ lang, locale }],
        });
      }
      return modules;
    },
  },

  // replace document query selector to inject naive-ui within shadow root instead of document head
  {
    name: 'chunk-transform',
    enforce: 'post',
    transform: (code, id) => {
      if (id.includes('css-render') || id.includes('naive-ui')) {
        const getReplacement = (fallback = 'document') => `(document.querySelector('wc-trakt-extension').shadowRoot ?? ${fallback})`;
        const _code = new MagicString(code)
          .replace(/document\.querySelector/g, `(${getReplacement()}).querySelector`)
          .replace(/document\.head/g, `(${getReplacement('document.head')})`);
        return {
          code: _code.toString(),
          map: _code.generateMap({ hires: true }),
        };
      }
    },
  },

  // rewrite assets to use relative path
  {
    name: 'assets-rewrite',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml: (html, { path }) => html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets').replace(/\\/g, '/')}/`),
  },
];

export default defineConfig(() => ({
  root: resolveParent('src'),
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __DEV__: isDev,
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: isDev,
  },
  plugins: getPlugins(),
  base: './',
  server: {
    port,
    hmr: {
      host: 'localhost',
    },
  },
  build: {
    outDir: resolveParent('dist'),
    sourcemap: isDev || sourcemap ? 'inline' : false,
    rollupOptions: {
      input: getInput(isDev, isWeb),
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

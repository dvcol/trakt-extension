import { readdir, readFile, writeFile } from 'fs/promises';
import { dirname, join, relative } from 'path';
import { fileURLToPath, URL } from 'url';

import vue from '@vitejs/plugin-vue';
import MagicString from 'magic-string';
import { viteVueCE } from 'unplugin-vue-ce';

import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import dtsPlugin from 'vite-plugin-dts';
import { VitePWA } from 'vite-plugin-pwa';

import pkg from './package.json';
import { isDev, port, resolveParent } from './scripts/utils';

import type { ExistingRawSourceMap, InputOption } from 'rollup';
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

const getPlugins = (_isDev: boolean, _isWeb: boolean): PluginOption[] => {
  const plugins: PluginOption[] = [
    vue({
      customElement: true,
    }),
    viteVueCE({}),
    checker({
      vueTsc: {
        tsconfigPath: 'tsconfig.app.json',
      },
    }),
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
            map: _code.generateMap({ hires: true }) as ExistingRawSourceMap,
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

    {
      name: 'write-to-disk',
      apply: 'serve',
      handleHotUpdate: async ({ file, server: { config } }) => {
        const srcDir = dirname(file);
        if (!srcDir?.endsWith('src/scripts/background')) return;
        const outPath = `${join(config.build.outDir, 'scripts/background')}.js`;
        await writeFile(outPath, `import 'http://localhost:3303/scripts/background/index.ts';`);
      },
    },
  ];

  if (!_isDev && _isWeb) {
    plugins.push(
      dtsPlugin({
        include: ['index.ts', 'web/define-component.ts'],
        outDir: resolveParent('dist/lib'),
        entryRoot: resolveParent('src'),
      }),
      VitePWA({
        scope: '/trakt-extension/',
        registerType: 'autoUpdate',
        includeAssets: ['**/favicon.ico', '**/*.svg', '**/*.png', '**/*.webp', '**/*.json'],
        manifest: {
          name: pkg.title || pkg.name,
          short_name: 'Side Trakt',
          description: pkg.description,
          theme_color: '#80000a',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        workbox: {
          sourcemap: true,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,mp4}'],
        },
      }),
    );
  }

  return plugins;
};

export default defineConfig(() => ({
  root: resolveParent('src'),
  envDir: resolveParent('env'),
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __DEV__: isDev,
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: isDev,
    'import.meta.env.PKG_VERSION': JSON.stringify(pkg.version),
    'import.meta.env.PKG_NAME': JSON.stringify(pkg.name),
  },
  plugins: getPlugins(isDev, isWeb),
  base: process.env.VITE_BASE || './',
  server: {
    port,
    hmr: {
      host: 'localhost',
    },
  },
  preview: {
    port: 3304,
    cors: true,
    open: true,
  },
  build: {
    outDir: resolveParent('dist'),
    sourcemap: isDev || sourcemap ? 'inline' : false,
    minify: false,
    rollupOptions: {
      preserveEntrySignatures: 'allow-extension',
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
    coverage: {
      reportsDirectory: './coverage',
    },
    setupFiles: ['./vitest.setup.ts'],
  },
  optimizeDeps: {
    exclude: ['path', 'fast-glob'],
  },
}));

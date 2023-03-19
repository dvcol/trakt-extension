import { exec } from 'child_process';

import { mergeJson } from '@dvcol/web-extension-utils/common';
import { watch } from 'chokidar';
import fs from 'fs-extra';

import { writeManifest } from './manifest';
import { isDev, port, resolveParent } from './utils';

/**
 * Replace index.html with link to vite localhost for hot reload
 * @param view the view to replace
 */
const copyIndexHtml = async (view: string) => {
  fs.ensureDirSync(resolveParent(`dist/views/${view}`));
  const data = fs
    .readFileSync(resolveParent(`src/views/${view}/index.html`), 'utf-8')
    .replace('"./main.ts"', `"http://localhost:${port}/views/${view}/main.ts"`)
    .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>');
  fs.writeFileSync(resolveParent(`dist/views/${view}/index.html`), data, 'utf-8');
  console.log(`Stubbing '${view}' to '${__dirname}/dist/views/${view}/index.html'`);
};

/**
 * copy index.html to use Vite in development
 */
const copyViews = async (views = ['options', 'popup']) => views.map(copyIndexHtml);

/**
 * Copy extension icons to dist folder
 */
const copyIcons = async (_isDev: boolean) => {
  if (_isDev) return fs.symlink(resolveParent('icons'), resolveParent('dist/icons'), 'junction');
  return fs.copySync('icons', 'dist/icons', { overwrite: true });
};

/**
 * Copy extension icons to dist folder
 */
const copyAssets = async () => fs.symlink(resolveParent('src/assets'), resolveParent('dist/assets'), 'junction');

/**
 * Prepare dist folder with manifest.json and views
 */
const prepare = async (hmr = isDev) => {
  writeManifest().catch(e => console.error('Failed to write manifest.json', e));

  copyIcons(isDev).catch(e => console.error('Failed to copy extension icons', e));

  mergeJson({
    pattern: 'src/i18n/en/**/*.json',
    output: 'dist/_locales/en/messages.json',
  }).catch((e: Error) => console.error('Failed to merge jsons', e));

  if (hmr) {
    console.log('Watching changes ...');

    copyViews().catch(e => console.error('Failed to copy html', e));
    watch(resolveParent('src/**/*.html')).on('change', () => {
      copyViews().catch(e => console.error('Failed to copy html', e));
    });

    watch([resolveParent('src/manifest.ts'), resolveParent('package.json')]).on('change', () => {
      writeManifest().catch(e => console.error('Failed to write manifest.json', e));
    });

    exec('vite build');
    watch(resolveParent('src/script/**/*.ts')).on('change', () => {
      try {
        exec('vite build');
      } catch (e) {
        console.error('Failed to write manifest.json', e);
      }
    });

    watch([resolveParent('src/i18n/en/**/*.json')]).on('change', () => {
      mergeJson({
        pattern: 'src/i18n/en/**/*.json',
        output: 'dist/_locales/en/messages.json',
      }).catch((e: Error) => console.error('Failed to merge jsons', e));
    });

    copyAssets().catch(e => console.error('Failed to write assets', e));
  }
};

prepare().catch(e => console.error('Failed to prepare dist folder', e));

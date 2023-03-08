import { watch } from 'chokidar';
import fs from 'fs-extra';

import { writeManifest } from './manifest';
import { isDev, port, r } from './utils';

/**
 * Replace index.html with link to vite localhost for hot reload
 * @param view the view to replace
 */
const copyIndexHtml = async (view: string) => {
  fs.ensureDirSync(r(`dist/views/${view}`));
  const data = fs
    .readFileSync(r(`src/views/${view}/index.html`), 'utf-8')
    .replace('"./main.ts"', `"http://localhost:${port}/views/${view}/main.ts"`)
    .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>');
  fs.writeFileSync(r(`dist/views/${view}/index.html`), data, 'utf-8');
  console.log(`Stubbing '${view}' to '${__dirname}/dist/views/${view}/index.html'`);
};

/**
 * copy index.html to use Vite in development
 */
const copyViews = async (views = ['options', 'popup']) => views.map(copyIndexHtml);

/**
 * Copy extension icons to dist folder
 */
const copyIcons = async () => (isDev ? fs.symlink(r('icons'), r('dist/icons'), 'junction') : fs.copySync('icons', 'dist/icons', { overwrite: true }));

/**
 * Copy extension icons to dist folder
 */
const copyAssets = async () => fs.symlink(r('src/assets'), r('dist/assets'), 'junction');

/**
 * Prepare dist folder with manifest.json and views
 */
const prepare = async (hmr = isDev) => {
  writeManifest().catch(e => console.error('Failed to write manifest.json', e));

  copyIcons().catch(e => console.error('Failed to copy extension icons', e));

  if (hmr) {
    console.log('Watching changes ...');

    copyViews().catch(e => console.error('Failed to copy html', e));
    watch(r('src/**/*.html')).on('change', () => {
      copyViews().catch(e => console.error('Failed to copy html', e));
    });

    watch([r('src/manifest.ts'), r('package.json')]).on('change', () => {
      writeManifest().catch(e => console.error('Failed to write manifest.json', e));
    });

    copyAssets().catch(e => console.error('Failed to write manifest.json', e));
  }
};

prepare().catch(e => console.error('Failed to prepare dist folder', e));

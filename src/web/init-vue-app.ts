import { createPinia } from 'pinia';

import { createApp, getCurrentInstance } from 'vue';

import type { App, Component } from 'vue';

import type { RouterOptions } from '~/router';

import { createRouter } from '~/router';
import { initServices } from '~/web/init-services';

export type InitVueAppOption = RouterOptions;
export const initVueApp = (component: Component, options: InitVueAppOption = {}) => {
  const app = createApp(component);

  // check if an instance already exist, if not, create one
  let pinia = getCurrentInstance()?.appContext?.config?.globalProperties?.$pinia;
  if (!pinia) pinia = createPinia();
  app.use(pinia);

  let router = getCurrentInstance()?.appContext?.config?.globalProperties?.$router;
  if (!router) router = createRouter(options);
  app.use(router);

  initServices().then(() => console.info('Services initialized.'));

  return app;
};

export const mountVueApp = (id = '#app', component: Component): App => {
  const app = initVueApp(component);

  app.mount(id);

  return app;
};

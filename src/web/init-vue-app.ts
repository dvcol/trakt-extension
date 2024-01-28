import { createPinia } from 'pinia';

import { createApp } from 'vue';

import type { App, Component } from 'vue';

import type { RouterOptions } from '~/router';

import { createRouter } from '~/router';
import { initServices } from '~/web/init-services';

export type InitVueAppOption = RouterOptions;
export const initVueApp = (component: Component, options: InitVueAppOption = {}) => {
  const app = createApp(component);

  const pinia = createPinia();
  app.use(pinia);

  const router = createRouter(options);
  app.use(router);

  initServices();

  return app;
};

export const mountVueApp = (id = '#app', component: Component): App => {
  const app = initVueApp(component);

  app.mount(id);

  return app;
};

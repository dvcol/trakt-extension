import { createPinia } from 'pinia';

import { createApp } from 'vue';

import type { Component } from 'vue';

import type { RouterOptions } from '~/router';

import { createRouter } from '~/router';

export type InitVueAppOption = RouterOptions;
export const initVueApp = (component: Component, options: InitVueAppOption = {}) => {
  const app = createApp(component);

  const pinia = createPinia();
  app.use(pinia);

  const router = createRouter(options);
  app.use(router);

  return app;
};

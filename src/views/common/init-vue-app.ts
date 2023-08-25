import { createPinia } from 'pinia';

import { createApp } from 'vue';

import { createVuetify } from 'vuetify';

import type { App, Component } from 'vue';

import type { RouterOptions } from '~/router';

import AppView from '~/components/AppView.vue';
import { createRouter } from '~/router';

import { isDarkTheme } from '~/utils';

import 'vuetify/styles';
import '~/styles/base.css';

export type InitVueAppOption = RouterOptions;
export const initVueApp = (component: Component = AppView, options: InitVueAppOption = {}) => {
  const app = createApp(component);

  const pinia = createPinia();
  app.use(pinia);

  const vuetify = createVuetify({
    theme: {
      defaultTheme: isDarkTheme() ? 'dark' : 'light',
    },
  });
  app.use(vuetify);

  const router = createRouter(options);
  app.use(router);

  return app;
};

export const mountVueApp = (id = '#app', component: Component = AppView): App => {
  const app = initVueApp(component);

  app.mount(id);

  return app;
};

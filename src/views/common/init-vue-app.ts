import { createPinia } from 'pinia';

import { createApp } from 'vue';

import { createVuetify } from 'vuetify';

import type { App, Component } from 'vue';

import AppView from '~/components/AppView.vue';
import { createRouter } from '~/router';

import { isDarkTheme } from '~/utils';

import 'vuetify/styles';
import '~/styles/base.css';

export type InitVueAppOption = { basename?: string };
export const initVueApp = (component: Component = AppView, { basename }: InitVueAppOption = {}) => {
  const app = createApp(component);
  const pinia = createPinia();
  const vuetify = createVuetify({
    theme: {
      defaultTheme: isDarkTheme() ? 'dark' : 'light',
    },
  });
  const router = createRouter(basename);

  app.use(pinia);
  app.use(vuetify);
  app.use(router);

  return app;
};

export const mountVueApp = (id = '#app', component: Component = AppView): App => {
  const app = initVueApp(component);

  app.mount(id);

  return app;
};

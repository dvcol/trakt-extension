import { createPinia } from 'pinia';

import { createApp } from 'vue';

import { createVuetify } from 'vuetify';

import router from '../../router';

import type { App, Component } from 'vue';

import AppView from '~/components/AppView.vue';

import { isDarkTheme } from '~/utils';

import 'vuetify/styles';
import '~/styles/base.css';

export const initVueApp = (component: Component = AppView) => {
  const app = createApp(component);
  const pinia = createPinia();
  const vuetify = createVuetify({
    theme: {
      defaultTheme: isDarkTheme() ? 'dark' : 'light',
    },
  });

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

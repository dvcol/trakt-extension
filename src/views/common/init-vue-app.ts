import { isDarkTheme } from '@dvcol/web-extension-utils/lib/common/utils/window.utils';
import { createPinia } from 'pinia';

import { createApp } from 'vue';

import { createVuetify } from 'vuetify';

import router from '../../router';

import AppView from './AppView.vue';

import type { App, Component } from 'vue';

import 'vuetify/styles';
import '../../styles/base.css';

export const initVueApp = (id = '#app', component: Component = AppView): App => {
  const app = createApp(component);

  app.use(createPinia());
  app.use(
    createVuetify({
      theme: {
        defaultTheme: isDarkTheme() ? 'dark' : 'light',
      },
    }),
  );
  app.use(router);

  app.mount(id);

  return app;
};

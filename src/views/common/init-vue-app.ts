import { createPinia } from 'pinia';

import { createApp } from 'vue';

import router from '../../router';

import AppView from './AppView.vue';

import type { App, Component } from 'vue';

import '../../styles/base.css';

export const initVueApp = (id = '#app', component: Component = AppView): App => {
  const app = createApp(component);

  app.use(createPinia());
  app.use(router);

  app.mount(id);

  return app;
};

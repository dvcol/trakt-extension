import { createPinia } from 'pinia';

import { createApp, getCurrentInstance, onUnmounted } from 'vue';

import type { App, Component } from 'vue';

import type { RouterOptions } from '~/router';

import { RouterService } from '~/services/router.service';
import { destroyServices, initServices } from '~/web/init-services';

export type InitVueAppOption = RouterOptions & { view?: { option?: boolean; popup?: boolean; web?: boolean } };
export const initVueApp = (component: Component, options: InitVueAppOption = {}) => {
  const app = createApp(component);

  // check if an instance already exist, if not, create one
  let pinia = getCurrentInstance()?.appContext?.config?.globalProperties?.$pinia;
  if (!pinia) pinia = createPinia();
  app.use(pinia);

  let router = getCurrentInstance()?.appContext?.config?.globalProperties?.$router;
  if (!router) router = RouterService.init(options);
  app.use(router);

  initServices(options.view).catch(error => console.error('Failed to initialized services.', error));

  onUnmounted(async () => {
    await destroyServices();
  });

  return app;
};

export const mountVueApp = (id = '#app', component: Component, options?: InitVueAppOption): App => {
  const app = initVueApp(component, options);

  app.mount(id);

  return app;
};

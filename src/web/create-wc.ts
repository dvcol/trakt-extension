import { defineCustomElement, getCurrentInstance, h } from 'vue';

import type { DevToolsHook, DevToolsHooks } from '@vue/devtools';
import type { Component, ComponentInternalInstance } from 'vue';
import type { InitVueAppOption } from '~/web/init-vue-app';

import { initVueApp } from '~/web/init-vue-app';

type ComponentInstance = ComponentInternalInstance & { provides: ComponentInternalInstance['appContext']['provides'] };

declare global {
  interface Window {
    __VUE_DEVTOOLS_GLOBAL_HOOK__: DevToolsHook & { Vue: Component };
  }
}

export const createElementInstance = (component: Component, { name, ...options }: InitVueAppOption & { name: string }) => {
  return defineCustomElement({
    name,
    setup(props) {
      const app = initVueApp(component, options);

      const inst = getCurrentInstance() as ComponentInstance;
      if (inst) {
        Object.assign(inst.appContext, app._context);
        Object.assign(inst.provides, app._context.provides);

        // Add support for Vue Devtools
        if (import.meta.env.DEV && window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
          app._container = document.querySelector(name);
          app._instance = inst;

          const types = {
            Comment: Symbol('v-cmt'),
            Fragment: Symbol('v-fgt'),
            Static: Symbol('v-stc'),
            Text: Symbol('v-txt'),
          };

          window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('app:init' as DevToolsHooks, app, app.version, types);
          window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app;

          console.info('Vue Devtools is enabled.');
        }
      }

      return () => h(component, props);
    },
  });
};

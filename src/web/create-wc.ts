import { defineCustomElement, getCurrentInstance, h } from 'vue';

import type { ComponentInternalInstance, ComponentPublicInstance } from 'vue';

import type { InitVueAppOption } from '~/web/init-vue-app';

import { initVueApp } from '~/web/init-vue-app';

type ComponentInstance = ComponentInternalInstance & { provides: ComponentInternalInstance['appContext']['provides'] };

export const createElementInstance = (component: ComponentPublicInstance, options: InitVueAppOption) => {
  return defineCustomElement({
    setup(props) {
      const app = initVueApp(component, options);

      const inst = getCurrentInstance() as ComponentInstance;
      if (inst) {
        Object.assign(inst.appContext, app._context);
        Object.assign(inst.provides, app._context.provides);
      }

      return () => h(component, props);
    },
  });
};

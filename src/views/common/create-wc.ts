import { defineCustomElement, getCurrentInstance, h } from 'vue';

import type { ComponentInternalInstance } from 'vue';

import AppWeb from '~/components/web/AppWeb.ce.vue';
import { initVueApp } from '~/views/common/init-vue-app';

type ComponentInstance = ComponentInternalInstance & { provides: ComponentInternalInstance['appContext']['provides'] };

export const createElementInstance = (component = AppWeb) => {
  return defineCustomElement({
    styles: component.styles,
    setup() {
      const app = initVueApp(component);

      const inst = getCurrentInstance() as ComponentInstance;
      if (inst) {
        Object.assign(inst.appContext, app._context);
        Object.assign(inst.provides, app._context.provides);
      }
    },
    render: () => h(component),
  });
};

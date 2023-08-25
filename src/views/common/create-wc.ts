import { defineCustomElement, getCurrentInstance, h } from 'vue';

import type { ComponentInternalInstance } from 'vue';

import type { InitVueAppOption } from '~/views/common/init-vue-app';

import AppWeb from '~/components/web/AppWeb.ce.vue';
import { initVueApp } from '~/views/common/init-vue-app';

type ComponentInstance = ComponentInternalInstance & { provides: ComponentInternalInstance['appContext']['provides'] };

export const createElementInstance = (component = AppWeb, options: InitVueAppOption) => {
  return defineCustomElement({
    styles: component.styles,
    props: component.props,
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

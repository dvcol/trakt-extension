import AppWeb from '~/components/web/AppWeb.ce.vue';
import { createElementInstance } from '~/views/common';

const TraktExtensionWc = createElementInstance(AppWeb);

enum WebComponents {
  TraktExtension = 'wc-trakt-extension',
}

type DefineComponent = (component?: WebComponents) => void;

export const defineComponent: DefineComponent = (component: WebComponents = WebComponents.TraktExtension) => {
  if (customElements.get(component)) {
    console.warn(`Custom element '${component}' is already defined.`);
  } else {
    customElements.define(component, TraktExtensionWc);
  }
};

export const baseUrl = 'trakt-extension';

type TraktExtension = {
  baseUrl: typeof baseUrl;
  component: typeof TraktExtensionWc;
  defineComponent: typeof defineComponent;
  default: typeof defineComponent;
};

// register global typings
declare module 'vue' {
  export interface GlobalComponents {
    TraktExtension: TraktExtension['component'];
  }
}

export type { TraktExtension };
export default defineComponent;

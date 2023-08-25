import AppWeb from '~/components/web/AppWeb.ce.vue';
import { createElementInstance } from '~/views/common';

export enum WebComponents {
  TraktExtension = 'wc-trakt-extension',
}

export type DefineOption = { baseName?: string; baseUrl?: string };
export type DefineComponent = (options?: DefineOption, component?: WebComponents) => void;

export function defineComponent(options: DefineOption = {}, component: WebComponents = WebComponents.TraktExtension): void {
  if (customElements.get(component)) {
    console.warn(`Custom element '${component}' is already defined.`);
  } else {
    const TraktExtensionWc = createElementInstance(AppWeb, options);
    customElements.define(component, TraktExtensionWc);
  }
}

export default defineComponent;

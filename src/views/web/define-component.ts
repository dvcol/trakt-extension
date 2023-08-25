import { TraktExtensionWc } from '~/views/web/web-component';

export enum WebComponents {
  TraktExtension = 'wc-trakt-extension',
}

export type DefineComponent = (component?: WebComponents) => void;

export function defineComponent(component: WebComponents = WebComponents.TraktExtension): DefineComponent {
  if (customElements.get(component)) {
    console.warn(`Custom element '${component}' is already defined.`);
  } else {
    customElements.define(component, TraktExtensionWc);
  }
}

export default defineComponent;

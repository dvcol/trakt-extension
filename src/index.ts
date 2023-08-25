import type { DefineComponent, WebComponents } from '~/views/web/define-component';
import type { TraktExtensionComponent } from '~/views/web/web-component';

const baseUrl = 'trakt-extension';

type TraktExtension = {
  WebComponents: WebComponents;
  defineComponent: DefineComponent;
  default: DefineComponent;
};

// register global typings
declare module 'vue' {
  export interface GlobalComponents {
    TraktExtension: TraktExtensionComponent;
  }
}

export type { TraktExtension, TraktExtensionComponent, DefineComponent };
export { baseUrl };

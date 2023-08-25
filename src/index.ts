import type { DefineComponent, WebComponents } from '~/views/web/define-component';

const baseUrl = 'trakt-extension';

type TraktExtension = {
  WebComponents: WebComponents;
  defineComponent: DefineComponent;
  default: DefineComponent;
};

export type { TraktExtension, DefineComponent };
export { baseUrl };

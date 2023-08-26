import type { Component } from 'vue';
import type { DefineComponent, WebComponents } from '~/web/define-component';

export const baseUrl = 'trakt-extension';

type TraktExtension = {
  component: Component;
  WebComponents: WebComponents;
  defineComponent: DefineComponent;
  default: DefineComponent;
};

export type { TraktExtension, DefineComponent, WebComponents };

// @ts-expect-error chrome issue
import type { chrome } from 'chrome';

import type { Component } from 'vue';
import type { DefineComponent, WebComponents } from '~/web/define-component';

export const baseUrl = 'trakt-extension' as const;

type TraktExtension = {
  component: Component;
  WebComponents: WebComponents;
  defineComponent: DefineComponent;
  default: DefineComponent;
};

export type { TraktExtension, DefineComponent, WebComponents };

declare global {
  interface Window {
    chrome: typeof chrome;
    trakt: Record<string, unknown>;
  }
}

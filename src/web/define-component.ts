export enum WebComponents {
  TraktExtension = 'wc-trakt-extension',
}

export type DefineOption = { baseName?: string; baseUrl?: string; view?: { option?: boolean; popup?: boolean; panel?: boolean; web?: boolean } };
export type DefineComponent = (options?: DefineOption, component?: WebComponents) => Promise<CustomElementConstructor>;

export const defineComponent = async (options: DefineOption = {}, component: WebComponents = WebComponents.TraktExtension) => {
  if (customElements.get(component)) {
    console.warn(`Custom element '${component}' is already defined.`);
  } else {
    const [{ createElementInstance }, { lazyComponent }] = await Promise.all([import('~/web/create-wc'), import('~/utils/lazy.utils')]);
    const ContainerComponent = lazyComponent(() => import('~/components/container/ContainerComponent.ce.vue'));
    const TraktExtensionWc = createElementInstance(ContainerComponent, { name: component, ...options });
    customElements.define(component, TraktExtensionWc);
  }
  return customElements.whenDefined(component);
};

export default defineComponent;

import { defineAsyncComponent } from 'vue';

import type { AsyncComponentOptions } from 'vue';

export const lazyComponent = (loader: AsyncComponentOptions['loader'], options: Omit<AsyncComponentOptions, 'loader'> = {}) =>
  defineAsyncComponent({ loader, ...options });

export default lazyComponent;

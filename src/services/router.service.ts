import type { Router } from 'vue-router';
import type { RouterOptions } from '~/router';

import { createRouter } from '~/router';

export class RouterService {
  private static instance?: Router;

  static get router() {
    if (!RouterService.instance) throw new Error('Router not initialized');
    return RouterService.instance;
  }

  static init(options: RouterOptions): Router {
    if (this.instance) return this.instance;
    RouterService.instance = createRouter(options);
    return RouterService.instance;
  }

  static destroy() {
    RouterService.instance = undefined;
  }
}

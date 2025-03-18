import type { Router } from 'vue-router';
import type { RouterOptions } from '~/router';

import { MessageType } from '~/models/message/message-type.model';
import { createRouter } from '~/router';

import { onMessage } from '~/utils/browser/browser-message.utils';

export class RouterService {
  private static instance?: Router;
  private static listener?: () => void;

  static get router() {
    if (!this.instance) throw new Error('Router not initialized');
    return this.instance;
  }

  static init(options: RouterOptions): Router {
    if (this.instance) return this.instance;
    this.instance = createRouter(options);

    try {
      this.listener = onMessage(MessageType.Routing, async message => {
        if (!message.payload) return console.error('No payload found in routing message');
        try {
          await this.router.push(message.payload);
        } catch (error) {
          console.error('Failed to push route', error);
        }
      });
    } catch (error) {
      console.error('Failed to initialize router message listener', error);
    }
    return this.instance;
  }

  static destroy() {
    this.instance = undefined;
    if (this.listener) this.listener();
  }
}

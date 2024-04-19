import { ref } from 'vue';

import type { useLoadingBar } from 'naive-ui';

import { logger } from '~/stores/settings/log.store';

export class LoadingBarService {
  private static instance: ReturnType<typeof useLoadingBar>;
  private static loading = ref(false);

  static init(instance: ReturnType<typeof useLoadingBar>) {
    this.instance = instance;
  }

  static get isLoading() {
    return this.loading.value;
  }

  static start() {
    if (!this.instance?.start) logger.warn('LoadingBarService instance is not initialized');
    this.instance.start();
    this.loading.value = true;
  }

  static finish() {
    if (!this.isLoading) return;
    if (!this.instance?.finish) logger.warn('LoadingBarService instance is not initialized');
    this.instance.finish();
    this.loading.value = false;
  }

  static error() {
    if (!this.isLoading) return;
    if (!this.instance?.error) logger.warn('LoadingBarService instance is not initialized');
    this.instance.error();
    this.loading.value = false;
  }
}

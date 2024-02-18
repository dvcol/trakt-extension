import type { useLoadingBar } from 'naive-ui';

export class LoadingBarService {
  static instance: ReturnType<typeof useLoadingBar>;

  static start() {
    if (!this.instance) console.warn('LoadingBarService instance is not initialized');
    this.instance.start();
  }

  static finish() {
    if (!this.instance) console.warn('LoadingBarService instance is not initialized');
    this.instance.finish();
  }

  static error() {
    if (!this.instance) console.warn('LoadingBarService instance is not initialized');
    this.instance.error();
  }
}

import { ref } from 'vue';

import type { useLoadingBar } from 'naive-ui';

import { Logger } from '~/services/logger.service';

export class LoadingBarService {
  private static instance: ReturnType<typeof useLoadingBar>;
  private static counter = ref(0);

  static init(instance: ReturnType<typeof useLoadingBar>) {
    this.instance = instance;
  }

  static get isLoading() {
    return this.counter.value > 0;
  }

  private static increment(value = 1) {
    this.counter.value += value;
  }

  private static decrement(value = 1) {
    if (this.counter.value - value < 0) {
      this.counter.value = 0;
      return Logger.error('LoadingBarService counter is negative, resetting to 0');
    }
    this.counter.value -= value;
  }

  private static debounceStart(debounce: number) {
    return setTimeout(() => {
      if (this.isLoading) this.instance.start();
    }, debounce);
  }

  static start(debounce: number = 0) {
    this.increment();
    if (!this.instance?.start) return Logger.warn('LoadingBarService instance is not initialized');
    if (debounce) return this.debounceStart(debounce);
    this.instance.start();
  }

  static finish() {
    if (!this.isLoading) return;
    this.decrement();
    if (this.isLoading) return;
    if (!this.instance?.finish) return Logger.warn('LoadingBarService instance is not initialized');
    this.instance.finish();
  }

  static error() {
    if (!this.isLoading) return;
    this.counter.value = 0;
    if (!this.instance?.error) return Logger.warn('LoadingBarService instance is not initialized');
    this.instance.error();
  }
}

import type { useLoadingBar } from 'naive-ui';

export class LoadingBarService {
  static instance: ReturnType<typeof useLoadingBar>;
}

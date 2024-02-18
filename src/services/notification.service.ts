import type { useMessage, useNotification } from 'naive-ui';

export class NotificationService {
  static notification: ReturnType<typeof useNotification>;
  static message: ReturnType<typeof useMessage>;
}

import type { Mutable } from '@dvcol/common-utils/common';
import type { NotificationOptions, useMessage, useNotification } from 'naive-ui';

type NotificationApi = ReturnType<typeof useNotification>;
type MessageApi = ReturnType<typeof useMessage>;

export class NotificationService {
  static notification: NotificationApi;
  static message: MessageApi;

  static error(title: string, error: Error | Response | unknown, duration = 5000) {
    const option: Mutable<NotificationOptions> = {
      title,
      duration,
    };

    if (error instanceof Response) {
      option.description = error.status?.toString();
      option.content = error.statusText;
    } else if (error instanceof Error) {
      option.description = error.name;
      option.content = error.message;
    }

    this.notification.error(option);
  }
}

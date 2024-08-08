import { createTab } from '@dvcol/web-extension-utils/chrome/tabs';

import { NButton } from 'naive-ui';

import { h } from 'vue';

import type { Mutable } from '@dvcol/common-utils/common';
import type { NotificationOptions, useMessage, useNotification } from 'naive-ui';

import type { MessagePayload, MessageType } from '~/models/message/message-type.model';

import { ExternaLinks } from '~/settings/external.links';
import { useI18n } from '~/utils/i18n.utils';

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

  static release(payload: MessagePayload<typeof MessageType.VersionUpdate>) {
    const i18n = useI18n('notification');
    const notification = NotificationService.notification.info({
      title: i18n('release_title'),
      description: `From ${payload.previousVersion} to ${payload.nextVersion}`,
      content: i18n('release_content'),
      meta: new Date(payload.date).toLocaleDateString(),
      duration: 10 * 1000,
      action: () =>
        h(
          NButton,
          {
            tertiary: true,
            type: 'info',
            onClick: () => {
              createTab({ url: ExternaLinks.release });
              notification.destroy();
            },
          },
          {
            default: () => i18n('release_notes'),
          },
        ),
    });
    return notification;
  }
}

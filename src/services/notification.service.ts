import { TraktApiResponseError } from '@dvcol/trakt-http-client/models';
import { createTab } from '@dvcol/web-extension-utils/chrome/tabs';

import { NButton } from 'naive-ui';

import { h } from 'vue';

import type { Mutable } from '@dvcol/common-utils/common';
import type { ButtonProps, NotificationOptions, useMessage, useNotification } from 'naive-ui';

import type { MessagePayload, MessageType } from '~/models/message/message-type.model';

import { ExternaLinks } from '~/settings/external.links';
import { useI18n } from '~/utils/i18n.utils';

type NotificationApi = ReturnType<typeof useNotification>;
type MessageApi = ReturnType<typeof useMessage>;

const renderButton = (label: string, props: ButtonProps) => () => h(NButton, { tertiary: true, type: 'info', ...props }, { default: () => label });

export class NotificationService {
  static _notification?: NotificationApi;
  static _message?: MessageApi;

  static get notification(): NotificationApi {
    if (!this._notification) throw new Error('NotificationService not initialized');
    return this._notification;
  }

  static set notification(value: NotificationApi) {
    this._notification = value;
  }

  static get message(): MessageApi {
    if (!this._message) throw new Error('NotificationService not initialized');
    return this._message;
  }

  static set message(value: MessageApi) {
    this._message = value;
  }

  static destroy() {
    this._notification = undefined;
    this._message = undefined;
  }

  static error(title: string, error: Error | Response | unknown, duration = 5000) {
    const option: Mutable<NotificationOptions> = {
      title,
      duration,
    };

    if (error instanceof TraktApiResponseError) {
      option.description = [error.response.status, error.response.statusText].filter(Boolean).join(' - ');
      option.content = error.message;
    } else if (error instanceof Response) {
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
    const notification = this.notification.info({
      title: i18n('release_title'),
      description: `From ${payload.previousVersion} to ${payload.nextVersion}`,
      content: i18n('release_content'),
      meta: new Date(payload.date).toLocaleDateString(),
      duration: 10 * 1000,
      action: renderButton(i18n('release_notes'), {
        onClick: () => {
          createTab({ url: ExternaLinks.release });
          notification.destroy();
        },
      }),
    });
    return notification;
  }

  static userMismatch({ user, session }: { user: string; session: string }) {
    const i18n = useI18n('notification');
    const notification = this.notification.warning({
      title: 'Warning: user mismatch',
      description: `Displaying ${session} instead of ${user}`,
      content: 'Current user does not match the session. \nPlease log out and log in from trakt.tv.',
      meta: new Date().toLocaleDateString(),
      action: renderButton(i18n('sign_out'), {
        type: 'warning',
        onClick: () => {
          createTab({ url: ExternaLinks.trakt.signOut });
          notification.destroy();
        },
      }),
    });
    return notification;
  }
}

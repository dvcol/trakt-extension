import { ApiUnavailableError } from '@dvcol/web-extension-utils/chrome/error';
import { onMessageEvent, sendMessageEvent } from '@dvcol/web-extension-utils/chrome/message';

import type { ChromeMessage, ChromeMessageListener, ChromeMessageOptions, ChromeResponsePayload } from '@dvcol/web-extension-utils/chrome/models';

import type { MessagePayload, MessageTypes } from '~/models/message/message-type.model';

export const onMessage = <
  R extends ChromeResponsePayload = ChromeResponsePayload,
  T extends MessageTypes = MessageTypes,
  P extends MessagePayload = MessagePayload<T>,
>(
  types: T | T[],
  callback: ChromeMessageListener<T, P, R>,
) => onMessageEvent<T, P, R>(callback, types);

export const sendMessage = async <
  T extends MessageTypes = MessageTypes,
  R extends ChromeResponsePayload = ChromeResponsePayload,
  P extends MessagePayload = MessagePayload<T>,
>(
  message: ChromeMessage<T, P>,
  options?: ChromeMessageOptions,
) => {
  try {
    return await sendMessageEvent<T, P, R>(message, options);
  } catch (error) {
    if (error instanceof ApiUnavailableError) console.warn('Failed to send message', { message, error });
    else throw error;
  }
};

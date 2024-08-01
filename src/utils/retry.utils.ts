import { NotificationService } from '~/services/notification.service';

type ErrorDictionaryKey = string | number | symbol;
export type ErrorDictionary<T extends ErrorDictionaryKey = ErrorDictionaryKey> = Record<T, ErrorCount>;

export class ErrorCount {
  last: Date;
  count: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- necessary for unknown error types
  error?: any;

  constructor(last: Date, count: number, error?: unknown) {
    this.last = last;
    this.count = count;

    if (error instanceof Response) {
      this.error = { response: error.clone(), content: 'pending' };
      this.error.response.json().then((json: unknown) => {
        this.error.content = json;
      });
    } else {
      this.error = error;
    }
  }

  static fromDictionary<T extends ErrorDictionary>(dictionary: T, key: ErrorDictionaryKey, error?: unknown) {
    return new ErrorCount(new Date(), (dictionary?.[key]?.count ?? 0) + 1, error);
  }
}

export const shouldRetry = (
  errorCount?: ErrorCount,
  { retryCount = 2, retryTime = 10 * 1000, error }: { retryCount?: number; retryTime?: number; error?: unknown } = {},
) => {
  if (!errorCount) return true;
  if (errorCount.count < retryCount || Date.now() > errorCount.last.getTime() + retryTime) return true;
  NotificationService.error(`Error threshold exceeded, throttling requests.`, {
    count: errorCount.count,
    threshold: retryCount,
    last: errorCount.last.toLocaleString(),
    error,
  });
  throw new Error('Error threshold exceeded, throttling requests.');
};

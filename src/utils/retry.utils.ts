import { NotificationService } from '~/services/notification.service';

type ErrorDictionaryKey = string | number | symbol;
export type ErrorDictionary = Record<ErrorDictionaryKey, ErrorCount>;

export class ErrorCount {
  last: Date;
  count: number;
  error?: unknown;

  constructor(last: Date, count: number, error?: unknown) {
    this.last = last;
    this.count = count;
    this.error = error;
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

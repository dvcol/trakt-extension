// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic type
type AnyFunction<T> = (...args: any[]) => T;

export function debounce<T>(func: AnyFunction<T>, delay: number = 250): AnyFunction<Promise<T>> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return async (...args: Parameters<typeof func>[]): Promise<T> => {
    return new Promise(resolve => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(async () => {
        const result = await func(...args);
        resolve(result);
      }, delay);
    });
  };
}

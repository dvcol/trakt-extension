import { ref, type Ref } from 'vue';
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic type
type AnyFunction<T> = (...args: any[]) => Promise<T> | T;
type Timeout = ReturnType<typeof setTimeout>;

export function debounce<T>(
  func: AnyFunction<T>,
  delay: number = 250,
  timout: Ref<Timeout | undefined> = ref(),
): (...args: Parameters<typeof func>) => Promise<T> {
  const timeoutId = timout;

  return async (...args: Parameters<typeof func>[]): Promise<T> => {
    return new Promise(resolve => {
      if (timeoutId.value) clearTimeout(timeoutId.value);

      timeoutId.value = setTimeout(async () => {
        const result = await func(...args);
        resolve(result);
      }, delay);
    });
  };
}

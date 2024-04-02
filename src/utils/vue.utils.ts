import { type Ref, watch } from 'vue';

export const promesifyComputed = async <T>(computed: Ref<T>, until: (next?: T, old?: T) => boolean = next => next !== undefined): Promise<T> => {
  let unwatch: () => void;
  return new Promise(resolve => {
    unwatch = watch(
      computed,
      value => {
        if (!until(value)) return;
        resolve(value);
        unwatch?.();
      },
      { immediate: true },
    );
  });
};

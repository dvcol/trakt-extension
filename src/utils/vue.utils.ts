import { ref, type Ref, type UnwrapRef, watch, type WatchOptions } from 'vue';

import { debounce } from '~/utils/debounce.utils';

export const promisifyComputed = async <T>(computed: Ref<T>, until: (next?: T, old?: T) => boolean = next => next !== undefined): Promise<T> => {
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
export const asyncRefGetter = <T>(fn: () => Promise<T>, loading: Ref<boolean>, response = ref<T>()) => {
  const unsub = ref(false);
  return {
    response: fn().then(res => {
      if (!unsub.value) response.value = res;
      return res;
    }),
    loading,
    unsub: () => {
      unsub.value = true;
    },
  };
};

export const clearProxy = (proxy: Record<string, unknown>) => {
  // Reassign the proxy object to a new empty object
  Object.keys(proxy).forEach(key => {
    delete proxy[key];
  });
  return proxy;
};

export const clearAssign = <T extends Record<string, unknown>>(proxy: T, values?: T) => {
  clearProxy(proxy);
  if (values) Object.assign(proxy, values);
  return proxy;
};

export const useDebounceRef = <T>(outerRef: Ref<T>, delay = 100, options?: WatchOptions) => {
  const innerRef = ref<T>(outerRef.value);
  const setValue = debounce((value: UnwrapRef<T>) => {
    innerRef.value = value;
  }, delay);

  const unSubscribe = watch(outerRef, setValue, options);
  return { value: innerRef, unSubscribe, setValue };
};

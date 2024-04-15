import { ref, type Ref, watch } from 'vue';

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
};

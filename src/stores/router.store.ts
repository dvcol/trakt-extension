import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRouterStore = defineStore('router', () => {
  const baseName = ref('');
  const setBaseName = (name: string) => {
    baseName.value = name;
  };

  return { baseName, setBaseName };
});

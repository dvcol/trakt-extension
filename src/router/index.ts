import { createRouter as createVueRouter, createWebHashHistory } from 'vue-router';

import { routes } from '~/router/routes';
import { useRouterStore } from '~/stores/router.store';

export type RouterOptions = { baseName?: string; baseUrl?: string };
export const createRouter = ({ baseName = '', baseUrl = import.meta.env.BASE_URL }: RouterOptions) => {
  const { setBaseName, setBaseUrl } = useRouterStore();
  setBaseName(baseName);
  setBaseUrl(baseUrl);
  return createVueRouter({
    history: createWebHashHistory(baseUrl),
    routes: routes.map(r => ({ ...r, path: `${baseName}${r.path}` })),
  });
};

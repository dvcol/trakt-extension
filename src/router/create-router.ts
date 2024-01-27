import { createRouter as createVueRouter, createWebHashHistory } from 'vue-router';

import { Route, routes } from '~/router/routes';
import { useRouterStore } from '~/stores/router.store';
import { useSettingsStore } from '~/stores/settings.store';

export type RouterOptions = { baseName?: string; baseUrl?: string };
export const createRouter = ({ baseName = '', baseUrl = import.meta.env.BASE_URL }: RouterOptions) => {
  const { setBaseName, setBaseUrl, routeParam, setRouteParam } = useRouterStore();

  setBaseName(baseName);
  setBaseUrl(baseUrl);

  const _routes = routes.map(r => ({ ...r, path: `${baseName}${r.path}` }));

  const router = createVueRouter({
    history: createWebHashHistory(baseUrl),
    routes: [
      {
        path: '/:pathMatch(.*)',
        redirect: `${baseName}/`,
      },
      ..._routes,
    ],
  });

  const { isAuthenticated } = useSettingsStore();
  router.beforeResolve(async to => {
    const query: Record<string, string> = { ...routeParam };
    if (routeParam) setRouteParam(undefined);

    if (!isAuthenticated && to.name !== Route.Login) {
      query.redirect = to.fullPath;
      // redirect the user to the login page
      return { name: Route.Login, query };
    }
  });

  return router;
};

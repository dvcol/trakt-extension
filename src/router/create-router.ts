import { createRouter as createVueRouter, createWebHashHistory } from 'vue-router';

import { isLoginAuthResponseSuccess } from '~/models/login/login-auth-response';
import { Route, routes } from '~/router/routes';
import { TraktService } from '~/services/trakt.service';
import { useRouterStore, useRouterStoreRefs } from '~/stores/router.store';

import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';

export type RouterOptions = { baseName?: string; baseUrl?: string };
export const createRouter = ({ baseName = '', baseUrl = import.meta.env.BASE_URL }: RouterOptions) => {
  const { setBaseName, setBaseUrl, setRouteParam } = useRouterStore();
  const { routeParam } = useRouterStoreRefs();

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

  const { isAuthenticated } = useAuthSettingsStoreRefs();
  router.beforeResolve(async to => {
    const query: Record<string, string> = { ...routeParam.value };
    if (routeParam.value) setRouteParam(undefined);

    if (isLoginAuthResponseSuccess(query)) await TraktService.login(query.code);

    if (!isAuthenticated.value && to.name !== Route.Login) {
      query.redirect = to.fullPath;
      // redirect the user to the login page
      return { name: Route.Login, query };
    }
  });

  return router;
};

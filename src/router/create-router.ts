import { createRouter as createVueRouter, createWebHashHistory, type LocationQueryRaw } from 'vue-router';

import { isLoginAuthResponseSuccess } from '~/models/login/login-auth-response';
import { Route, routes } from '~/router/routes';
import { TraktService } from '~/services/trakt.service';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useRouterStore, useRouterStoreRefs } from '~/stores/router.store';

import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { logger } from '~/stores/settings/log.store';

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
        path: `${baseName}/:pathMatch(.*)`,
        redirect: { name: Route.Progress },
      },
      ..._routes,
    ],
  });

  const { waitAppReady } = useAppStateStoreRefs();
  const { isAuthenticated } = useAuthSettingsStoreRefs();
  router.beforeResolve(async to => {
    const query: LocationQueryRaw = { ...routeParam.value };
    if (routeParam.value) setRouteParam(undefined);

    if (isLoginAuthResponseSuccess(query)) {
      try {
        await TraktService.login(query.code);
      } catch (error) {
        logger.error('Failed to login with Trakt.tv');
        logger.error(error);
      }
    }

    if (!to.path.startsWith(baseName)) return;

    await waitAppReady.value;

    if (!isAuthenticated.value && to.name !== Route.Login) {
      query.redirect = to.name?.toString();
      // redirect the user to the login page
      return { name: Route.Login, query };
    }
  });

  const { restoreLastRoute, setLastRoute } = useRouterStore();

  router.afterEach(async to => {
    await setLastRoute(to);
  });

  restoreLastRoute().then(async _route => {
    await router.push(_route?.name !== Route.Login ? _route : { name: Route.Progress });
  });

  return router;
};

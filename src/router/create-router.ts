import { watch } from 'vue';
import { createRouter as createVueRouter, createWebHashHistory, type LocationQueryRaw } from 'vue-router';

import { isLoginAuthResponseSuccess } from '~/models/login/login-auth-response';
import { Route } from '~/models/router.model';
import { routes } from '~/router/routes';
import { Logger } from '~/services/logger.service';
import { TraktService } from '~/services/trakt.service';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useRouterStore, useRouterStoreRefs } from '~/stores/router.store';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { useExtensionSettingsStore, useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';

export type RouterOptions = { baseName?: string; baseUrl?: string };
export const createRouter = ({ baseName = '', baseUrl = import.meta.env.BASE_URL }: RouterOptions) => {
  const { restoreRoute, restorePanel, defaultTab } = useExtensionSettingsStoreRefs();
  const { initExtensionSettingsStore } = useExtensionSettingsStore();

  const { setBaseName, setBaseUrl, setRouteParam } = useRouterStore();
  const { routeParam } = useRouterStoreRefs();

  setBaseName(baseName);
  setBaseUrl(baseUrl);

  const _routes = routes.map(r => ({ ...r, path: `${baseName}${r.path}` }));
  const _redirects = [
    {
      name: 'root',
      path: `${baseName}/`,
      redirect: { name: defaultTab.value },
    },
    {
      name: 'root-eager',
      path: `${baseName}/:pathMatch(.*)`,
      redirect: { name: defaultTab.value },
    },
  ];

  const router = createVueRouter({
    history: createWebHashHistory(baseUrl),
    routes: [..._redirects, ..._routes],
  });

  watch(defaultTab, _default => {
    _redirects.forEach(r => {
      router.removeRoute(r.name);
      router.addRoute({
        ...r,
        redirect: { name: _default },
      });
    });
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
        Logger.error('Failed to login with Trakt.tv');
        Logger.error(error);
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
    const isNotLogin = _route?.name && _route?.name !== Route.Login;
    await initExtensionSettingsStore();
    if (!isNotLogin || !restoreRoute.value) {
      await router.push({ name: defaultTab.value });
    } else {
      if (_route?.meta?.base) {
        await router.push(_route.meta.base);
        if (!restorePanel.value) return;
      }
      await router.push(_route);
    }
  });

  return router;
};

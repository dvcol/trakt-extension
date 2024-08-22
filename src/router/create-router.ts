import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';
import { watch } from 'vue';
import { createRouter as createVueRouter, createWebHashHistory } from 'vue-router';

import { Route } from '~/models/router.model';
import { routes } from '~/router/routes';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useRouterStore } from '~/stores/router.store';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { useExtensionSettingsStore, useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';

export type RouterOptions = { baseName?: string; baseUrl?: string };
export const createRouter = ({ baseName = '', baseUrl = import.meta.env.BASE_URL }: RouterOptions) => {
  const { restoreRoute, restorePanel, defaultTab } = useExtensionSettingsStoreRefs();
  const { initExtensionSettingsStore } = useExtensionSettingsStore();

  const { setBaseName, setBaseUrl } = useRouterStore();

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
  const { isAuthenticated, waitAuthReady } = useAuthSettingsStoreRefs();
  router.beforeResolve(async to => {
    if (!chromeRuntimeId && to.name === Route.Progress) return defaultTab.value;

    if (!to.path.startsWith(baseName)) return;

    await waitAuthReady.value;
    await waitAppReady.value;

    if (!isAuthenticated.value && to.name !== Route.Login) {
      // redirect the user to the login page
      return { name: Route.Login, query: { redirect: to.name?.toString() } };
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

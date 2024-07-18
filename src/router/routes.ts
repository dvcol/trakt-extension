import type { RouteRecordRaw } from 'vue-router';

import { Route } from '~/models/router.model';

const panelRoute = (base: Route, partial: Partial<RouteRecordRaw> = {}): RouteRecordRaw =>
  ({
    props: true,
    meta: { panel: true, base },
    component: () => import('../components/views/panel/ShowPanel.vue'),
    ...partial,
  }) as RouteRecordRaw;

const panelRoutes = (base: Route): RouteRecordRaw[] => [
  panelRoute(base, {
    name: `${base}-movie`,
    path: 'movie/:movieId',
    component: () => import('../components/views/panel/MoviePanel.vue'),
  }),
  panelRoute(base, {
    name: `${base}-person`,
    path: 'person/:personId',
    component: () => import('../components/views/panel/PersonPanel.vue'),
  }),
  panelRoute(base, {
    name: `${base}-show`,
    path: 'show/:showId',
    children: [
      panelRoute(base, {
        name: `${base}-season`,
        path: 'season/:seasonNumber',
        children: [
          panelRoute(base, {
            name: `${base}-episode`,
            path: 'episode/:episodeNumber',
          }),
        ],
      }),
    ],
  }),
];

export const routes: RouteRecordRaw[] = [
  {
    path: `/${Route.Login}`,
    name: Route.Login,
    component: () => import('../components/views/login/LoginComponent.vue'),
  },
  {
    path: `/${Route.Progress}`,
    name: Route.Progress,
    component: () => import('../components/views/progress/ProgressComponent.vue'),
    children: panelRoutes(Route.Progress),
  },
  {
    path: `/${Route.Calendar}`,
    name: Route.Calendar,
    components: {
      default: () => import('../components/views/calendar/CalendarComponent.vue'),
      navbar: () => import('../components/views/calendar/CalendarNavbar.vue'),
    },
    meta: { navbar: true },
    children: panelRoutes(Route.Calendar),
  },
  {
    path: `/${Route.Releases}`,
    name: Route.Releases,
    components: {
      default: () => import('../components/views/releases/ReleasesComponent.vue'),
      navbar: () => import('../components/views/releases/ReleasesNavbar.vue'),
    },
    meta: { navbar: true },
    children: panelRoutes(Route.Releases),
  },
  {
    path: `/${Route.History}`,
    name: Route.History,
    components: {
      default: () => import('../components/views/history/HistoryComponent.vue'),
      navbar: () => import('../components/views/history/HistoryNavbar.vue'),
    },
    meta: { navbar: true },
    children: panelRoutes(Route.History),
  },
  {
    path: `/${Route.Watchlist}`,
    name: Route.Watchlist,
    components: {
      default: () => import('../components/views/watchlist/WatchlistComponent.vue'),
      navbar: () => import('../components/views/watchlist/WatchlistNavbar.vue'),
    },
    meta: { navbar: true },
    children: panelRoutes(Route.Watchlist),
  },
  {
    path: `/${Route.Search}`,
    name: Route.Search,
    components: {
      default: () => import('../components/views/search/SearchComponent.vue'),
      navbar: () => import('../components/views/search/SearchNavbar.vue'),
    },
    meta: { navbar: true },
    children: panelRoutes(Route.Search),
  },
  {
    path: `/${Route.Settings}`,
    name: Route.Settings,
    component: () => import('../components/views/settings/SettingsComponent.vue'),
    children: panelRoutes(Route.Settings),
  },
  {
    path: `/${Route.About}`,
    name: Route.About,
    component: () => import('../components/views/about/AboutComponent.vue'),
    children: panelRoutes(Route.About),
  },
];

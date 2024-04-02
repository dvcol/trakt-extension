import type { RouteRecordRaw } from 'vue-router';

export enum Route {
  Calendar = 'calendar',
  History = 'history',
  Watchlist = 'watchlist',
  Progress = 'progress',
  Search = 'search',
  Settings = 'settings',
  Login = 'login',
}

const PanelRoute = {
  component: () => import('../components/views/panel/ShowPanel.vue'),
  props: true,
  meta: { panel: true },
};

const panelRoutes: RouteRecordRaw[] = [
  {
    ...PanelRoute,
    path: 'movie/:movieId',
    component: () => import('../components/views/panel/MoviePanel.vue'),
  },
  {
    ...PanelRoute,
    path: 'person/:personId',
    component: () => import('../components/views/panel/PersonPanel.vue'),
  },
  {
    ...PanelRoute,
    path: 'show/:showId',
    children: [
      {
        ...PanelRoute,
        path: 'season/:seasonNumber',
        children: [
          {
            ...PanelRoute,
            path: 'episode/:episodeNumber',
          },
        ],
      },
    ],
  },
];

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: Route.Progress },
  },
  {
    path: `/${Route.Login}`,
    name: Route.Login,
    component: () => import('../components/views/login/LoginComponent.vue'),
  },
  {
    path: `/${Route.Progress}`,
    name: Route.Progress,
    component: () => import('../components/views/progress/ProgressComponent.vue'),
    children: panelRoutes,
  },
  {
    path: `/${Route.Calendar}`,
    name: Route.Calendar,
    components: {
      default: () => import('../components/views/calendar/CalendarComponent.vue'),
      navbar: () => import('../components/views/calendar/CalendarNavbar.vue'),
    },
    meta: { navbar: true },
    children: panelRoutes,
  },
  {
    path: `/${Route.History}`,
    name: Route.History,
    components: {
      default: () => import('../components/views/history/HistoryComponent.vue'),
      navbar: () => import('../components/views/history/HistoryNavbar.vue'),
    },
    meta: { navbar: true },
    children: panelRoutes,
  },
  {
    path: `/${Route.Watchlist}`,
    name: Route.Watchlist,
    components: {
      default: () => import('../components/views/watchlist/WatchlistComponent.vue'),
      navbar: () => import('../components/views/watchlist/WatchlistNavbar.vue'),
    },
    meta: { navbar: true },
    children: panelRoutes,
  },
  {
    path: `/${Route.Search}`,
    name: Route.Search,
    components: {
      default: () => import('../components/views/search/SearchComponent.vue'),
      navbar: () => import('../components/views/search/SearchNavbar.vue'),
    },
    meta: { navbar: true },
    children: panelRoutes,
  },
  {
    path: `/${Route.Settings}`,
    name: Route.Settings,
    component: () => import('../components/views/settings/SettingsComponent.vue'),
  },
];

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

const drawerRoutes: RouteRecordRaw[] = [
  {
    path: 'movie/:movieId',
    component: () => import('../components/views/drawer/MovieDrawer.vue'),
    props: true,
    meta: {
      drawer: true,
    },
  },
  {
    path: 'person/:personId',
    component: () => import('../components/views/drawer/MovieDrawer.vue'),
    props: true,
    meta: {
      drawer: true,
    },
  },
  {
    path: 'show/:showId',
    component: () => import('../components/views/drawer/MovieDrawer.vue'),
    props: true,
    meta: {
      drawer: true,
    },
  },
  {
    path: 'show/:showId/season/:seasonId',
    component: () => import('../components/views/drawer/MovieDrawer.vue'),
    props: true,
    meta: {
      drawer: true,
    },
  },
  {
    path: 'show/:showId/episode/:episodeId',
    component: () => import('../components/views/drawer/MovieDrawer.vue'),
    props: true,
    meta: {
      drawer: true,
    },
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
    children: drawerRoutes,
  },
  {
    path: `/${Route.Calendar}`,
    name: Route.Calendar,
    components: {
      default: () => import('../components/views/calendar/CalendarComponent.vue'),
      navbar: () => import('../components/views/calendar/CalendarNavbar.vue'),
    },
    children: drawerRoutes,
  },
  {
    path: `/${Route.History}`,
    name: Route.History,
    components: {
      default: () => import('../components/views/history/HistoryComponent.vue'),
      navbar: () => import('../components/views/history/HistoryNavbar.vue'),
    },
    children: drawerRoutes,
  },
  {
    path: `/${Route.Watchlist}`,
    name: Route.Watchlist,
    components: {
      default: () => import('../components/views/watchlist/WatchlistComponent.vue'),
      navbar: () => import('../components/views/watchlist/WatchlistNavbar.vue'),
    },
    children: drawerRoutes,
  },
  {
    path: `/${Route.Search}`,
    name: Route.Search,
    components: {
      default: () => import('../components/views/search/SearchComponent.vue'),
      navbar: () => import('../components/views/search/SearchNavbar.vue'),
    },
    children: drawerRoutes,
  },
  {
    path: `/${Route.Settings}`,
    name: Route.Settings,
    component: () => import('../components/views/settings/SettingsComponent.vue'),
  },
];

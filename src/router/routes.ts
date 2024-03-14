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
    path: `/${Route.Calendar}`,
    name: Route.Calendar,
    components: {
      default: () => import('../components/views/calendar/CalendarComponent.vue'),
      navbar: () => import('../components/views/calendar/CalendarNavbar.vue'),
    },
  },
  {
    path: `/${Route.History}`,
    name: Route.History,
    components: {
      default: () => import('../components/views/history/HistoryComponent.vue'),
      navbar: () => import('../components/views/history/HistoryNavbar.vue'),
    },
  },
  {
    path: `/${Route.Watchlist}`,
    name: Route.Watchlist,
    components: {
      default: () => import('../components/views/watchlist/WatchlistComponent.vue'),
      navbar: () => import('../components/views/watchlist/WatchlistNavbar.vue'),
    },
  },
  {
    path: `/${Route.Progress}`,
    name: Route.Progress,
    component: () => import('../components/views/progress/ProgressComponent.vue'),
  },
  {
    path: `/${Route.Search}`,
    name: Route.Search,
    component: () => import('../components/views/search/SearchComponent.vue'),
  },
  {
    path: `/${Route.Settings}`,
    name: Route.Settings,
    component: () => import('../components/views/settings/SettingsComponent.vue'),
  },
];

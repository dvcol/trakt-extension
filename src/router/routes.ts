import type { RouteRecordRaw } from 'vue-router';

export enum Route {
  Calendar = 'calendar',
  History = 'history',
  List = 'list',
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
    component: () => import('../components/views/calendar/CalendarComponent.vue'),
  },
  {
    path: `/${Route.History}`,
    name: Route.History,
    component: () => import('../components/views/history/HistoryComponent.vue'),
  },
  {
    path: `/${Route.List}`,
    name: Route.List,
    component: () => import('../components/views/list/ListComponent.vue'),
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

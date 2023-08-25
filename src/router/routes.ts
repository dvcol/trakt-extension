import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: `/`,
    name: 'home',
    component: () => import('../components/HomeView.vue'),
  },
  {
    path: `/about`,
    name: 'about',
    component: () => import('../components/AboutView.vue'),
  },
];

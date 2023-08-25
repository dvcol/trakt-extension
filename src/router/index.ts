import { createRouter as createVueRouter, createWebHashHistory } from 'vue-router';

export const createRouter = (basename: string = import.meta.env.BASE_URL) =>
  createVueRouter({
    history: createWebHashHistory(basename),
    routes: [
      {
        path: '/',
        name: 'home',
        component: () => import('../components/HomeView.vue'),
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('../components/AboutView.vue'),
      },
    ],
  });

export default createRouter;

import type { RouteRecordRaw } from 'vue-router';
import BasicLayout from '@/layout/BlankLayout/index.vue';

export const root = {
  path: '/',
  name: 'Root',
  component: BasicLayout,
  meta: {
    title: 'Root',
  },
  children: [
    {
      path: '/playground',
      component: () => import('@/views/Playground/index.vue'),
      name: 'Playground',
      meta: {
        title: '示范区综合管理',
        iconSize: 16,
      },
    },
  ],
  redirect: '/playground',
};

const routes: Array<RouteRecordRaw> = [
  root,
  {
    path: '/:pathMatch(.*)',
    name: '404',
    meta: {
      hideInMenu: true,
    },
    component: () => import('@/views/Exception/404.vue'),
  },
];

export default routes;

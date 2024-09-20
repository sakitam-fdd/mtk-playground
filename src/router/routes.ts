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
      path: '/index',
      component: () => import('@/views/Index/index.vue'),
      name: 'index',
      meta: {
        title: '首页',
        iconSize: 16,
      },
    },
    {
      path: '/playgrounds',
      component: () => import('@/views/List'),
      name: 'List',
      meta: {
        title: '示例列表',
        iconSize: 16,
      },
    },
    {
      path: '/playground',
      component: () => import('@/views/Playground/index.vue'),
      name: 'Playground',
      meta: {
        title: '编辑器',
        iconSize: 16,
      },
    },
  ],
  redirect: '/index',
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

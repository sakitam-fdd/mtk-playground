import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createRouterGuard } from '@/router/guard';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      if (savedPosition) {
        resolve(savedPosition);
      } else if (from.meta.saveSrollTop) {
        const top: number = document.documentElement.scrollTop || document.body.scrollTop;
        resolve({ left: 0, top });
      }
    });
  },
});

export async function setupRouter(app: App) {
  app.use(router);
  await createRouterGuard(router);
  await router.isReady();
}

export function resetRouter() {
  window.location.reload();
}

export default router;

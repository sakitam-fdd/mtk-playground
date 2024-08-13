import type { Router } from 'vue-router';
import { isNavigationFailure } from 'vue-router';
import NProgress from 'nprogress';
import { isEmpty } from 'lodash-es';
import { useEnumsStore } from '@/store/modules';

NProgress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3,
});

async function setupPageGuard(router: Router) {
  const enumsStore = useEnumsStore();

  router.beforeEach(async (to, from, next) => {
    if (!NProgress.isStarted()) {
      NProgress.start();
    }

    const commonEnum = toRaw(enumsStore.enum);

    // 正常来说我们仅请求一次全局枚举数据
    if (isEmpty(commonEnum)) {
      // await enumsStore.getEnums();
    }

    next();
  });

  router.afterEach((to, _, failure) => {
    if (isNavigationFailure(failure)) {
      console.log('路由跳转失败', failure);
    }
    NProgress.done();
  });

  router.onError((error) => {
    console.error('路由报错', error);
  });
}

/**
 * 创建导航守卫
 * @param router 路由实例
 */
export async function createRouterGuard(router: Router) {
  try {
    await setupPageGuard(router);
  } catch (error) {
    console.error('导航守卫创建失败', error);
  }
}

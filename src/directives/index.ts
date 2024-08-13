import type { App } from 'vue';
import VueLazyLoad from 'vue3-lazyload';
import { ElLoading } from 'element-plus';
import { MotionPlugin } from '@vueuse/motion';
import { optimize } from './optimize';

/**
 * 注册自定义指令
 * @param app Vue实例
 */
export function setupDirectives(app: App) {
  app.use(ElLoading);
  app.use(MotionPlugin);
  app.use(VueLazyLoad, {});
  app.directive('optimize', optimize);
}

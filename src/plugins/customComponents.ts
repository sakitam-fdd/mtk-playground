import type { App } from 'vue';
import Motion from '@/components/Motion';
import GlobalComponents from '@/components';

/**
 * @param app
 */
const registerComponents = [Motion];

/**
 * 注册自定义组件
 * @param app Vue实例
 */
export function setupCustomComponents(app: App) {
  registerComponents.forEach((component) => {
    app.component(component.name, component);
  });

  app.use(GlobalComponents);
}

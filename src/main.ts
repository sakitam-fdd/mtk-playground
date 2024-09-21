import 'virtual:uno.css';
import { setupRouter } from '@/router';
import { setupStore } from '@/store';
import { setupDirectives } from '@/directives';
import { setupCustomComponents, setupGlobalMethods, setupAssets, setupMixins } from '@/plugins';

import App from '@/App.vue';

async function bootStrap() {
  window.VUE_DEVTOOLS_CONFIG = {
    defaultSelectedAppId: 'repl',
  };

  globalThis.__VUE_OPTIONS_API__ = true;

  // 设置样式加载
  setupAssets();
  // 创建vue
  const app = createApp(App);

  // 注册全局常用的 组件
  setupCustomComponents(app);

  // 注册全局方法
  setupGlobalMethods(app);

  // 注册全局自定义指令
  setupDirectives(app);

  // 注册 mixins
  setupMixins(app);

  // 挂载状态管理
  await setupStore(app);

  // 挂载路由
  await setupRouter(app);

  app.mount('#app');
}

bootStrap();

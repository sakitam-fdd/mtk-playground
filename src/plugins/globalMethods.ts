import type { App } from 'vue';
/**
 * @param code
 */
function print(code: string) {
  console.log(code);
}

const globalMethods = [
  {
    sign: 'print',
    method: print,
  },
];

/**
 * 设置全局方法
 * @param app Vue实例
 */
export function setupGlobalMethods(app: App) {
  globalMethods.forEach((item) => {
    app.config.globalProperties[item.sign] = item.method;
  });
}

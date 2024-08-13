/**
 * vite启动时会将 include 里的模块，编译成 esm 格式并缓存到 node_modules/.vite
 * 禁用浏览器缓存时必须将对应模块加入到 include里，否则会遇到开发环境切换页面卡顿的问题
 * 第三方库是全局引入（即引入到src/main.ts），就不需要再添加到 include 里，vite 会自动缓存到 node_modules/.vite
 */
const include = [
  'dayjs',
  'pinia',
  'vue-i18n',
  'element-plus',
  'lodash-es',
  'colord',
  '@vueuse/core',
  '@vueuse/motion',
  'eventemitter3',
];

/**
 * 在预构建中强制排除的依赖项
 * 图标模块
 */
const exclude: string[] = ['@vue/repl'];

export { include, exclude };

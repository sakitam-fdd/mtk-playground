/// <reference types="vitest" />

import type { UserConfig, ConfigEnv } from 'vite';
import { loadEnv } from 'vite';
import dayjs from 'dayjs';
import { pick } from 'lodash-es';

import { createVitePlugins } from './build/vite/plugin';
import { wrapperEnv, createProxy, pathResolve } from './build/utils';
import { include, exclude } from './build/vite/optimize';
import pkg from './package.json' assert { type: 'json' };

const APP_INFO = {
  pkg: pick(pkg, ['name', 'version']),
  lastBuildTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
};

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const isBuild = command === 'build';
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);

  return {
    base: viteEnv.BASE_DIR || './',
    server: {
      host: true, // 可以以IP访问
      port: viteEnv.VITE_PORT || 8080, // 端口
      open: false, // 是否自动打开游览器
      cors: true, // 允许跨域
      proxy: createProxy(viteEnv.VITE_PROXY),
      // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
      warmup: {
        clientFiles: ['./index.html', './src/{views,components}/*'],
      },
    },
    resolve: {
      alias: [
        {
          find: /\/#\//,
          replacement: `${pathResolve('types')}/`,
        },
        {
          find: '@',
          replacement: `${pathResolve('src')}/`,
        },

        {
          find: '~',
          replacement: `${pathResolve('.')}/`,
        },
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // 解决i8n警告
        },
      ],
      dedupe: ['vue'],
    },
    css: {
      preprocessorOptions: {
        // 全局引入了 scss 的文件
        scss: {
          // 添加你的全局共享scss文件
          additionalData: `
          @use "@/styles/light.scss";
          @use "@/styles/dark.scss";
          `,
          javascriptEnabled: true,
        },
        less: {
          globalVars: {},
          // 支持内联 JavaScript
          javascriptEnabled: true,
          sourceMap: true,
        },
      },
      postcss: {},
      modules: {
        localsConvention: 'camelCase',
      },
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    define: {
      __APP_INFO__: JSON.stringify(APP_INFO),
    },
    esbuild: {
      pure: ['console.log'],
      drop: ['debugger'],
      legalComments: 'none',
    },
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      assetsInlineLimit: 2048, // 单位字节,小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项。
      minify: 'terser',
      chunkSizeWarningLimit: 2000,
      assetsDir: 'static/assets',
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            common: ['lodash-es', 'lodash'],
            element: ['element-plus', '@element-plus/icons-vue'],
          },
        },
      },
    },
    optimizeDeps: {
      include,
      exclude,
    },
    test: {
      include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
      environment: 'jsdom',
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        {
          find: '@',
          replacement: `${pathResolve('src')}/`,
        },
      ],
    },
  };
};
